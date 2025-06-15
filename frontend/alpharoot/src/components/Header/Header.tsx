import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  navigate: (path: string) => void;
}

interface HeaderState {
  isLoggedIn: boolean;
}

// HOC to inject navigate
function withRouter<T extends {}>(Component: React.ComponentType<T & HeaderProps>) {
  return function WrappedComponent(props: T) {
    const navigate = useNavigate();
    return <Component {...(props as T)} navigate={navigate} />;
  };
}

class HeaderComponent extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }

  componentDidMount() {
    this.checkLoginStatus();
    window.addEventListener('storage', this.checkLoginStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.checkLoginStatus);
  }

  checkLoginStatus() {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.setState({ isLoggedIn: loggedIn });
  }

  handleLogout() {
    localStorage.removeItem('isLoggedIn');
    this.setState({ isLoggedIn: false });
    this.props.navigate('/');
    const logoutEvent = new Event('logout');
    window.dispatchEvent(logoutEvent);
  }

  render() {
    const { isLoggedIn } = this.state;
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
              onClick={this.handleLogout}
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
  }
}

export default withRouter(HeaderComponent);
