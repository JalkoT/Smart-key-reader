// const db = require('../db/config')
const { userRfid, esp32, users, db} = require('../db/config')
const faceRecognition = require('../faceRecog/faceRecognition')

const postRfidAuth = async (req, res) => {
    const {rfid, reader} = req.body

    const doc = await userRfid.doc(`${reader}`).get()
    if(doc.exists){
      const userRfid = doc.data().rfid
      let user = userRfid.find(item => item == rfid)
      if(user){
        res.send(true)
      } else {
        res.send(false)
      }
    } else {
      res.send(false)
    }
}

const postRegisFinger = async (req, res) => {
    console.log('Finger Registration', req.body);
    const { userfinger, reader } = req.body
    // const userFinger = req.body.userfinger
    // const readerName = req.body.reader
    // const fingerId = parseInt(req.body.fingerId)
    const fingerId = Number(req.body.fingerId)
  
    if(userfinger != undefined && reader != undefined){
      await esp32.doc(`${reader}`).set({on: false, open: false, regis: true})
      res.end()
      setTimeout(() => {
        esp32.doc(`${reader}`).set({on: false, open: false, regis: false})
      }, 2000)
      await users.doc(`${userfinger}`).set({reader: reader, fingerIdUser: 0})
    } else if (fingerId != undefined){
      const fingerDoc = await users.get()
      fingerDoc.forEach(async doc => {
        if (doc.data().fingerIdUser == 0) {
          await users.doc(`${doc.id}`).set({fingerIdUser: fingerId, reader: doc.data().reader})
        }
      })
      res.end()
    }
}

const postImage = async(req, res) => {
    const faceRecog = await faceRecognition.run(`./${req.file['destination']}/${req.file['filename']}`)
    const fingerId = req.body.fingerId

    if (faceRecog == undefined) {
      console.log('Undetected face!');
      res.send(false)
    } else if (faceRecog == 'unknown'){
      console.log('unknown user!');
      res.send(false)
    } else {
      const usersRef = users.doc(`${faceRecog}`)
      const doc = await usersRef.get()
      const readerName = doc.data().reader

      if (doc.exists) {
        if (doc.data().fingerIdUser == fingerId) {
          await esp32.doc(`${readerName}`).set({on:false, open: true, regis: false});
          res.send(faceRecog)


          setTimeout(() => {
            esp32.doc(`${readerName}`).set({on:false, open: false, regis: false})
          },2000)
          //---------------------crud------------------------------------
          const dateTime = new Date()
          
          const userJson = {
            reader: readerName,
            fingerId: fingerId,
            nama: faceRecog,
            date: dateTime.toUTCString()
          }
          const AccessInfo = await db.collection('accessInfo').add(userJson)
          //---------------------end--------------------------------------
        } else {
          res.send(false)
        }
      } else {
        console.log('Unregistered user')
        res.send(false)
      }
    }
    
 }
//  , (error, req, res, next) => {
//      res.status(400).send({ error: error.message })
//  }



module.exports = {
    postRfidAuth,
    postRegisFinger,
    postImage
}