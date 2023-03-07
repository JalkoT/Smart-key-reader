const {
    getHomeAdmin,
    getHomeUser,
    postOpenReader,
} = require('../controllers/home')

const express = require('express')
const router = express.Router()

router.route('/admin').get(getHomeAdmin)
router.route('/user').get(getHomeUser).post(postOpenReader)


module.exports = router