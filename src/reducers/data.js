import { combineReducers } from "redux";
import Immutable from "immutable";
import { createActions } from "lib/actions";
import { createSelector } from "reselect";

const mutations = ["set", "get", "update"];

export const { actions, types } = createActions(mutations, "data");

const getID = (state, id) => id;
const getDishes = state => state.data.dishes;
const getRestaurants = state => state.data.restaurants;
export const makeDish = () =>
  createSelector(
    [getID, getDishes, getRestaurants],
    (id, dishes, restaurants) => {
      const dish = dishes.get(id);
      const restaurant = restaurants.get(dish.restaurantId);
      return {
        ...dish,
        restaurant,
        thumb: `https://d39k7p1a16t3h6.cloudfront.net/thumb/${id}/${
          dish.thumb
        }.jpg`
      };
    }
  );

export const resultList = createSelector(
  state => state.data.results,
  state => state.data.dishes,
  state => state.data.restaurants,
  (results, dishes, restaurants) => {
    return results.map((id, index) => {
      const dish = dishes.get(id);
      const restaurant = restaurants.get(dish.restaurantId);
      return {
        index,
        ...dish,
        restaurant
      };
    });
  }
);

export default combineReducers({
  results: function(state = [], { type, payload }) {
    switch (type) {
      case types.set:
        return payload.results ? payload.results : state;
      default:
        return state;
    }
  },
  dishes: function(state = Immutable.Map({}), { type, payload }) {
    switch (type) {
      case types.set:
        return payload.dishes
          ? state.merge(Immutable.Map(payload.dishes))
          : state;
      default:
        return state;
    }
  },
  restaurants: function(state = Immutable.Map({}), { type, payload }) {
    switch (type) {
      case types.set:
        return payload.restaurants
          ? state.merge(Immutable.Map(payload.restaurants))
          : state;
      default:
        return state;
    }
  },
  selected: function(state = null, { type, payload }) {
    switch (type) {
      case types.set:
        return payload.selected !== undefined ? payload.selected : state;
      default:
        return state;
    }
  }
});
