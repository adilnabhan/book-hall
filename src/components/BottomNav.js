import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function BottomNav({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Don't show on login page
  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new Event('authChanged'));
    if (onLogout) onLogout();
    navigate('/login');
  };

  const NAV_ITEMS = [
    { path: '/',             icon: '🏠', label: 'Home'     },
    { path: '/book',         icon: '📅', label: 'Book'     },
    { path: '/waiting-list', icon: '⏳', label: 'Waiting'  },
    { path: '/my-bookings',  icon: '✓',  label: 'Bookings' },
  ];

  if (isAdmin) {
    NAV_ITEMS.push({ path: '/admin', icon: '⚙️', label: 'Admin' });
  }

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
      <button className="nav-item nav-logout" onClick={handleLogout}>
        <span className="nav-icon">🚪</span>
        <span>Logout</span>
      </button>
    </nav>
  );
}

export default BottomNav;
