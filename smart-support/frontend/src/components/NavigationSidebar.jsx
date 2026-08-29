import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/eligibility-checker', label: 'Check Eligibility', icon: '✓' },
  { to: '/schemes', label: 'Schemes', icon: '▣' },
  { to: '/about', label: 'About', icon: 'ⓘ' },
  { to: '/dashboard', label: 'Dashboard', icon: '▥' },
  { to: '/profile', label: 'Profile', icon: '♙' },
];

export default function NavigationSidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const visibleLinks = LINKS;

  const closeMenu = () => setOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? '×' : '☰'}
      </button>
      <div className={`navigation-sidebar ${open ? 'is-open' : ''}`}>
        <div className="navigation-sidebar-header">
          <span className="navigation-sidebar-kicker">SmartSupport</span>
        </div>
        <nav className="navigation-sidebar-links" aria-label="Primary navigation">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navigation-sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span className="navigation-sidebar-icon" aria-hidden="true">{link.icon}</span>
              <span className="navigation-sidebar-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <button type="button" className="navigation-sidebar-logout" onClick={handleLogout}>
          <span className="navigation-sidebar-icon" aria-hidden="true">↪</span>
          <span className="navigation-sidebar-label">Logout</span>
        </button>
      </div>
      {open && <button type="button" className="navigation-sidebar-backdrop" aria-label="Close navigation menu" onClick={closeMenu} />}
    </>
  );
}
