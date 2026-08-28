import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/schemes', label: 'Schemes' },
  { to: '/admin/applications', label: 'Applications' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand">SmartSupport Admin</div>
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {link.label}
          </NavLink>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); navigate('/'); }}>Logout</a>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
