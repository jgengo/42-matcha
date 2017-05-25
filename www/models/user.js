let connection = require('../config/db')

class User {

    constructor(row) {
        this.row = row
    }
    get id() {
    	return this.row.id
    }
    get first_name() {
    	return this.row.first_name
    }
    get last_name() {
    	return this.row.last_name
    }
    get validate_step() {
    	return this.row.validate_step
    }
    get email() {
        return this.row.email
    }

    static create(content, callback) {
        connection.query('SELECT email FROM users WHERE email = ?', [content.email], (err, result) => {
            if (err) throw err
            if (result.length > 0) {
                callback("taken")
            } else {
                let bcrypt = require('bcrypt');
                const saltRounds = 10;
                bcrypt.hash(content.password, saltRounds, function(err, hash) {
                    if (err) throw err
                    connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);', [content.firstName, content.lastName, content.email, hash],
                        function(err, result) {
                            if (err) throw err
                            callback('success')
                        })
                })
            }
        })
    }
    static find(content, callback) {
        connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [content], (err, rows) => {
            if (err) throw err
            if (rows.length)
            	callback(new User(rows[0]))
            else
            	callback('invalid')
        })
    }
    static all(callback) {
        connection.query('SELECT * FROM users', (err, rows) => {
            if (err) throw err
            callback(rows.map((row) => new User(row)))
        })
    }

    static sign_in(content, callback) {
    	connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [content.email], (err, rows) => {
    		if (err) throw err
    		if (rows.length) {
    			let bcrypt = require('bcrypt');
    			bcrypt.compare(content.password, rows[0].password, (err, res) => {
    				if (err) throw err
    				callback(res ? new User(rows[0]) : ["Invalid password"]);
    			})
    		} else
    			callback(["Unknown e-mail"])
    	})
    }

    static is_complete(id, callback) {
        connection.query('SELECT validate_step FROM users WHERE id = ?', [id], (err, rows) => {
            if (err) throw err
            if (rows[0].validate_step === 0)
                callback(true)
            else
                callback(false)
        })
    }
}

module.exports = User