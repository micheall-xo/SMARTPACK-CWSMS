import { useEffect, useState } from 'react';
import api from '../api.js';

export default function ServiceRecords() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({ serviceDate: '', plateNumber: '', packageNumber: '' });
  const [editingRecord, setEditingRecord] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [recordsRes, carsRes, packagesRes] = await Promise.all([
      api.get('/service-records'),
      api.get('/cars'),
      api.get('/packages')
    ]);
    setRecords(recordsRes.data);
    setCars(carsRes.data);
    setPackages(packagesRes.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, packageNumber: form.packageNumber };
      if (editingRecord) {
        await api.put(`/service-records/${editingRecord}`, payload);
        setMessage('Service record updated');
      } else {
        await api.post('/service-records', payload);
        setMessage('Service record saved');
      }
      setForm({ serviceDate: '', plateNumber: '', packageNumber: '' });
      setEditingRecord(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (recordNumber) => {
    await api.delete(`/service-records/${recordNumber}`);
    load();
  };

  const startEdit = (record) => {
    setEditingRecord(record.record_number);
    setForm({
      serviceDate: record.service_date ? record.service_date.split('T')[0] : '',
      plateNumber: record.plate_number,
      packageNumber: record.package_number || ''
    });
  };

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">ServicePackage</h1>
          <span className="text-sm text-slate-500">Manage service records</span>
        </div>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <input className="input" type="date" value={form.serviceDate} onChange={e => setForm({ ...form, serviceDate: e.target.value })} />
          <select className="input" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value })}>
            <option value="">Select Car (Plate)</option>
            {cars.map((car) => (
              <option key={car._id} value={car.plateNumber}>
                {car.plateNumber} - {car.driverName}
              </option>
            ))}
          </select>
          <select className="input" value={form.packageNumber} onChange={e => setForm({ ...form, packageNumber: e.target.value })}>
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.packageName} ({pkg.packagePrice})
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary">{editingRecord ? 'Update' : 'Save'}</button>
            {editingRecord && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setEditingRecord(null);
                  setForm({ serviceDate: '', plateNumber: '', packageNumber: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
      </div>

      <div className="card p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-3">Records</h2>
        <table className="min-w-full text-sm table-shell">
          <thead>
            <tr className="text-left">
              <th>Record ID</th>
              <th>Plate</th>
              <th>Driver</th>
              <th>Package</th>
              <th>Amount</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.record_number}>
                <td>{r.record_number}</td>
                <td>{r.plate_number}</td>
                <td>{r.driver_name || '-'}</td>
                <td>{r.package_name}</td>
                <td>{r.amount_paid || '-'}</td>
                <td>{r.payment_date ? String(r.payment_date).slice(0, 10) : '-'}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="text-blue-600" onClick={() => startEdit(r)}>Edit</button>
                    <button className="text-red-600" onClick={() => remove(r.record_number)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
