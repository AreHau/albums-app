const { StatusCodes } = require('http-status-codes')
const BadRequest  = require('../errors/badrequest')
const ForbiddenError = require('../errors/forbidden')
const NotFoundError = require('../errors/notfound')
const UnauthorizedError = require('../errors/unauthorized')

/* eslint-disable no-unused-vars */
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)

  if (err instanceof BadRequest) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Bad Request',
    })
  } else if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Unauthorized',
    })
  }
  else if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Forbidden',
    })
  }
  else if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Not Found',
    })
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred',
  })
}
/* eslint-enable no-unused-vars */
  
module.exports = errorHandlerMiddleware