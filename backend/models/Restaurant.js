const mongoose = require('mongoose');
const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
});
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisineType: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  menu: [FoodItemSchema]
});
module.exports = mongoose.model('Restaurant', RestaurantSchema);
