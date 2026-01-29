import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-sm">Loading session...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
