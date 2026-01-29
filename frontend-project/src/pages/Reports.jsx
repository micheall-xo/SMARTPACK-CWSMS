import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Reports() {
  const [recordNumber, setRecordNumber] = useState('');
  const [bill, setBill] = useState(null);
  const [date, setDate] = useState('');
  const [daily, setDaily] = useState([]);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');

  const loadBill = async () => {
    try {
      const res = await api.get(`/reports/bill/${recordNumber}`);
      setBill(res.data);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Bill not found');
    }
  };

  const loadDaily = async () => {
    try {
      const res = await api.get(`/reports/daily?date=${date}`);
      setDaily(res.data);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Report error');
    }
  };

  const loadRecords = async () => {
    const res = await api.get('/service-records');
    setRecords(res.data);
  };

  useEffect(() => { loadRecords(); }, []);

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Bill of Package</h1>
          <span className="text-sm text-slate-500">Generate customer bill</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <input className="input" placeholder="Record ID" value={recordNumber} onChange={e => setRecordNumber(e.target.value)} />
          <button className="btn-primary" onClick={loadBill}>Generate Bill</button>
        </div>
        {bill && (
          <div className="mt-4 text-sm card p-4">
            <p><strong>Driver:</strong> {bill.driver_name} ({bill.phone_number})</p>
            <p><strong>Plate:</strong> {bill.plate_number}</p>
            <p><strong>Package:</strong> {bill.package_name} - {bill.package_description}</p>
            <p><strong>Price:</strong> {bill.package_price}</p>
            <p><strong>Paid:</strong> {bill.amount_paid || 'Not paid'}</p>
            <p><strong>Payment Date:</strong> {bill.payment_date ? String(bill.payment_date).slice(0, 10) : '-'}</p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Daily Report</h2>
          <span className="text-sm text-slate-500">Payments by date</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button className="btn-primary" onClick={loadDaily}>Generate Report</button>
        </div>
        <table className="min-w-full text-sm mt-4 table-shell">
          <thead>
            <tr className="text-left">
              <th>Plate</th>
              <th>Package</th>
              <th>Description</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((r, i) => (
              <tr key={i}>
                <td>{r.plate_number}</td>
                <td>{r.package_name}</td>
                <td>{r.package_description}</td>
                <td>{r.amount_paid}</td>
                <td>{r.payment_date ? String(r.payment_date).slice(0, 10) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>

      <div className="card p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recorded Data</h2>
          <span className="text-sm text-slate-500">All service records</span>
        </div>
        <table className="min-w-full text-sm table-shell">
          <thead>
            <tr className="text-left">
              <th>Record ID</th>
              <th>Plate</th>
              <th>Driver</th>
              <th>Package</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.record_number}>
                <td>{r.record_number}</td>
                <td>{r.plate_number}</td>
                <td>{r.driver_name || '-'}</td>
                <td>{r.package_name}</td>
                <td>{r.amount_paid || '-'}</td>
                <td>{r.payment_date ? String(r.payment_date).slice(0, 10) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
