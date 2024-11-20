const Album = require('../models/Album')
const BadRequest = require('../errors/badrequest')
const UnauthorizedError = require('../errors/unauthorized')
const NotFoundError = require('../errors/notfound')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')

const getAlbums = async (req, res) => {
  const { sort, order, numericFilters, fields, search, startYear, endYear } = req.query
  const queryObject = {}
  const sorting = sort && order ? { [sort]: order === 'asc' ? 1 : -1 } : {}

  if (search) {
    const regex = new RegExp(search, 'i')
    queryObject.$or = [
      { artist: { $regex: regex } },
      { title: { $regex: regex } }
    ]
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(>|>=|=|<|<=)\b/g
    const filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
    const options = ['year', 'tracks']
    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }
  if (startYear || endYear) {
    if (startYear) {
      queryObject.year = { ...queryObject.year, $gte: Number(startYear) }
    }
    if (endYear) {
      queryObject.year = { ...queryObject.year, $lte: Number(endYear) }
    }
  }
  let query = Album.find(queryObject).sort(sorting)
  if (fields) {
    const selectedFields = fields.split(',').join(' ')
    query = query.select(selectedFields)
  }
  const albums = await query
  res.status(StatusCodes.OK).send({ success: true, data: albums })
}

const createAlbum = async (req, res) => {
  const { artist, title, year, genre, tracks } = req.body

  if (!artist || !title || !year || !genre || !tracks) {
    throw new BadRequest('Provide all fields')
  }
  const album = new Album({
    artist,
    title,
    year,
    genre,
    tracks,
    owner: req.user._id
  })
  await album.save()
  return res.status(StatusCodes.CREATED).send({ success: true, data: album })
}

const updateAlbum = async (req, res) => {
  const { id } = req.params
  const { artist, title, year, genre, tracks } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Invalid album ID')
  }

  const album = await Album.findByIdAndUpdate(
    id,
    { artist, title, year, genre, tracks },
    { new: true, runValidators: true }
  )

  if (!album) {
    throw new NotFoundError('Album not found')
  }
  return res.status(StatusCodes.OK).send({ success: true, data: album })
}

const deleteAlbum = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Invalid album ID')
  }
  const album = await Album.findById(id)
  if (!album) {
    throw new NotFoundError('Album not found')
  }
  if (String(album.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new UnauthorizedError('You\'re not allowed to delete this album')
  }
  await album.deleteOne()
  return res.status(StatusCodes.OK).send({ success: true, message: `Album with id ${id} has been deleted` })
}

module.exports = {
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
}
