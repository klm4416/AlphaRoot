import React from 'react';
import styles from './Features.module.css';

// Sample feature data - replace with actual data or fetch from API
const featuresData = [
  {
    icon: '📊', // Placeholder icon
    title: '실시간 데이터 분석',
    description: '최신 시장 데이터를 기반으로 신속하고 정확한 분석을 제공합니다.',
  },
  {
    icon: '🤖', // Placeholder icon
    title: 'AI 기반 추천',
    description: '개인 투자 성향에 맞춘 AI 추천 포트폴리오를 받아보세요.',
  },
  {
    icon: '📈', // Placeholder icon
    title: '다양한 투자 지표',
    description: '투자 결정에 도움이 되는 다양한 기술적, 기본적 지표를 확인하세요.',
  },
];

const Features: React.FC = () => {
  return (
    <section className={styles.features}>
      <h2>주요 기능</h2>
      <div className={styles.featuresGrid}>
        {featuresData.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
