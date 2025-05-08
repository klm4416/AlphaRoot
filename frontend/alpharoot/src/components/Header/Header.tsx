import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check login status when component mounts and when localStorage changes
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes (when logging in/out in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home page after logout
    
    // Create a custom event to notify other components about the logout
    const logoutEvent = new Event('logout');
    window.dispatchEvent(logoutEvent);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* TODO: Add Logo */}
        <span>AlphaSquare</span>
      </div>
      <nav className={styles.nav}>
        {/* TODO: Add Navigation Links */}
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Community</a></li>
        </ul>
      </nav>
      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <button 
            className={styles.logoutBtn} 
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <>
            <Link to="/login" className={styles.loginBtn}>로그인</Link>
            <button>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
