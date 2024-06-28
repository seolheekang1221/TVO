import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = ({ setUser, setIsLoggedIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const toggleForm = () => {
    setShowRegister(!showRegister)
    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
  }

  const register = async () => {
    try {
      const response = await axios.post('https://tvo-2.onrender.com/api/users/register', { username, password, email })
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('searches');
      setUsername('')
      setPassword('')
      setEmail('')
      setError('')
      setShowRegister(false); 
      console.log(response)
    } catch (err) {
      setError('Registration failed. Please try again.')
    }
  }

  const login = async () => {
    try {
      const response = await axios.post('https://tvo-2.onrender.com/api/users/login', { username, password })
      setUser(response.data.user)
      setIsLoggedIn(true)
      setUsername('')
      setPassword('')
      setError('')
      navigate('/main')
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="landing-page">
      <div className="login-container">
        <h1>{showRegister ? 'Welcome to SkyCheck!' : 'SkyCheck'}</h1>
        <div className="form-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          {showRegister && <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={showRegister ? register : login}>{showRegister ? 'Register' : 'Login'}</button>
          {error && <p className="error-message">{error}</p>}
          <p className="auth-toggle">
            {showRegister ? 'Already have an account?' : "Don't have an account?"} <button onClick={toggleForm}>{showRegister ? 'Login' : 'Sign Up'}</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
