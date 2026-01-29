const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
