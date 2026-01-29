const express = require('express');
const Car = require('../models/Car');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { plateNumber, carType, carSize, driverName, phoneNumber } = req.body;
  if (!plateNumber || !carType || !carSize || !driverName || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    await Car.create({ plateNumber, carType, carSize, driverName, phoneNumber });
    return res.status(201).json({ message: 'Car created' });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Plate number already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', requireAuth, async (_req, res) => {
  const cars = await Car.find().sort({ createdAt: -1 }).lean();
  return res.json(cars);
});

module.exports = router;
