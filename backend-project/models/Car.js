const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  carType: { type: String, required: true },
  carSize: { type: String, required: true },
  driverName: { type: String, required: true },
  phoneNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);
