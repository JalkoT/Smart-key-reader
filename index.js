const session = require('express-session')
const express = require('express')
const app = express()

const faceRecognition = require('./faceRecog/faceRecognition')
const {routerHome, routerLogin, routerReader} = require('./routes')
const {db} = require('./db/config')

app.set('view engine', 'ejs')

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    maxAge:60000
  }
}))
//----middleware
app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/accessInfo', async (req, res) => {
  const accessInfo = await db.collection('accessInfo').orderBy('date', 'desc').limit(10).get()
  const dataRec = []
  accessInfo.forEach(doc => {
    dataRec.push(doc.data())
  })
  res.json({dataRec})
})

app.delete('/accessInfo', async (req, res) => {

})


//-----------login----------
app.use('/login', routerLogin)

//---------home-----------
app.use('/home', routerHome)

//---------reader----------
app.use('/reader', routerReader)


//--------error middleware-----------

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await faceRecognition.loadAll()
    app.listen(port, () => {
      console.log('Server is up on port ' + port)
    })
  } catch (error) {
    console.log(error);
  }
}

start()

