import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setMessage('Logged in successfully.');
      navigate('/service-records');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="card p-8 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-amber-400 text-white flex items-center justify-center font-bold">SP</div>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">SmartPark</p>
          <h1 className="text-2xl font-bold">Welcome back</h1>
        </div>
      </div>
      <form className="space-y-4" onSubmit={onLogin}>
        <div>
          <label className="block text-sm font-semibold">Username</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold">Password</label>
          <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" type="submit">Login</button>
          <Link className="btn-outline" to="/register">Create account</Link>
        </div>
      </form>
      {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
    </section>
  );
}
