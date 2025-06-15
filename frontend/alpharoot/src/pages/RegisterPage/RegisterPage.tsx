import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterFormData } from '../../types';
import styles from './RegisterPage.module.css';
import commonStyles from '../../styles/common.module.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 해당 필드의 에러 메시지 클리어
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock 회원가입 처리 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 시 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
      
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <h1 className={styles.logo}>AlphaRoot</h1>
          <p className={styles.subtitle}>AI 기반 주식 추천 서비스 회원가입</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={commonStyles.inputGroup}>
            <label htmlFor="name" className={commonStyles.label}>
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={commonStyles.input}
              placeholder="이름을 입력하세요"
              required
            />
            {errors.name && (
              <div className={styles.errorText}>{errors.name}</div>
            )}
          </div>

          <div className={commonStyles.inputGroup}>
            <label htmlFor="email" className={commonStyles.label}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={commonStyles.input}
              placeholder="이메일을 입력하세요"
              required
            />
            {errors.email && (
              <div className={styles.errorText}>{errors.email}</div>
            )}
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
              onChange={handleInputChange}
              className={commonStyles.input}
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              required
            />
            {errors.password && (
              <div className={styles.errorText}>{errors.password}</div>
            )}
          </div>

          <div className={commonStyles.inputGroup}>
            <label htmlFor="confirmPassword" className={commonStyles.label}>
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={commonStyles.input}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {errors.confirmPassword && (
              <div className={styles.errorText}>{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${commonStyles.btn} ${commonStyles.btnPrimary} ${styles.registerButton}`}
          >
            {isLoading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className={styles.loginLink}>
          <p>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className={styles.link}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 