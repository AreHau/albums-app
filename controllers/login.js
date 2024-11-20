const passport = require('passport')
const { StatusCodes } = require('http-status-codes')
const UnauthorizedError = require('../errors/unauthorized')


const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      throw new UnauthorizedError(info.message)
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      res.status(StatusCodes.OK).send({ msg: 'Logged in successfully'})
    })
  })(req, res, next)
}

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: 'Error logging out' })
    }
    res.status(StatusCodes.OK).send({ msg: 'Logged out successfully' })
  })
}

module.exports = { login, logout }