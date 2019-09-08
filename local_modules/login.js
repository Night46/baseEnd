const bcryptjs = require('bcryptjs')
const db = require('./manageDB')


function checkLogin(req, callback) {
    let authenticationQuery = `SELECT id, username, email, password, role FROM users WHERE email = '${req.body.email}'`
    let response = new db.manageDB()._query(authenticationQuery, (result) => {
        if (result.rowCount === 0) {
            callback('Incorrect user')
        } else if (result.rowCount === 1) {
            bcryptjs.compare(req.body.password, result.rows[0].password, (err, res) => {
                if (err) {
                    callback({result: err})
                } else if (res === true) {
                    callback({
                        result: 'loggedin successfuly',
                        userID: result.rows[0].id,
                        username: result.rows[0].username,
                        role: result.rows[0].role,
                    })
                } else {
                    callback({result: 'Incorrect password.'})
                }
            })
        } else {
            callback({result:'Unexpected error'})
        }
    })
}

module.exports = {
    checkLogin
}