const mongoose = require('mongoose');

const ServiceRecordSchema = new mongoose.Schema({
  serviceDate: { type: Date, required: true },
  plateNumber: { type: String, required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRecord', ServiceRecordSchema);
