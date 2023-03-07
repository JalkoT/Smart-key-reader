const {adminLogin, userLogin} = require('../db/config')

const getLoginUser = (req, res) => {
    res.render('login')
}
const getLoginAdmin = (req, res) => {
    res.render('loginadmin')
}

const postLoginAdmin = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    
    const adminLoginRef = adminLogin.doc(`${username}`)
    const doc = await adminLoginRef.get()
  
    if (doc.exists) {
      if (doc.data().password == password) {
        req.session.loggedin = true
        req.session.username = username
        res.redirect('/home/admin')
      } else {
        // res.redirect('/home/admin')
        res.redirect('/')
      }
    } else {
        // res.redirect('/home/admin')
        res.redirect('/')
    }  
}
//   , (error, req, res, next) => {
//     res.status(400).send({ error: error.message})
//     }

const postLoginUser = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(req.body)
    const userLoginRef = userLogin.doc(`${username}`)
    const doc = await userLoginRef.get()
  
    if (doc.exists) {
      if (doc.data().password == password) {
        req.session.loggedin = true
        req.session.username = username
        req.session.reader = doc.data().reader
        res.redirect('/home/user')
      } else {
        res.redirect('/home/user')
      }
    } else {
        res.redirect('/home/user')
    }  
  }
//   , (error, req, res, next) => {
//     res.status(400).send({ error: error.message})
//   }

module.exports = {
    getLoginUser,
    getLoginAdmin,
    postLoginAdmin,
    postLoginUser
}