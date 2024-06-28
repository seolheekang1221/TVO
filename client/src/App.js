import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('searches', JSON.stringify(user.searches));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('searches');
    }
  }, [user, isLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/main"
          element={isLoggedIn ? <MainPage user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
