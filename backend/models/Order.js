// // /backend/src/models/Order.js
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   customerName: String,
//   customerLocation: { type: { lat: Number, lng: Number } },
//   items: [String],
//   status: { type: String, default: 'Pending' },

// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerLocation: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  },
  items: {
    type: [String], // Array of items
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Delivered'], // Add other possible statuses
    default: 'Pending',
  },
  assignedStore: {
    type: String, // Assuming the assigned store has an identifier
    required: true,
  },
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
