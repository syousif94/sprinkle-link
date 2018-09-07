import React, { Component } from "react";
import { connect } from "react-redux";
import * as MapboxGl from "mapbox-gl";
import { push } from "react-router-redux";
import EventEmitter from "eventemitter3";

import styles from "./styles.css";
import UserMarker from "./UserMarker";
import RestaurantMarker from "./RestaurantMarker";
import api from "lib/api";
import _ from "lodash";
import * as Data from "reducers/data";
import * as Search from "reducers/search";
import store from "models/Store";
import List from "components/List";
import SearchQuery from "models/SearchQuery";

MapboxGl.accessToken =
  "pk.eyJ1IjoiaGFtZWVkbyIsImEiOiJHMnhTMDFvIn0.tFZs7sYMghY-xovxRPNNnw";

class MapView extends Component {
  static style = "mapbox://styles/mapbox/streets-v10";
  static center = [-97.667684070742538, 33.229236835987024];
  static zoom = [3.5];
  static minZoom = [2];
  static colors = ["#F272A7", "#FB9F6A", "#7DDAD7", "#EBD36D", "#92DA7D"];
  static emitter = new EventEmitter();

  componentDidMount() {
    this._map = new MapboxGl.Map({
      container: this._mapRef,
      style: MapView.style,
      center: MapView.center,
      zoom: MapView.zoom,
      minZoom: MapView.minZoom,
      dragRotate: false,
      pitchWithRotate: false
    });

    this._map.on("load", this._onLoad);

    this._map.on("click", this._onMapClick);

    MapView.emitter.on("bounds", this._onBounds);

    MapView.emitter.on("search", this._getDishes);
  }

  componentWillUnmount() {
    if (this._unsub) {
      this._unsub();
    }
  }

  _onBounds = bounds => {
    const fitTo = [
      [bounds.southwest.lng, bounds.southwest.lat],
      [bounds.northeast.lng, bounds.northeast.lat]
    ];

    this._map.fitBounds(fitTo);
  };

  _onMapClick = e => {
    this.props.setData({ selected: null });
    List.emitter.emit("selected", null);
  };

  _onLoad = async () => {
    await this._getDishes();

    this._watchSelected();

    this._watchBounds();
  };

  _watchStore = () => {
    const watchSelected = this._watchSelected();
    const watchUser = this._watchUser();

    this._unsub = store.subscribe(() => {
      const state = store.getState();

      watchSelected(state);
      watchUser(state);
    });
  };

  _watchUser = () => {
    let watchId;

    const marker = UserMarker();

    return state => {
      const {
        user: { watch }
      } = state;

      if (!watch && watchId) {
        navigator.geolocation.clearWatch(watchId);
        return;
      } else if (watchId) {
        return;
      }

      watchId = navigator.geolocation.watchPosition(location => {
        marker.setLngLat([location.coords.longitude, location.coords.latitude]);
        marker.addTo(this._map);
      });
    };
  };

  _watchBounds = () => {
    const onChange = () => {
      requestAnimationFrame(() => {
        const bounds = this._getBounds();
        this.props.setSearch({ bounds });
        this._getDishes();
      });
    };

    const debounced = _.debounce(onChange, 350);

    this._map.on("zoomend", debounced);
    this._map.on("moveend", debounced);
    this._map.on("resize", debounced);
  };

  _selectedMarker;

  _watchSelected = () => {
    let previouslySelected;

    return state => {
      const {
        data: { selected, dishes }
      } = state;

      if (previouslySelected && previouslySelected === selected) {
        return;
      }

      previouslySelected = selected;

      if (this._selectedMarker) {
        this._selectedMarker.toggle();
      }

      if (!selected) {
        this._selectedMarker = null;
        return;
      }

      const dish = dishes.get(selected);

      this._selectedMarker = this._markers[dish.restaurantId];

      if (this._selectedMarker) {
        this._selectedMarker.toggle();

        const el = this._selectedMarker.mapbox.getElement();

        const img = el.getElementsByClassName(styles.img)[0];

        const src = img.src;
        const splitSrc = src.split("/");
        const lastIndex = splitSrc.length - 1;

        const currentThumb = splitSrc[lastIndex].replace(".jpg", "");

        if (currentThumb === dish.thumb) {
          return;
        }

        splitSrc[lastIndex] = `${dish.thumb}.jpg`;

        img.src = splitSrc.join("/");
      }
    };
  };

  _getBounds = () => {
    const bounds = this._map.getBounds();
    const top_left = bounds.getNorthWest();
    const bottom_right = bounds.getSouthEast();

    return {
      top_left: [top_left.lng, top_left.lat],
      bottom_right: [bottom_right.lng, bottom_right.lat]
    };
  };

  _getDishes = async () => {
    this.props.setSearch({ loading: true });
    const res = await this._fetchDishes();

    this.props.setData({
      results: res.dishes.map(dish => dish._id),
      dishes: _(res.dishes)
        .keyBy("_id")
        .mapValues((doc, id) => {
          return {
            id,
            ...doc._source
          };
        })
        .value(),
      restaurants: _(res.restaurants)
        .keyBy("_id")
        .mapValues((doc, id) => {
          return {
            id,
            ...doc._source
          };
        })
        .value()
    });

    this.props.setSearch({ loading: false });
  };

  _fetchDishes = async () => {
    let {
      search: { bounds }
    } = store.getState();

    if (_.isEmpty(bounds)) {
      bounds = this._getBounds();
      this.props.setSearch({ bounds });
    }

    const res = await api("query", SearchQuery(), 7);

    const restaurants = _.keyBy(res.restaurants, "_id");

    const dishes = {};

    const markers = {};

    for (const index in res.dishes) {
      const dish = res.dishes[index];

      dishes[dish._id] = dish;

      if (markers[dish._source.restaurantId]) {
        markers[dish._source.restaurantId].dishes[index] = dish;
      } else {
        markers[dish._source.restaurantId] = {
          restaurant: restaurants[dish._source.restaurantId],
          dishes: {
            [index]: dish
          },
          selected: index,
          mapbox: undefined,
          toggle: undefined
        };
      }
    }

    this._renderMarkers(markers);

    return res;
  };

  static Marker = {
    height: 184,
    width: 150
  };

  _markers = {};

  _orderedMarkers = [];

  _renderMarkers = markers => {
    this._orderedMarkers = [];

    if (_.size(this._markers)) {
      _.map(this._markers, (marker, key) => {
        if (!markers[key]) {
          marker.mapbox.remove();
          delete this._markers[key];
        }
      });
    }

    this._markers = _.mapValues(markers, (marker, key) => {
      if (this._markers[key]) {
        marker.mapbox = this._markers[key].mapbox;
        marker.toggle = this._markers[key].toggle;

        this._orderedMarkers.push(marker.mapbox);

        return marker;
      }

      const { dishes, restaurant, selected } = marker;

      const dish = dishes[selected];

      const scale = 0.35;

      const dimensions = this._markerStyleForScale(scale);

      const onClick = id => e => {
        e.stopPropagation();
        this.props.setData({ selected: id });
        List.emitter.emit("selected", id);
      };

      marker.mapbox = RestaurantMarker(dish, restaurant, dimensions, onClick);

      let expanded = false;

      const bigResize = this._resizeMarker(this._markerStyleForScale(0.75));
      const smallResize = this._resizeMarker(this._markerStyleForScale(0.35));

      marker.toggle = () => {
        const resize = expanded ? smallResize : bigResize;
        resize(marker.mapbox);
        const el = marker.mapbox.getElement();
        el.classList.toggle(styles.bigMarker);
        const restaurant = el.getElementsByClassName(styles.markerText)[0];
        restaurant.classList.toggle(styles.bigMarkerText);
        expanded = !expanded;
      };

      this._orderedMarkers.push(marker.mapbox);

      return marker;
    });

    this._orderedMarkers.reverse().map(marker => marker.addTo(this._map));
  };

  _markerStyleForScale = scale => {
    const currentHeight = MapView.Marker.height * scale;
    const currentWidth = MapView.Marker.width * scale;
    const imageWidth = currentWidth * 0.82;
    const imageLeft = (currentWidth - imageWidth) / 2;
    const imageTop = imageLeft - 0.5;
    const imageBorder = 5 * (scale / 0.25);
    const imageStyle = `top: ${imageTop}px; left: ${imageLeft}px; border-radius: ${imageBorder}px`;

    return {
      currentHeight,
      currentWidth,
      imageWidth,
      imageLeft,
      imageTop,
      imageStyle,
      imageBorder
    };
  };

  _resizeMarker = styles => marker => {
    const {
      currentHeight,
      currentWidth,
      imageTop,
      imageLeft,
      imageWidth,
      imageBorder
    } = styles;
    const el = marker.getElement();
    el.style.height = `${currentHeight}px`;
    el.style.width = `${currentWidth}px`;

    const svg = el.childNodes[1];
    svg.style.height = `${currentHeight}px`;
    svg.style.width = `${currentWidth}px`;

    const img = el.childNodes[3];
    img.style.top = `${imageTop}px`;
    img.style.left = `${imageLeft}px`;
    img.style.height = `${imageWidth}px`;
    img.style.width = `${imageWidth}px`;
    img.style.borderRadius = `${imageBorder}px`;

    marker.setOffset([0, currentHeight / -2]);
  };

  _resizeMarkers = () => {
    const onZoom = () => {
      const zoom = this._map.getZoom();

      const maxScale = 0.6;
      const minScale = 0.25;
      const scale = zoom / (3.5 / minScale);

      let constrainedScale = scale;
      if (scale > maxScale) {
        constrainedScale = maxScale;
      } else if (scale < minScale) {
        constrainedScale = minScale;
      }

      const styles = this._markerStyleForScale(constrainedScale);

      const resize = this._resizeMarker(styles);

      this._orderedMarkers.forEach(resize);
    };

    this._map.on("zoomend", _.debounce(onZoom, 150));
  };

  _setMapRef = ref => {
    this._mapRef = ref;
  };

  render() {
    return <div className={styles.map} ref={this._setMapRef} />;
  }
}

const mapDispatchToProps = {
  push,
  setData: Data.actions.set,
  setSearch: Search.actions.set
};

export default connect(
  null,
  mapDispatchToProps
)(MapView);
