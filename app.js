require('express-async-errors')
require('./config/passport')
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const connectMongoDB = require('./db/mongodb')
const MongoDBStore = require('connect-mongodb-session')(session)
const albumRouter = require('./routes/albums')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const path = require('path')
const errorHandlerMiddleware = require('./middleware/error-handler')

const app = express()
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri: process.env.CONN_STRING,
      collection: 'sessions',
    })
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/albums', albumRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(express.static(path.join(__dirname, 'public')))

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT

const start = async () => {
  try {
    await connectMongoDB(process.env.CONN_STRING)
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
