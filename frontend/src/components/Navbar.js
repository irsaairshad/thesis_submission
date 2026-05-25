import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const panelLink = user?.role === 'admin'    ? '/admin'
                  : user?.role === 'author'   ? '/author'
                  : user?.role === 'reviewer' ? '/reviewer'
                  : null;

  return (
    <nav className="navbar">
      <Link to="/" className="brand">📄 Thesis Submission System</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            {panelLink && <li><Link to={panelLink}>My Panel</Link></li>}
            {user.role === 'author' && (
              <>
                <li><Link to="/submit-thesis">Submit Thesis</Link></li>
                <li><Link to="/check-status">My Status</Link></li>
              </>
            )}
            {user.role === 'admin' && (
              <li><Link to="/check-users">Users</Link></li>
            )}
            <li><span style={{opacity:0.7, fontSize:'0.85rem'}}>Hi, {user.name}</span></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
