const User = require('../models/User')
const BadRequest  = require('../errors/badrequest')
const NotFoundError = require('../errors/notfound')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')

const createUser = async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body

  if (!name || !email || !password || !passwordConfirmation) {
    throw new BadRequest('Provide all fields')
  }
  if (password !== passwordConfirmation) {
    throw new BadRequest('Passwords doesn\'t match')
  }

  const existingEmail = await User.findOne({ email })
  if (existingEmail) {
    throw new BadRequest('Email already registered')
  }

  const newUser = new User({
    name,
    email,
    password,
  })

  await newUser.save()
  return res.status(StatusCodes.CREATED).send({ success: true, data: newUser })
}

const updateUser = async (req, res) => {
  const { id } = req.params
  const { email, name, password } = req.body
  const user = await User.findById(id)

  if (!user) {
    throw new NotFoundError(`No user found with id: ${id}`)
  }
  if (password) {
    user.password = password
  }
  if (name) {
    user.name = name
  }
  if (email) {
    user.email = email
  }
  await user.save()
  return res.status(StatusCodes.OK).send({ success: true, data: user })
}

const deleteUser = async (req, res) => {
  const { id } = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Invalid user ID')
  }
  const user = await User.findByIdAndDelete(id)
  await User.findOneAndDelete(id)
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`)
  }
  return res.status(StatusCodes.OK).send({ success: true, message: `User with id ${id} has been deleted` })
}

const getUsers = async (req, res) => {
  const users = await User.find()
  return res.status(StatusCodes.OK).send({ success: true, data: users })
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
}