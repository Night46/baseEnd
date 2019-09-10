const variables = require('../variables')
const db = require('./manageDB')
const mailer = require('./sendMail')

const bcryptjs = require('bcryptjs')

function getUserDetails(req, callback) {
    if (req.detailsBy === 'userID') {
        
    } else if (req.detailsBy === 'email') {

    } else {

    }
}

function updateUserDetails(req, callback) {
    if (req.user != null || req.user != undefined) {
        
    } else {

    }
}

function managePass(details, callback) {
    if (details.action === 'reset') {
        mailer.send('resetPass', details.email)
        callback('password reset Email sent')

    } else if (details.action === 'update') {
        let getEmail = `SELECT email FROM users WHERE id = '${details.userID}'`
        let response = new db.manageDB()._query(getEmail, (result) => {
            let email = result.rows[0].email
            if (result.rowCount === 0) {
                callback('No such userID in DB')
            } else if (result.rowCount === 1) {
                bcryptjs.genSalt(variables.bcrypt.rounds, (err, salt) => {
                    bcryptjs.hash(details.password, salt, (err, hash) => {
                        let updatePass = `UPDATE users SET password = '${hash}' WHERE id = '${details.userID}'`
                        let response = new db.manageDB()._query(updatePass, (result) => {
                            if (result.rowCount === 0) {
                                callback('could not update password')
                            } else if (result.rowCount === 1) {
                                mailer.send('updatePass', email)
                            }
                        })
                    })
                })
            }
        })
    } else {
        callback('invalid argument to password manager')
    }
}

module.exports = {
    getUserDetails,
    updateUserDetails,
    managePass
}