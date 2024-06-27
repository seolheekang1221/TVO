const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  description: String
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  searches: [weatherSchema]
})

const User = mongoose.model('User', userSchema)

module.exports = User
