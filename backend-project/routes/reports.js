const express = require('express');
const ServiceRecord = require('../models/ServiceRecord');
const Payment = require('../models/Payment');
const Car = require('../models/Car');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/bill/:recordNumber', requireAuth, async (req, res) => {
  const { recordNumber } = req.params;
  const record = await ServiceRecord.findById(recordNumber)
    .populate('package')
    .populate('payment')
    .lean();

  if (!record) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const car = await Car.findOne({ plateNumber: record.plateNumber }).lean();

  return res.json({
    record_number: record._id,
    service_date: record.serviceDate,
    plate_number: record.plateNumber,
    driver_name: car?.driverName || null,
    phone_number: car?.phoneNumber || null,
    package_name: record.package?.packageName || null,
    package_description: record.package?.packageDescription || null,
    package_price: record.package?.packagePrice || null,
    amount_paid: record.payment?.amountPaid || null,
    payment_date: record.payment?.paymentDate || null
  });
});

router.get('/daily', requireAuth, async (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ message: 'date is required in YYYY-MM-DD' });
  }
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const payments = await Payment.find({
    paymentDate: { $gte: start, $lt: end }
  }).select('_id paymentDate amountPaid');

  const paymentIds = payments.map((p) => p._id);

  const records = await ServiceRecord.find({ payment: { $in: paymentIds } })
    .populate('package')
    .populate('payment')
    .lean();

  const mapped = records.map((r) => ({
    plate_number: r.plateNumber,
    package_name: r.package?.packageName || null,
    package_description: r.package?.packageDescription || null,
    amount_paid: r.payment?.amountPaid || null,
    payment_date: r.payment?.paymentDate || null
  }));

  return res.json(mapped);
});

module.exports = router;
