const {
  getLoginUser,
  getLoginAdmin,
  postLoginAdmin,
  postLoginUser
} = require('../controllers/login')

const express = require('express')
const router = express.Router()

router.route('/admin').get(getLoginAdmin).post(postLoginAdmin)
router.route('/user').get(getLoginUser).post(postLoginUser)





module.exports = router