// const db = require('../db/config')
const {db, esp32} = require('../db/config')

const getHomeAdmin = async (req, res) => {
    if (req.session.loggedin) {
      const userAccess = await db.collection('accessInfo')
      const response = await userAccess.orderBy('date', 'desc').get()
      let responseArr = []
      response.forEach(doc => { 
        responseArr.push(doc.data())
      })
      res.render('userRecord', {
        responseArr: responseArr
      })
    } else {
      res.render('login')
    }
    res.end()
}

const getHomeUser = (req, res) => {
    if (req.session.loggedin) {
      res.render('user', {
        user: req.session.username
      })
    } else {
      res.render('login')
    }
    res.end()
}

const postOpenReader = async (req, res) => {
    console.log(req.session.reader) 
    await esp32.doc(`${req.session.reader}`).set({on: true, open: false, regis: false})
    setTimeout(() => {
      esp32.doc(`${req.session.reader}`).set({on: false, open: false, regis: false})
    }, 2000)
    req.session.loggedin = false
    res.redirect('/home/user')
}


// app.get("/viewimage", (req, res) => {
//   res.render('imagetaken')
// })

module.exports = {
    getHomeAdmin,
    getHomeUser,
    postOpenReader
}