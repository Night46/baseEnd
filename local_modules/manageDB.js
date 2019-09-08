const connectionPool = require('pg').Pool
const variables = require('./../variables')

class manageDB {
    constructor(query, callback) {
        this.pool = new connectionPool({
            user: variables.DBserver.DB_USER,
            password: variables.DBserver.DB_PASS,
            host: variables.DBserver.DB_HOST,
            port: variables.DBserver.DB_PORT,
            database: variables.DBserver.DB_NAME
        })
    }

    _query(query, callback) {
        this.pool.query(query, (err, res) => {
            if (err) {
                callback(err)
            } else {
                callback(res)
            }
        })
    }

    _sessionAccess() {
        
    }

    _closeDBsession() {
        
    }
}

module.exports = {
    manageDB
}