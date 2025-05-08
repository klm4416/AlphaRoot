import React, { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Call the onLogin prop if provided
    if (onLogin) {
      onLogin(email, password);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>로그인</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
};

export default Login; 