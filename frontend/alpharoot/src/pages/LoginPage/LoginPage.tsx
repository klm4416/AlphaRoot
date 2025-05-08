import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login/Login';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with your actual authentication API call
      // For example: const response = await authService.login(email, password);
      console.log('Login attempt with:', email);
      
      // Simulate successful login after a delay
      setTimeout(() => {
        // Store authentication token or user data in localStorage/context
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to main page or dashboard
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.loginPage}>
      <Login onLogin={handleLogin} />
      {isLoading && <div className={styles.loadingOverlay}>로그인 중...</div>}
    </div>
  );
};

export default LoginPage; 