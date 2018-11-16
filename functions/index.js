const functions = require("firebase-functions");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const Handlebars = require("handlebars");

function parse(json) {
  if (!json.dishes.length) {
    throw new Error("Dish not found...");
  }

  const id = json.dishes[0]._id;
  const dish = json.dishes[0]._source;
  const restaurant = json.restaurants[0]._source;

  const thumbURL = `https://d39k7p1a16t3h6.cloudfront.net/submissions/${
    dish.photos[0]
  }.jpg`;

  let title = `${dish.name} - ${restaurant.name} • ${restaurant.city}`;

  const lat = dish.location[1];
  const lng = dish.location[0];

  const mapURL = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${
    restaurant.place
  }`;

  let dishName = `${dish.name}`;

  if (dish.price) {
    title = `${dish.name} $${dish.price} - ${restaurant.name} • ${
      restaurant.city
    }`;
    dishName += ` <span class="money">$${dish.price}</span>`;
  }

  const number = restaurant.number;

  const restaurantName = restaurant.name;

  const address = `${restaurant.address.top}<br>${restaurant.address.bottom}`;

  const tags = dish.tags.join(", ");

  return {
    thumbURL,
    title,
    mapURL,
    dishName,
    number,
    address,
    restaurantName,
    id,
    tags
  };
}

const source = fs.readFileSync(`${__dirname}/dish.html`, "utf8").toString();
const dishTemplate = Handlebars.compile(source);

exports.dish = functions.https.onRequest((req, res) => {
  const id = req.path.split("dish/")[1];

  if (!id) {
    res.sendStatus(404);
    return;
  }

  const url = `https://sprinkle.ideakeg.xyz/api/v2/dishes`;

  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ids: [id]
    })
  })
    .then(res => res.json())
    .then(parse)
    .then(data => {
      res.send(dishTemplate(data));
      return;
    })
    .catch(error => {
      res.sendStatus(500);
    });
});
