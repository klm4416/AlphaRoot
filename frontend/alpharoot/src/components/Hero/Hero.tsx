import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';

interface HeroProps {
  navigate: (path: string) => void;
}

// HOC to inject navigate
function withRouter<T extends {}>(Component: React.ComponentType<T & HeroProps>) {
  return function WrappedComponent(props: T) {
    const navigate = useNavigate();
    return <Component {...(props as T)} navigate={navigate} />;
  };
}

class HeroComponent extends Component<HeroProps> {
  constructor(props: HeroProps) {
    super(props);
    this.handleGetStarted = this.handleGetStarted.bind(this);
  }

  handleGetStarted() {
    this.props.navigate('/dashboard');
  }

  render() {
    return (
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1>알파스퀘어: 투자의 새로운 기준</h1>
          <p>데이터 기반의 혁신적인 투자 플랫폼으로 성공적인 투자를 경험하세요.</p>
          <button 
            className={styles.ctaButton}
            onClick={this.handleGetStarted}
          >
            지금 시작하기
          </button>
        </div>
        <div className={styles.imageContainer}>
          {/* TODO: Add Hero Image */}
          {/* Placeholder for image */}
        </div>
      </section>
    );
  }
}

export default withRouter(HeroComponent);
