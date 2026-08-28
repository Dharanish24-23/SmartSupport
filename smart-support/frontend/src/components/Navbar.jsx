import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">SmartSupport</Link>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/eligibility-checker">Check Eligibility</Link>
          <Link to="/schemes">Schemes</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to={dashboardPath} className="btn btn-outline btn-sm">Dashboard</Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
