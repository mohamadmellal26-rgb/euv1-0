import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface UserData {
  id: number;
  full_name?: string;
  email: string;
}

export const Header: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  // فحص حالة تسجيل الدخول عند تحميل المكون
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleMouseEnter = (menuName: string) => {
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleDropdown = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* الشعار (Logo) */}
        <div className="header-logo">
          <Link to="/" className="logo-btn" role="button" tabIndex={0}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3 8H7L12 17H21M17 8H21M21 8V12" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* عناصر القائمة (Navigation Items) */}
        <nav className="header-nav">
          {/* قائمة Templates المنبثقة */}
          <div 
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('templates')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              type="button"
              className={`nav-item dropdown ${activeDropdown === 'templates' ? 'active' : ''}`}
              onClick={() => toggleDropdown('templates')}
            >
              Templates <span className="arrow">▾</span>
            </button>
            {activeDropdown === 'templates' && (
              <div className="dropdown-menu">
                <button type="button" className="dropdown-item">Featured Templates</button>
                <button type="button" className="dropdown-item">Landing Pages</button>
                <button type="button" className="dropdown-item">Dashboards</button>
                <button type="button" className="dropdown-item">E-Commerce</button>
              </div>
            )}
          </div>

          {/* قائمة Resources المنبثقة */}
          <div 
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              type="button"
              className={`nav-item dropdown ${activeDropdown === 'resources' ? 'active' : ''}`}
              onClick={() => toggleDropdown('resources')}
            >
              Resources <span className="arrow">▾</span>
            </button>
            {activeDropdown === 'resources' && (
              <div className="dropdown-menu">
                <button type="button" className="dropdown-item">Documentation</button>
                <button type="button" className="dropdown-item">Blog</button>
                <button type="button" className="dropdown-item">Guides & Tutorials</button>
                <button type="button" className="dropdown-item">Community</button>
              </div>
            )}
          </div>

          <button type="button" className="nav-item">Enterprise</button>
          <button type="button" className="nav-item">Pricing</button>
          <button type="button" className="nav-item">iOS</button>
          <button type="button" className="nav-item">Students</button>
          <button type="button" className="nav-item">FAQ</button>
        </nav>

        {/* أزرار المصادقة - تظهر حسَب حالة تسجيل الدخول */}
        <div className="header-actions">
          {user ? (
            <div className="user-profile-menu">
              <span className="user-name">
                {user.full_name || user.email.split('@')[0]}
              </span>
              <button 
                type="button" 
                className="btn-logout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/auth" className="btn-signup">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;