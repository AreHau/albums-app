const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const ForbiddenError = require('../errors/forbidden')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
})

userSchema.pre('save', function (next) {
  if (this.isModified('role') && this.role === 'admin') {
    throw new ForbiddenError('Setting admin role is not allowed')
  }
  next()
})

userSchema.pre('save', async function (next){

  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('User', userSchema)