import React from 'react';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>알파스퀘어: 투자의 새로운 기준</h1>
        <p>데이터 기반의 혁신적인 투자 플랫폼으로 성공적인 투자를 경험하세요.</p>
        <button className={styles.ctaButton}>지금 시작하기</button>
      </div>
      <div className={styles.imageContainer}>
        {/* TODO: Add Hero Image */}
        {/* Placeholder for image */}
      </div>
    </section>
  );
};

export default Hero;
