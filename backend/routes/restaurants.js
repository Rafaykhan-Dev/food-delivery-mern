const router = require('express').Router();
const Restaurant = require('../models/Restaurant');

router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { cuisineType: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const saved = await newRestaurant.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
