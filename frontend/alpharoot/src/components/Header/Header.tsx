import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
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
        {/* TODO: Add Auth Buttons */}
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
