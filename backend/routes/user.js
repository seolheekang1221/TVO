const express = require('express')
const User = require('../models/User')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body

  try {
    const newUser = new User({ username, password, email })
    await newUser.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username, password })
    if (user) {
      res.status(200).json({ message: 'Login successful', user })
    } else {
      res.status(400).json({ error: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/search', async (req, res) => {
  const { userId, city, temperature, description, localDateString, localTime } = req.body
  try {
    const user = await User.findById(userId)
    if (user) {
      user.searches.push({ city, temperature, description, localDateString, localTime})
      await user.save()
      res.status(200).json({ message: 'Search saved', searches: user.searches })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
