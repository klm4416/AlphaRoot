import React, { Component } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import styles from '../styles/PreferenceSurvey.module.css';

interface PreferenceSurveyProps {
  navigate: NavigateFunction;
}

interface PreferenceSurveyState {
  name: string;
  age: string;
  experience: string;
  goal: string;
  risk: string;
  industries: string[];
  error: string;
  submitted: boolean;
}

const INDUSTRY_OPTIONS = [
  'IT', '바이오', '금융', '소비재', '에너지', '헬스케어', '자동차', '기타'
];

// HOC to inject navigate
function withRouter<T extends {}>(Component: React.ComponentType<T & PreferenceSurveyProps>) {
  return function WrappedComponent(props: T) {
    const navigate = useNavigate();
    return <Component {...(props as T)} navigate={navigate} />;
  };
}

class PreferenceSurveyComponent extends Component<PreferenceSurveyProps, PreferenceSurveyState> {
  constructor(props: PreferenceSurveyProps) {
    super(props);
    this.state = {
      name: '',
      age: '',
      experience: '',
      goal: '',
      risk: '',
      industries: [],
      error: '',
      submitted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleIndustryChange = this.handleIndustryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    this.setState({ [name]: value } as any);
  }

  handleIndustryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    this.setState(prevState => {
      const industries = checked
        ? [...prevState.industries, value]
        : prevState.industries.filter(ind => ind !== value);
      return { industries };
    });
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, age, experience, goal, risk, industries } = this.state;
    if (!name || !age || !experience || !goal || !risk || industries.length === 0) {
      this.setState({ error: '모든 항목을 입력해주세요.' });
      return;
    }
    // 여기서 PreferenceService 등으로 저장 가능
    this.setState({ error: '', submitted: true });
    setTimeout(() => {
      this.props.navigate('/dashboard');
    }, 1000);
  }

  render() {
    const { name, age, experience, goal, risk, industries, error, submitted } = this.state;
    return (
      <div className={styles.surveyContainer}>
        <h1>투자자 성향 분석</h1>
        <form onSubmit={this.handleSubmit} className={styles.surveyForm}>
          <div className={styles.formGroup}>
            <label>이름</label>
            <input type="text" name="name" value={name} onChange={this.handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>나이</label>
            <input type="number" name="age" value={age} onChange={this.handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>투자 경험</label>
            <select name="experience" value={experience} onChange={this.handleChange} required>
              <option value="">선택</option>
              <option value="none">없음</option>
              <option value="beginner">1년 미만</option>
              <option value="intermediate">1~3년</option>
              <option value="advanced">3년 이상</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>투자 목표</label>
            <select name="goal" value={goal} onChange={this.handleChange} required>
              <option value="">선택</option>
              <option value="growth">고수익 성장</option>
              <option value="dividend">안정적 배당</option>
              <option value="preservation">원금 보전</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>리스크 허용도</label>
            <select name="risk" value={risk} onChange={this.handleChange} required>
              <option value="">선택</option>
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>관심 산업 (복수 선택 가능)</label>
            <div className={styles.industries}>
              {INDUSTRY_OPTIONS.map(option => (
                <label key={option} className={styles.industryOption}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={industries.includes(option)}
                    onChange={this.handleIndustryChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitButton}>
            분석 시작
          </button>
          {submitted && <div className={styles.success}>성향 분석 결과가 저장되었습니다! 대시보드로 이동합니다...</div>}
        </form>
      </div>
    );
  }
}

export default withRouter(PreferenceSurveyComponent); 