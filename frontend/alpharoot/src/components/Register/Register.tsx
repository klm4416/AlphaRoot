import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

interface RegisterProps {
  onRegister?: (name: string, email: string, password: string) => void;
}

interface RegisterState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
}

class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);
    
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: null
    };
    
    // Method bindings
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }
  
  handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: e.target.value });
  }
  
  handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: e.target.value });
  }
  
  handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ confirmPassword: e.target.value });
  }

  validateForm(): boolean {
    const { name, email, password, confirmPassword } = this.state;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      this.setState({ error: '모든 필드를 입력해주세요.' });
      return false;
    }
    
    if (password !== confirmPassword) {
      this.setState({ error: '비밀번호가 일치하지 않습니다.' });
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: '유효한 이메일 주소를 입력해주세요.' });
      return false;
    }
    
    // Password strength validation
    if (password.length < 8) {
      this.setState({ error: '비밀번호는 최소 8자 이상이어야 합니다.' });
      return false;
    }
    
    return true;
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Form validation
    if (!this.validateForm()) {
      return;
    }
    
    const { name, email, password } = this.state;
    const { onRegister } = this.props;
    
    // Clear any previous errors
    this.setState({ error: null });
    
    // Call the onRegister prop if provided
    if (onRegister) {
      onRegister(name, email, password);
    }
  }

  render() {
    const { name, email, password, confirmPassword, error } = this.state;
    
    return (
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <h2 className={styles.registerTitle}>회원가입</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={this.handleSubmit} className={styles.registerForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={this.handleNameChange}
                placeholder="이름 입력"
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={this.handleEmailChange}
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
                value={password}
                onChange={this.handlePasswordChange}
                placeholder="비밀번호 입력 (8자 이상)"
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={this.handleConfirmPasswordChange}
                placeholder="비밀번호 재입력"
                className={styles.inputField}
                required
              />
            </div>
            
            <button type="submit" className={styles.registerButton}>
              가입하기
            </button>
            
            <div className={styles.loginLink}>
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register; 