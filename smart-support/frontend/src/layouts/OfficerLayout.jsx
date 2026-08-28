import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">SmartSupport Officer</div>
        <Link to="/officer/applications" className="active">Assigned Applications</Link>
        <a href="#" onClick={(event) => { event.preventDefault(); logout(); navigate('/'); }}>Logout</a>
      </aside>
      <main className="admin-content">
        <p className="text-muted mb-24">Signed in as {user?.email}</p>
        <Outlet />
      </main>
    </div>
  );
}
