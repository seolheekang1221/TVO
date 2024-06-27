import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import MainPage from './components/MainPage'

const App = () => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
  )
}

export default App
