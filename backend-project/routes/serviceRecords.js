const express = require('express');
const ServiceRecord = require('../models/ServiceRecord');
const Car = require('../models/Car');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { serviceDate, plateNumber, packageNumber, paymentNumber } = req.body;
  if (!serviceDate || !plateNumber || !packageNumber) {
    return res.status(400).json({ message: 'serviceDate, plateNumber, and packageNumber are required' });
  }
  const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);
  const paymentId = paymentNumber && isValidObjectId(paymentNumber) ? paymentNumber : null;
  await ServiceRecord.create({
    serviceDate,
    plateNumber,
    package: packageNumber,
    payment: paymentId
  });
  return res.status(201).json({ message: 'Service record created' });
});

router.get('/', requireAuth, async (_req, res) => {
  const rows = await ServiceRecord.find()
    .populate('package')
    .populate('payment')
    .sort({ _id: -1 })
    .lean();

  const plates = rows.map((r) => r.plateNumber);
  const cars = await Car.find({ plateNumber: { $in: plates } }).lean();
  const carMap = new Map(cars.map((c) => [c.plateNumber, c]));

  const mapped = rows.map((r) => ({
    record_number: r._id,
    service_date: r.serviceDate,
    plate_number: r.plateNumber,
    driver_name: carMap.get(r.plateNumber)?.driverName || null,
    phone_number: carMap.get(r.plateNumber)?.phoneNumber || null,
    package_number: r.package?._id || null,
    package_name: r.package?.packageName || null,
    package_description: r.package?.packageDescription || null,
    package_price: r.package?.packagePrice || null,
    payment_number: r.payment?._id || null,
    amount_paid: r.payment?.amountPaid || null,
    payment_date: r.payment?.paymentDate || null
  }));

  return res.json(mapped);
});

router.get('/unpaid', requireAuth, async (_req, res) => {
  const rows = await ServiceRecord.find({ $or: [{ payment: null }, { payment: { $exists: false } }] })
    .populate('package')
    .sort({ _id: -1 })
    .lean();

  const plates = rows.map((r) => r.plateNumber);
  const cars = await Car.find({ plateNumber: { $in: plates } }).lean();
  const carMap = new Map(cars.map((c) => [c.plateNumber, c]));

  const mapped = rows.map((r) => ({
    record_number: r._id,
    service_date: r.serviceDate,
    plate_number: r.plateNumber,
    driver_name: carMap.get(r.plateNumber)?.driverName || null,
    phone_number: carMap.get(r.plateNumber)?.phoneNumber || null,
    package_number: r.package?._id || null,
    package_name: r.package?.packageName || null,
    package_description: r.package?.packageDescription || null,
    package_price: r.package?.packagePrice || null
  }));

  return res.json(mapped);
});

router.put('/:recordNumber', requireAuth, async (req, res) => {
  const { recordNumber } = req.params;
  const { serviceDate, plateNumber, packageNumber, paymentNumber } = req.body;
  await ServiceRecord.findByIdAndUpdate(recordNumber, {
    serviceDate,
    plateNumber,
    package: packageNumber,
    payment: paymentNumber || null
  });
  return res.json({ message: 'Service record updated' });
});

router.delete('/:recordNumber', requireAuth, async (req, res) => {
  const { recordNumber } = req.params;
  await ServiceRecord.findByIdAndDelete(recordNumber);
  return res.json({ message: 'Service record deleted' });
});

module.exports = router;
