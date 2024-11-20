const express = require('express')
const router = express.Router()
const { authAdmin } = require('../middleware/auth')

const {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} = require('../controllers/users')

router.post('/register', createUser)
router.put('/:id', authAdmin, updateUser)
router.delete('/:id', authAdmin, deleteUser )
router.get('/', authAdmin, getUsers )

module.exports = router