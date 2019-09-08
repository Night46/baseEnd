const uuidv4 = require('uuid/v4')
const bcryptjs = require('bcryptjs')
const variables = require('../variables')

const db = require('./manageDB')


function validateRegistration(req, callback) {
    bcryptjs.genSalt(variables.bcrypt.rounds, (err, salt) => {
        bcryptjs.hash(req.body.password, salt, (err, hash) => {
            const userID = uuidv4()
            const registerNewUser = `INSERT INTO users (id, username, email, password, role, created) VALUES 
                            ('${userID}', '${req.body.username}', '${req.body.email}', '${hash}', '${req.body.role}', 'now') ON CONFLICT(email) DO NOTHING `
            const response = new db.manageDB()._query(registerNewUser, (DBresponse) => {
                if (DBresponse.rowCount === 0) {
                    callback({
                        result: 'Email already registered',
                    })
                } else {
                    callback({
                        result: 'registered successfuly',
                        userID: userID,
                        username: req.body.username,
                        role: req.body.role
                    })
                }
            })
        })
    })
}

module.exports = {
    validateRegistration
}