const express = require('express')
const { authUser, authAlbum, authAdmin } = require('../middleware/auth')
const router = express.Router()

const {
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require('../controllers/albums')


router.get('/', authAdmin, getAlbums)
router.post('/', authUser, createAlbum)
router.put('/:id', authUser, authAlbum, updateAlbum)
router.delete('/:id', authUser, authAlbum, deleteAlbum)

/* eslint-disable no-unused-vars */
router.get('/test-error', async (req, res, next) => {
  throw new Error('Testing asynchronous error')
})
/* eslint-enable no-unused-vars */
module.exports = router
