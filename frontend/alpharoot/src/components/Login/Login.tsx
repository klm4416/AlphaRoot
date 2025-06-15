import React, { Component } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
}

interface LoginState {
  email: string;
  password: string;
  error: string | null;
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      error: null
    } as Pick<LoginState, keyof LoginState>);
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: '이메일과 비밀번호를 모두 입력해주세요.' });
      return;
    }
    this.setState({ error: null });
    if (this.props.onLogin) {
      this.props.onLogin(email, password);
    }
  }

  render() {
    const { email, password, error } = this.state;
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>로그인</h2>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <form onSubmit={this.handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                placeholder="이메일 주소 입력"
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="비밀번호 입력"
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.forgotPassword}>
              <a href="#">비밀번호를 잊으셨나요?</a>
            </div>
            <button type="submit" className={styles.loginButton}>
              로그인
            </button>
            <div className={styles.registerLink}>
              계정이 없으신가요? <a href="#">회원가입</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login; 