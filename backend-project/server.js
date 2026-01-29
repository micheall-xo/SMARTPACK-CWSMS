const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const { connect } = require('./db');
const Package = require('./models/Package');

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const packageRoutes = require('./routes/packages');
const paymentRoutes = require('./routes/payments');
const serviceRecordRoutes = require('./routes/serviceRecords');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(session({
  name: 'cwsms.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.get('/', (_req, res) => {
  res.json({ status: 'CWSMS backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/reports', reportRoutes);

async function seedPackages() {
  const count = await Package.countDocuments();
  if (count > 0) return;
  await Package.insertMany([
    { packageName: 'Basic wash', packageDescription: 'Exterior hand wash', packagePrice: 5000 },
    { packageName: 'Classic wash', packageDescription: 'Interior hand wash', packagePrice: 10000 },
    { packageName: 'Premium wash', packageDescription: 'Exterior and Interior hand wash', packagePrice: 20000 }
  ]);
}

async function start() {
  await connect();
  await seedPackages();
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
