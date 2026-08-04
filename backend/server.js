const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://127.0.0.1:27017/food_delivery';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully on your Mac! 🍔🔥'))
  .catch(err => console.error('Database connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => {
  res.send('Food Delivery Management System API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
