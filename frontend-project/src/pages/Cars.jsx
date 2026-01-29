import { useState } from 'react';
import api from '../api.js';

export default function Cars() {
  const [form, setForm] = useState({ plateNumber: '', carType: '', carSize: '', driverName: '', phoneNumber: '' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cars', form);
      setMessage('Car saved');
      setForm({ plateNumber: '', carType: '', carSize: '', driverName: '', phoneNumber: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Car Registry</h1>
        <span className="text-sm text-slate-500">Add new vehicle details</span>
      </div>
      <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
        <input className="input" placeholder="Plate Number" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })} />
        <input className="input" placeholder="Car Type" value={form.carType} onChange={e => setForm({ ...form, carType: e.target.value })} />
        <input className="input" placeholder="Car Size" value={form.carSize} onChange={e => setForm({ ...form, carSize: e.target.value })} />
        <input className="input" placeholder="Driver Name" value={form.driverName} onChange={e => setForm({ ...form, driverName: e.target.value })} />
        <input className="input" placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
        <button className="btn-primary">Save</button>
      </form>
      {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
    </section>
  );
}
