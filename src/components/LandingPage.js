import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = ({ setUser, setIsLoggedIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()

  const toggleForm = () => {
    setShowRegister(!showRegister)
    setUsername('')
    setEmail('')
    setPassword('')
  }

  const register = async () => {
    try {
      const response = await axios.post('/api/users/register', { username, password, email })
      setUsername('')
      setPassword('')
      setEmail('')
      navigate('/main')
    } catch (err) {
      alert(err.response.data.error)
    }
  }

  const login = async () => {
    try {
      const response = await axios.post('/api/users/login', { username, password })
      setUser(response.data.user)
      setIsLoggedIn(true)
      setUsername('')
      setPassword('')
      navigate('/main')
    } catch (err) {
      alert(err.response.data.error)
    }
  }

  return (
    <div className="landing-page">
      <div className="login-container">
        <h1>{showRegister ? 'Welcome the SkyCheck!' : 'SkyCheck'}</h1>
        <div className="form-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          {showRegister && <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={showRegister ? register : login}>{showRegister ? 'Register' : 'Login'}</button>
          <p className="auth-toggle">
            {showRegister ? 'Already have an account?' : "Don't have an account?"} <button onClick={toggleForm}>{showRegister ? 'Login' : 'Sign Up'}</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
