import * as MapboxGl from "mapbox-gl";

import styles from "./styles.css";

const colors = ["#F272A7", "#FB9F6A", "#7DDAD7", "#EBD36D", "#92DA7D"];

function RestaurantMarker(dish, restaurant, dimensions, onClick) {
  const { currentHeight, currentWidth, imageWidth, imageStyle } = dimensions;

  const {
    _id: id,
    _source: { thumb, location }
  } = dish;

  const color = colors[restaurant._source.color];

  const el = document.createElement("div");

  el.addEventListener("click", onClick(id));

  el.style.height = currentHeight;
  el.style.width = currentWidth;
  el.className = styles.marker;
  el.innerHTML = `
      <svg viewBox="0 0 150 184" width="${currentWidth}" height="${currentHeight}">
          <defs>
              <filter id="canvas3-lightShadow-outer" filterUnits="userSpaceOnUse">
                  <feGaussianBlur stdDeviation="2" />
                  <feOffset dx="0" dy="0.5" result="blur" />
                  <feFlood flood-color="rgb(132, 132, 132)" flood-opacity="0.8" />
                  <feComposite in2="blur" operator="in" result="colorShadow" />
                  <feComposite in="SourceGraphic" in2="colorShadow" operator="over" />
              </filter>
          </defs>
          <g id="canvas3-mapMarker" filter="url(#canvas3-lightShadow-outer)">
              <rect id="canvas3-rectangle" stroke="none" fill="${color}" x="4" y="3" width="142" height="142" rx="30" />
              <path id="canvas3-polygon" stroke="none" fill="${color}" d="M 75,179 C 78,179 87.12,142.75 87.12,142.75 L 62.88,142.75 C 62.88,142.75 72,179 75,179 Z M 75,179" />
          </g>
      </svg>
      <img style="${imageStyle}" height="${imageWidth}px" width="${imageWidth}px" src="https://d39k7p1a16t3h6.cloudfront.net/thumb/${id}/${thumb}.jpg" class="${
    styles.img
  }" />
      <div class="${styles.markerText}">
        <div class="${styles.restaurant}">
          ${restaurant._source.name}
        </div>
        <div class="${styles.address}">
          ${restaurant._source.address.top}
          <br />
          ${restaurant._source.city}
        </div>
      </div>
      `;

  return new MapboxGl.Marker(el, {
    offset: [0, currentHeight / -2]
  }).setLngLat(location);
}

export default RestaurantMarker;
