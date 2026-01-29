const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  packageName: { type: String, required: true },
  packageDescription: { type: String, required: true },
  packagePrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);
