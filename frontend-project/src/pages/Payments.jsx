import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Payments() {
  const [form, setForm] = useState({ serviceRecordId: '', amountPaid: '', paymentDate: '' });
  const [message, setMessage] = useState('');
  const [unpaid, setUnpaid] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const res = await api.get('/service-records/unpaid');
    setUnpaid(res.data);
  };

  useEffect(() => { load(); }, []);

  const onSelect = (recordId) => {
    const record = unpaid.find((r) => String(r.record_number) === recordId);
    setSelected(record || null);
    setForm((prev) => ({
      ...prev,
      serviceRecordId: recordId,
      amountPaid: record?.package_price ? String(record.package_price) : prev.amountPaid
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/payments', {
        ...form,
        amountPaid: parseFloat(form.amountPaid)
      });
      setMessage(`Payment saved. ID: ${res.data.id}`);
      setForm({ serviceRecordId: '', amountPaid: '', paymentDate: '' });
      setSelected(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Payment</h1>
        <span className="text-sm text-slate-500">Record customer payments</span>
      </div>
      <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
        <select className="input" value={form.serviceRecordId} onChange={e => onSelect(e.target.value)}>
          <option value="">Select Service Record</option>
          {unpaid.map((r) => (
            <option key={r.record_number} value={r.record_number}>
              {r.plate_number} - {r.package_name}
            </option>
          ))}
        </select>
        <input className="input" placeholder="Amount Paid" value={form.amountPaid} onChange={e => setForm({ ...form, amountPaid: e.target.value })} />
        <input className="input" type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
        <button className="btn-primary">Save</button>
      </form>
      {selected && (
        <div className="mt-4 text-sm text-slate-700">
          <p><strong>Car:</strong> {selected.plate_number} {selected.driver_name ? `(${selected.driver_name})` : ''}</p>
          <p><strong>Service:</strong> {selected.package_name} - {selected.package_description}</p>
          <p><strong>Price:</strong> {selected.package_price}</p>
        </div>
      )}
      {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
    </section>
  );
}
