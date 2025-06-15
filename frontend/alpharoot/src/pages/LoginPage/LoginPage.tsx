import React, { Component } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginFormData } from '../../types';
import styles from './LoginPage.module.css';
import commonStyles from '../../styles/common.module.css';

interface LoginPageProps {
  navigate: (path: string) => void;
}

interface LoginPageState {
  formData: LoginFormData;
  isLoading: boolean;
  error: string;
}

// HOC to inject navigate
function withRouter<T extends {}>(Component: React.ComponentType<T & LoginPageProps>) {
  return function WrappedComponent(props: T) {
    const navigate = useNavigate();
    return <Component {...(props as T)} navigate={navigate} />;
  };
}

class LoginPageComponent extends Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      formData: {
        email: '',
        password: ''
      },
      isLoading: false,
      error: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      },
      error: ''
    }));
  }

  async handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.setState({ isLoading: true, error: '' });
    const { formData } = this.state;
    try {
      // Mock 로그인 검증 (실제로는 API 호출)
      if (formData.email === 'test@example.com' && formData.password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', '김투자');
        setTimeout(() => {
          this.props.navigate('/dashboard');
        }, 500);
      } else {
        this.setState({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
    } catch (error) {
      this.setState({ error: '로그인 중 오류가 발생했습니다.' });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { formData, isLoading, error } = this.state;
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.logo}>AlphaRoot</h1>
            <p className={styles.subtitle}>AI 기반 주식 추천 서비스</p>
          </div>

          <form onSubmit={this.handleSubmit} className={styles.loginForm}>
            <div className={commonStyles.inputGroup}>
              <label htmlFor="email" className={commonStyles.label}>
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={this.handleInputChange}
                className={commonStyles.input}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div className={commonStyles.inputGroup}>
              <label htmlFor="password" className={commonStyles.label}>
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={this.handleInputChange}
                className={commonStyles.input}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`${commonStyles.btn} ${commonStyles.btnPrimary} ${styles.loginButton}`}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.signupLink}>
            <p>
              계정이 없으신가요?{' '}
              <Link to="/register" className={styles.link}>
                회원가입
              </Link>
            </p>
          </div>

          <div className={styles.demoInfo}>
            <p className={styles.demoTitle}>데모 계정</p>
            <p className={styles.demoCredentials}>
              이메일: test@example.com<br />
              비밀번호: password
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPageComponent); 