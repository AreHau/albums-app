const UnauthorizedError = require('../errors/unauthorized')
const BadRequest = require('../errors/badrequest')
const ForbiddenError = require('../errors/forbidden')
const Album = require('../models/Album')

const authUser = async (req,res,next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  throw new UnauthorizedError('Unauthorized')
}

const authAdmin = async (req,res,next) => {
  if (req.user.role === 'admin') {
    return next()
  }
  throw new ForbiddenError('User cannot perform this action')
}

const authAlbum = async (req,res,next) => {
  try {
    if (req.user.role === 'admin') {
      return next()
    }
    const albumID = req.params.id
    const album = await Album.findById(albumID)
    if (!album) {
      throw new BadRequest('Album not found')
    }
    if (String(album.owner) === String(req.user._id)) {
      return next()
    }
    throw new ForbiddenError('You are not the owner of this album')
  } catch(err) {
    next(err)
  }
}

module.exports = { authUser , authAdmin, authAlbum}
