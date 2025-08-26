import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenTool, User, Settings, LogOut, Menu, X } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <PenTool size={28} />
            <span>BlogPlatform</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/create-blog" className="nav-link">Write</Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">Admin</Link>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                      <span className="user-role">{user.role}</span>
                    </div>
                    <hr />
                    <Link to="/dashboard" className="dropdown-item">
                      <User size={16} />
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="nav-mobile">
            <Link to="/" className="nav-link" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
                <Link to="/create-blog" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Write
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link" onClick={() => setShowMobileMenu(false)}>
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }} 
                  className="nav-link logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Login
                </Link>
                <Link to="/register" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;