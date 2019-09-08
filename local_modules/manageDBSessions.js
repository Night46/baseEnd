const uuidv4 = require('uuid/v4')
const variables = require('../variables')

const db = require('./manageDB')



function writeSession(details, callback) {
    if (details.path == '/register' || details.path == '/login') {
        if (details.userID != undefined) {
            sessionVars = {
                id: details.sessionID,
                email: details.email,
                role: details.role,
                userID: details.userID,
                time: "'now'",
                expire: "now() + (7 * interval '1 day')"
            }

            const saveSession = `INSERT INTO sessions (id, email, role, userid, expiration, created) VALUES ('${sessionVars.id}', '${sessionVars.email}', '${sessionVars.role}', '${sessionVars.userID}', ${sessionVars.expire}, ${sessionVars.time})`
            const response = new db.manageDB()._query(saveSession, (DBresponse) => {
                if (DBresponse.rowCount === 0) {
                    callback({
                        result: false
                    })
                } else if (DBresponse.rowCount === 1) {
                    callback({
                        result: true
                    })
                }
            })
        }
    } else {
        // return an error, can write first session out of /register url
    }
}

function readSessionID(details, callback) {
    const readSession = `SELECT users.username, users.role, users.id, sessions.expiration FROM users, sessions WHERE sessions.id = '${details.sessionID}'`
    const response = new db.manageDB()._query(readSession, (DBresponse) => {
        if (DBresponse.rowCount === 0) {
            callback({
                result: false
            })
        } else if (DBresponse.rowCount === 1) {
            callback({
                result: true,
                userID: DBresponse.rows[0].id,
                username: DBresponse.rows[0].username,
                role: DBresponse.rows[0].role,
                expire: DBresponse.rows[0].expiration
            })
        }
    })
}

function deleteSessionID(details, callback) {
    const deleteSession = `DELETE FROM sessions WHERE id = '${details.sessionID}'`
    const response = new db.manageDB()._query(deleteSession, (DBresponse) => {
        if (DBresponse.rowCount === 0) {
            callback({
                result: false
            })
        } else if (DBresponse.rowCount === 1) {
            callback({
                result: true
            })
        }
    })
}

function clearExpiredSessions(details, callback) {

}

function checkSID(sid, callback) {
    const checkSession = `SELECT id FROM sessions WHERE id = '${sid}'`
    const response = new db.manageDB()._query(checkSession, (DBresponse) => {
        if (DBresponse.rowCount === 0) {
            callback(false)
        } else if (DBresponse.rowCount === 1) {
            callback(true)
        }
    })
}

module.exports = {
    writeSession,
    readSessionID,
    deleteSessionID,
    checkSID
}