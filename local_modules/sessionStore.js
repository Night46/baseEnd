const db = require('./manageDB')
const session = require('express-session')
const sessionDB = require('./manageDBSessions')
const variables = require('./../variables')

module.exports = class sessionStore extends session.Store {
    get(sid, callback) {
        let details = {
            sessionID: sid
        }
        sessionDB.readSessionID(details, (response) => {
            if (response.result === false) {
                return callback(false)
            } else {
                return callback(null, {
                    cookie: {
                        expires: response.expire,
                        originalMaxAge: variables.cookie.maxAge,
                    },
                    user: response.username,
                    role: response.role,
                    userID: response.userID
                })
            }
        })
    }

    set(sid, session, callback) {
        let details = {
            sessionID: sid,
            role: session.role,
            user: session.user,
            userID: session.userID,
            email: session.email,
            path: session.path
        }

        sessionDB.checkSID(sid, (result) => {
            if (result === true) {
                return callback()
            } else {
                sessionDB.writeSession(details, (response) => {
                    if (response.result === false) {
                        return callback(false)
                    } else {
                        return callback()
                    }
                })
            }
        })
    }

    destroy(sid, callback) {
        let details = {
            sessionID: sid
        }
        sessionDB.deleteSessionID(details.sessionID, (response) => {
            if (response.result === false) {
                return callback(false)
            } else {
                return callback()
            }
        })
    }
}