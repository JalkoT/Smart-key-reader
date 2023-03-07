const {
    postRfidAuth,
    postRegisFinger,
    postImage
} = require('../controllers/reader')

const imageUpload = require('../faceRecog/imagePostHandle')
const express = require('express')
const router = express.Router()

router.route('/rfidAuth').post(postRfidAuth)
router.route('/regisFinger').post(postRegisFinger)
router.route('/uploadImage').post(imageUpload.single('avatar') ,postImage)

module.exports = router