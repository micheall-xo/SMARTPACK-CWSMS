const express = require('express');
const Payment = require('../models/Payment');
const ServiceRecord = require('../models/ServiceRecord');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { amountPaid, paymentDate, serviceRecordId } = req.body;
  if (amountPaid == null || !paymentDate || !serviceRecordId) {
    return res.status(400).json({ message: 'Amount paid, payment date, and serviceRecordId are required' });
  }
  const created = await Payment.create({ amountPaid, paymentDate });
  await ServiceRecord.findByIdAndUpdate(serviceRecordId, { payment: created._id });
  return res.status(201).json({ message: 'Payment created', id: created._id });
});

router.get('/', requireAuth, async (_req, res) => {
  const rows = await Payment.find().sort({ _id: -1 }).lean();
  return res.json(rows);
});

module.exports = router;
