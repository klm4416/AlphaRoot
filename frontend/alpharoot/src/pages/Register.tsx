import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthService, RegisterData } from '../services/AuthService';
import styles from '../styles/Auth.module.css';

interface RegisterState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  success: string;
  isLoading: boolean;
}

export class Register extends Component<{}, RegisterState> {
  private authService: AuthService;

  constructor(props: {}) {
    super(props);
    
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      isLoading: false
    };

    // 서비스 인스턴스 초기화
    this.authService = AuthService.getInstance();

    // 메서드 바인딩
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
  }

  // 컴포넌트 마운트 시 이미 로그인된 사용자 체크
  componentDidMount(): void {
    if (this.authService.isAuthenticated()) {
      // 이미 로그인된 경우 대시보드로 리다이렉트
      window.location.href = '/dashboard';
    }
  }

  // 입력 필드 변경 핸들러
  private handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
      error: '', // 입력 시 에러 메시지 초기화
      success: ''
    }));
  }

  // 폼 제출 핸들러
  private async handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    
    // 로딩 상태 시작
    this.setState({ isLoading: true, error: '', success: '' });

    try {
      // 입력 유효성 검사
      this.validateForm();

      // 회원가입 시도
      const userData: RegisterData = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      };

      await this.authService.register(userData);
      
      // 회원가입 성공
      this.setState({
        success: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
        isLoading: false
      });

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
    } catch (error) {
      // 에러 처리
      this.setState({
        error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.',
        isLoading: false
      });
    }
  }

  // 폼 유효성 검사
  private validateForm(): void {
    const { name, email, password, confirmPassword } = this.state;

    if (!name.trim()) {
      throw new Error('이름을 입력해주세요.');
    }

    if (name.trim().length < 2) {
      throw new Error('이름은 2자 이상이어야 합니다.');
    }

    if (!email.trim()) {
      throw new Error('이메일을 입력해주세요.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('올바른 이메일 형식을 입력해주세요.');
    }

    if (!password.trim()) {
      throw new Error('비밀번호를 입력해주세요.');
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }

    if (!confirmPassword.trim()) {
      throw new Error('비밀번호 확인을 입력해주세요.');
    }

    if (password !== confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
  }

  // 메시지 초기화
  private clearMessages(): void {
    this.setState({ error: '', success: '' });
  }

  // 에러 메시지 표시 컴포넌트
  private renderError(): React.ReactElement | null {
    if (!this.state.error) return null;

    return (
      <div className={styles.error} onClick={this.clearMessages}>
        {this.state.error}
        <span className={styles.closeError}>&times;</span>
      </div>
    );
  }

  // 성공 메시지 표시 컴포넌트
  private renderSuccess(): React.ReactElement | null {
    if (!this.state.success) return null;

    return (
      <div className={styles.success}>
        {this.state.success}
      </div>
    );
  }

  // 로딩 상태 표시
  private renderLoadingState(): React.ReactElement | null {
    if (!this.state.isLoading) return null;

    return (
      <div className={styles.loading}>
        회원가입 중...
      </div>
    );
  }

  render(): React.ReactElement {
    const { name, email, password, confirmPassword, isLoading } = this.state;

    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>AlphaRoot</h1>
            <h2>회원가입</h2>
            <p>AI 기반 주식 추천 서비스에 가입하세요</p>
          </div>

          {this.renderError()}
          {this.renderSuccess()}
          {this.renderLoadingState()}

          <form onSubmit={this.handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={this.handleInputChange}
                placeholder="이름을 입력하세요"
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                placeholder="이메일을 입력하세요"
                disabled={isLoading}
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
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleInputChange}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
} 