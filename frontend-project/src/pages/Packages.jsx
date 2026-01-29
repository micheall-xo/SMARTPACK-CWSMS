import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Packages() {
  const [form, setForm] = useState({ packageName: '', packageDescription: '', packagePrice: '' });
  const [message, setMessage] = useState('');
  const [packages, setPackages] = useState([]);

  const load = async () => {
    const res = await api.get('/packages');
    setPackages(res.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/packages', {
        ...form,
        packagePrice: parseFloat(form.packagePrice)
      });
      setMessage(`Package saved. ID: ${res.data.id}`);
      setForm({ packageName: '', packageDescription: '', packagePrice: '' });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Packages</h1>
          <span className="text-sm text-slate-500">Define wash tiers</span>
        </div>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <input className="input" placeholder="Package Name" value={form.packageName} onChange={e => setForm({ ...form, packageName: e.target.value })} />
          <input className="input" placeholder="Package Price" value={form.packagePrice} onChange={e => setForm({ ...form, packagePrice: e.target.value })} />
          <input className="input md:col-span-2" placeholder="Package Description" value={form.packageDescription} onChange={e => setForm({ ...form, packageDescription: e.target.value })} />
          <button className="btn-primary">Save</button>
        </form>
        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>

      <div className="card p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-3">Package List (Use ID in Service Records)</h2>
        <table className="min-w-full text-sm table-shell">
          <thead>
            <tr className="text-left">
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td>{p.packageName}</td>
                <td>{p.packageDescription}</td>
                <td>{p.packagePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
