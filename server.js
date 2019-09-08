const variables = require('./variables')
const path = require('path')

const registration = require('./local_modules/register')
const loginValidation = require('./local_modules/login')

const sessionManager = require('./local_modules/manageDBSessions')


const uuidv4 = require('uuid/v4')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

const session = require('express-session')
const sessionDBStore = require('./local_modules/sessionStore')

const randomString = require('randomstring')

const port = variables.webServer.MIDDLEWARE_PORT
const sessionConfig = {
    store: new sessionDBStore,
    genid: function (req) {
    
        if (req.sessionID === undefined) {
            return uuidv4()
        } else {
            return req.sessionID
        }
    },
    name: 'baseSID',
    // secret: randomString.generate({
    //     length: 14,
    //     charset: 'alphanumeric'
    // }),
    secret: 'baseSecret',
    resave: variables.session.resave,
    saveUninitialized: variables.session.unintialized,
    cookie: {
        maxAge: variables.cookie.maxAge,
        sameSite: variables.cookie.sameSite,
        secure: variables.cookie.secure // TRUE ONLY ON HTTPS
    },
    maxAge: variables.session.maxAge
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('trust proxy', 1) // DISABLE IN PRODUCTION
app.use(cookieParser())
app.use(session(sessionConfig))

// app.use(express.static(path.join(__dirname, '../client/build')))

// function isAuthenticated(req, res, next) {
//     sessionManager.readSessionID(req, (sessionsStatus) => {
//         if (sessionsStatus.result == false || sessionsStatus.result == undefined) {
//             res.redirect('/')
//         } else {
//             next()
//         }
//     })
// }

// function isNotAuthenticated(req, res, next) {
//     sessionManager.readSessionID(req, (sessionsStatus) => {
//         if (sessionsStatus.result == false || sessionsStatus.result == undefined) {
//             next()
//         } else {
//             res.redirect('/base')
//         }
//     })
// }





// THIS IS A ROUTE FOR TEST PURPOSES -- DELETE BEORE PRODUCTION
// ------------------------------------------------------------
app.get('/tmp', (req, res) => {
    console.table(req.session)
    res.send(`in /tmp ${req.sessionID}`)
})
// ------------------------------------------------------------


app.get('/', (req, res) => {
    res.send('in main /')
})

app.get('/register', (req, res) => {
    res.send('register')
})

app.post('/register', (req, res) => {
    registration.validateRegistration(req, (result) => {
        if (result.result == 'Email already registered') {
            res.redirect('/login')
        } else {
            req.session.userID = result.userID
            req.session.user = result.username
            req.session.role = result.role
            req.session.email = req.body.email
            req.session.path = req.path

            // req.session.save()

            res.redirect('/base')
        }
    })
})

app.get('/login', (req, res) => {
    res.send('login')
})

app.post('/login', (req, res) => {
    loginValidation.checkLogin(req, (result) => {
        if (result.result !== 'loggedin successfuly') {
            // add error message!
            res.redirect('/login')
        } else {
            req.session.userID = result.userID
            req.session.user = result.username
            req.session.role = result.role
            req.session.email = req.body.email
            req.session.path = req.path
            // req.session.save()

            res.send('logged in')
        }
    })
})

app.post('/logout', (req, res) => {
    sessionManager.deleteSessionID({ sessionID: req.sessionID }, (response) => {
    })

    res.clearCookie('SID')
    res.send('logged out')
})


app.get('/base', (req, res) => {
    res.send('in /base')
})



app.listen(port, () => {
    console.log(`server running on port ${port}`)
})