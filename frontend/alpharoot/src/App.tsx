import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './services/AuthService';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { StockDetail } from './pages/StockDetail';
import PreferenceSurvey from './pages/PreferenceSurvey';
import './App.css';

interface AppState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

class App extends Component<{}, AppState> {
  private authService: AuthService | null = null;

  constructor(props: {}) {
    super(props);
    
    console.log('App constructor 시작');

    this.state = {
      isAuthenticated: false,
      isLoading: true
    };

    // 서비스 인스턴스 초기화
    try {
      this.authService = AuthService.getInstance();
      console.log('AuthService 초기화 완료');
    } catch (error) {
      console.error('AuthService 초기화 실패:', error);
    }
    
    console.log('App constructor 완료');
  }

  // 컴포넌트 마운트 시 인증 상태 확인
  componentDidMount(): void {
    console.log('App componentDidMount 시작');
    this.checkAuthStatus();
  }

  // 인증 상태 확인
  private checkAuthStatus(): void {
    console.log('checkAuthStatus 시작');
    try {
      if (!this.authService) {
        throw new Error('AuthService가 초기화되지 않았습니다.');
      }
      const isAuthenticated = this.authService.isAuthenticated();
      console.log('인증 상태:', isAuthenticated);
      this.setState({
        isAuthenticated,
        isLoading: false
      });
      console.log('상태 업데이트 완료');
    } catch (error) {
      console.error('인증 상태 확인 중 오류:', error);
      this.setState({
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  // 보호된 라우트 컴포넌트
  private ProtectedRoute = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    const { isAuthenticated, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  }

  // 공개 라우트 컴포넌트 (이미 로그인된 사용자는 대시보드로)
  private PublicRoute = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    const { isAuthenticated, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      );
    }

    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  }

  render(): React.ReactElement {
    console.log('App render 시작, state:', this.state);
    
    // 임시로 간단한 렌더링 테스트
    if (this.state.isLoading) {
      console.log('로딩 상태 렌더링');
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      );
    }

    console.log('메인 렌더링 시작');
    return (
      <Router>
        <div className="App">
          <h1>AlphaRoot</h1>
          <Routes>
            {/* 공개 라우트 */}
            <Route
              path="/login"
              element={
                <this.PublicRoute>
                  <Login />
                </this.PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <this.PublicRoute>
                  <Register />
                </this.PublicRoute>
              }
            />

            {/* 보호된 라우트 */}
            <Route
              path="/dashboard"
              element={
                <this.ProtectedRoute>
                  <Dashboard />
                </this.ProtectedRoute>
              }
            />
            <Route
              path="/stock/:id"
              element={
                <this.ProtectedRoute>
                  <StockDetail />
                </this.ProtectedRoute>
              }
            />
            <Route
              path="/preference"
              element={
                <this.ProtectedRoute>
                  <PreferenceSurvey />
                </this.ProtectedRoute>
              }
            />

            {/* 기본 라우트 리다이렉트 */}
            <Route
              path="/"
              element={
                this.state.isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>로딩 중...</p>
                  </div>
                ) : this.state.isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* 404 페이지 */}
            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>404 - 페이지를 찾을 수 없습니다</h1>
                  <p>요청하신 페이지가 존재하지 않습니다.</p>
                  <button onClick={() => window.history.back()}>
                    이전 페이지로 돌아가기
                  </button>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
