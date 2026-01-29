const express = require('express');
const Package = require('../models/Package');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { packageName, packageDescription, packagePrice } = req.body;
  if (!packageName || !packageDescription || packagePrice == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const created = await Package.create({ packageName, packageDescription, packagePrice });
  return res.status(201).json({ message: 'Package created', id: created._id });
});

router.get('/', requireAuth, async (_req, res) => {
  const rows = await Package.find().sort({ _id: -1 });
  return res.json(rows);
});

module.exports = router;
