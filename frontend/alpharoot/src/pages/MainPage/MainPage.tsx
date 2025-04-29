import React from 'react';
import styles from './MainPage.module.css';
import Header from '../../components/Header/Header'; // Adjust the path as necessary
import Hero from '../../components/Hero/Hero'; // Import Hero component
import Features from '../../components/Features/Features'; // Import Features component
import Footer from '../../components/Footer/Footer'; // Import Footer component

const MainPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Hero /> {/* Render Hero component */}
      <Features /> {/* Render Features component */}
      <Footer /> {/* Render Footer component */}
      {/* TODO: Remove placeholder h1, add Footer component */}
      {/* <h1>AlphaSquare Clone - Main Page</h1> */}
    </div>
  );
};

export default MainPage;
