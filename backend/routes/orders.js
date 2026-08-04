const router = require('express').Router();
const Order = require('../models/Order');

router.post('/place', async (req, res) => {
  try {
    const { userId, restaurantName, items, totalAmount, paymentMethod } = req.body;
    const newOrder = new Order({ userId, restaurantName, items, totalAmount, paymentMethod });
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: savedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
