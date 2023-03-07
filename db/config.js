const {initializeApp, cert} = require('firebase-admin/app')
const {getFirestore} = require('firebase-admin/firestore')

const serviceAccount = require('../serviceAccount.json')

// Initialize Firebase
initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()
const users = db.collection('userFingerID') // users diubah menjadi userFingerID
const adminLogin = db.collection('adminLogin')
const userLogin = db.collection('userLogin') // Smartphone diubah menjadi userLogin
const esp32 = db.collection('esp32')
const imageLabels = db.collection('imageLabels')
const userRfid = db.collection('userRfid')
const amountUser = db.collection('amountUser')

module.exports = {
    db, 
    users, 
    userLogin, 
    adminLogin, 
    esp32, 
    imageLabels, 
    userRfid, 
    amountUser
}