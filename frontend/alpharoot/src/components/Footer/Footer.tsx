import React, { Component } from 'react';
import styles from './Footer.module.css';

class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.links}>
          {/* TODO: Add Footer Links (About, Contact, Terms, etc.) */}
          <a href="#">회사 소개</a>
          <a href="#">이용 약관</a>
          <a href="#">개인정보처리방침</a>
        </div>
        <div className={styles.socialMedia}>
          {/* TODO: Add Social Media Icons/Links */}
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} AlphaSquare. All rights reserved.
        </div>
      </footer>
    );
  }
}

export default Footer;
