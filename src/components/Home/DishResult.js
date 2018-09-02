import React from "react";
import { connect } from "react-redux";

import styles from "./styles.css";
import { makeDish, actions } from "reducers/data";

const DishResult = ({ index, dish, onClick, selected }) => (
  <div
    className={styles.item}
    style={{ backgroundColor: selected ? "#f2f2f2" : "#fff" }}
    onClick={onClick}
  >
    <img src={dish.thumb} className={styles.preview} alt="of food" />
    <div className={styles.itemInfo}>
      <div className={styles.itemName}>
        {index + 1}. {dish.name}
        <span className={styles.itemPrice}>
          {dish.price && ` $${dish.price}`}
        </span>
      </div>
      <div className={styles.itemTags}>{dish.tags.join(", ")}</div>
      <div className={styles.itemRestaurant}>{dish.restaurant.name}</div>
      <div className={styles.itemDetail}>
        {dish.restaurant.address.top}
        <br />
        {dish.restaurant.city}
      </div>
    </div>
  </div>
);

const state = () => (state, props) => ({
  dish: makeDish()(state, props.id),
  selected: state.data.selected === props.id
});

const dispatch = (dispatch, props) => ({
  onClick: () => {
    const { id } = props;
    dispatch(actions.set({ selected: id }));
  }
});

export default connect(
  state,
  dispatch
)(DishResult);
