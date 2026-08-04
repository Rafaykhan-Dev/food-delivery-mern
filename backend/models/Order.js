const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantName: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
  orderStatus: { type: String, default: 'Placed' }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
