const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

const mongoURI = 'mongodb://127.0.0.1:27017/food_delivery';

const data = [
  // Your original 2 restaurants
  {
    name: "Burger Junction",
    cuisineType: "Fast Food",
    rating: 4.5,
    menu: [
      { name: "Cheese Burger Smash", price: 8, category: "Burgers" },
      { name: "Crispy Chicken Zinger", price: 10, category: "Burgers" },
      { name: "Loaded Peri Fries", price: 5, category: "Sides" }
    ]
  },
  {
    name: "Pizzeria Delizia",
    cuisineType: "Italian Pizza",
    rating: 4.8,
    menu: [
      { name: "Pepperoni Feast Pizza", price: 14, category: "Pizza" },
      { name: "Margherita Classic", price: 12, category: "Pizza" },
      { name: "Garlic Breadsticks", price: 4, category: "Sides" }
    ]
  },
  // The 6 Popular Brands from your UI design layout
  {
    name: "McDonald's London",
    cuisineType: "Burgers & Fast Food",
    rating: 4.8,
    menu: [
      { name: "Big Mac Meal Deal", price: 9, category: "Burgers" },
      { name: "McFlurry Oreo Treat", price: 3, category: "Desserts" },
      { name: "Golden French Fries", price: 4, category: "Sides" }
    ]
  },
  {
    name: "Papa Johns",
    cuisineType: "Pizza & Sides",
    rating: 4.5,
    menu: [
      { "name": "The Works Pizza", "price": 15, "category": "Pizza" },
      { "name": "Garlic Pizza Sticks", "price": 6, "category": "Sides" }
    ]
  },
  {
    name: "KFC",
    cuisineType: "Fried Chicken & Fast Food",
    rating: 4.3,
    menu: [
      { "name": "8 Pc Bucket Feast", "price": 20, "category": "Buckets" },
      { "name": "Zinger Burger", "price": 7, "category": "Burgers" }
    ]
  },
  {
    name: "Texas Chicken",
    cuisineType: "Southern Fried Chicken",
    rating: 4.2,
    menu: [
      { "name": "Mega Crunch Combo", "price": 11, "category": "Combos" },
      { "name": "Honey Butter Biscuits", "price": 4, "category": "Sides" }
    ]
  },
  {
    name: "Burger King",
    cuisineType: "Flame-Broiled Burgers",
    rating: 4.4,
    menu: [
      { "name": "Whopper Meal Combo", "price": 9, "category": "Burgers" },
      { "name": "Onion Rings Large", "price": 4, "category": "Sides" }
    ]
  },
  {
    name: "Shaurma 1",
    cuisineType: "Middle Eastern Wraps",
    rating: 4.7,
    menu: [
      { "name": "Classic Chicken Shaurma", "price": 8, "category": "Wraps" },
      { "name": "Hummus & Pita Plate", "price": 5, "category": "Appetizers" }
    ]
  }
];

mongoose.connect(mongoURI)
  .then(async () => {
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(data);
    console.log('Success! All 8 restaurants have been added to your database! 🍕🍔🍟');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit();
  });