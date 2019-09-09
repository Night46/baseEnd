// web server variables
const webServer = {
    HTTP_PORT: 80,
    HTTPS_PORT: 443,
    MIDDLEWARE_PORT: 4500
}


// postgresql server variables
const DBserver = {
    DB_HOST: '192.168.0.58',
    DB_PORT: '5432',
    DB_USER: 'baseadmin',
    DB_PASS: 'basepass',
    DB_NAME: 'base_db'
}


const bcrypt = {
    rounds: 10
}

const cookie = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: true,
    secure: false
}

const session = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    unintialized: false,
    resave: false
}

module.exports = {webServer, DBserver, bcrypt, cookie, session}
// module.exports.webServer = webServer
// module.exports.DBserver = DBserver
// module.exports.bcrypt = bcrypt