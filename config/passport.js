const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) { 
        return done(null, false, { message: 'This email hasn\'t registered yet' })
      }
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return done(null, false, { message: 'Wrong password' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)