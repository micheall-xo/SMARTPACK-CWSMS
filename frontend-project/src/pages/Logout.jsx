import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <section className="card p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <p className="text-sm text-slate-600 mb-4">End your session securely.</p>
      <button className="btn-primary" onClick={onLogout}>Logout</button>
    </section>
  );
}
