import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import StockDashboardPage from './pages/StockDashboardPage';
import LoginPage from './pages/LoginPage/LoginPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check login status on app load
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Listen for storage changes (for multi-tab login/logout)
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };
  
  return (
    <BrowserRouter>
      <div>
        {/* Basic navigation */}
        <nav style={{ padding: '1rem', backgroundColor: '#eee', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Link to="/" style={{ marginRight: '1rem' }}>Main Page</Link>
            <Link to="/dashboard" style={{ marginRight: '1rem' }}>Stock Dashboard</Link>
          </div>
          <div>
            {isLoggedIn ? (
              <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#007bff' }}>
                로그아웃
              </button>
            ) : (
              <Link to="/login">로그인</Link>
            )}
          </div>
        </nav>

        {/* Route configuration */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StockDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
