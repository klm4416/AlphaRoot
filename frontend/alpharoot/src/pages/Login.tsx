import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthService, LoginCredentials } from '../services/AuthService';
import styles from '../styles/Auth.module.css';

interface LoginState {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
}

export class Login extends Component<{}, LoginState> {
  private authService: AuthService;

  constructor(props: {}) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      error: '',
      isLoading: false
    };

    // 서비스 인스턴스 초기화
    this.authService = AuthService.getInstance();

    // 메서드 바인딩
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearError = this.clearError.bind(this);
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
      error: '' // 입력 시 에러 메시지 초기화
    }));
  }

  // 폼 제출 핸들러
  private async handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    
    // 로딩 상태 시작
    this.setState({ isLoading: true, error: '' });

    try {
      // 입력 유효성 검사
      this.validateForm();

      // 로그인 시도
      const credentials: LoginCredentials = {
        email: this.state.email,
        password: this.state.password
      };

      await this.authService.login(credentials);
      
      // 로그인 성공 시 대시보드로 이동
      window.location.href = '/dashboard';
      
    } catch (error) {
      // 에러 처리
      this.setState({
        error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.',
        isLoading: false
      });
    }
  }

  // 폼 유효성 검사
  private validateForm(): void {
    const { email, password } = this.state;

    if (!email.trim()) {
      throw new Error('이메일을 입력해주세요.');
    }

    if (!password.trim()) {
      throw new Error('비밀번호를 입력해주세요.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('올바른 이메일 형식을 입력해주세요.');
    }
  }

  // 에러 메시지 초기화
  private clearError(): void {
    this.setState({ error: '' });
  }

  // 데모 계정 정보 표시 컴포넌트
  private renderDemoInfo(): React.ReactElement {
    return (
      <div className={styles.demoInfo}>
        <h3>데모 계정 정보</h3>
        <p><strong>이메일:</strong> test@example.com</p>
        <p><strong>비밀번호:</strong> password</p>
      </div>
    );
  }

  // 에러 메시지 표시 컴포넌트
  private renderError(): React.ReactElement | null {
    if (!this.state.error) return null;

    return (
      <div className={styles.error} onClick={this.clearError}>
        {this.state.error}
        <span className={styles.closeError}>&times;</span>
      </div>
    );
  }

  // 로딩 상태 표시
  private renderLoadingState(): React.ReactElement | null {
    if (!this.state.isLoading) return null;

    return (
      <div className={styles.loading}>
        로그인 중...
      </div>
    );
  }

  render(): React.ReactElement {
    const { email, password, isLoading } = this.state;

    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>AlphaRoot</h1>
            <h2>로그인</h2>
            <p>AI 기반 주식 추천 서비스에 오신 것을 환영합니다</p>
          </div>

          {this.renderError()}
          {this.renderLoadingState()}

          <form onSubmit={this.handleSubmit} className={styles.authForm}>
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
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>
              계정이 없으신가요? <Link to="/register">회원가입</Link>
            </p>
          </div>

          {this.renderDemoInfo()}
        </div>
      </div>
    );
  }
} 