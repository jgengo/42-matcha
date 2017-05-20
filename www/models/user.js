let connection = require('../config/db')

class User {

	constructor (row) {
		this.row = row
	}
	get email () {
		return this.row.email
	}

	static create (content, callback) {
		connection.query('SELECT email FROM users WHERE email = ?', [content.email], function(err, result) {
			if (err) throw err
			if (result.length > 0)
			{
				callback("taken")
			} else {
				connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);',
					[content.firstName, content.lastName, content.email, content.password],
					function(err, result) {
						if (err) throw err
						callback('success')
				})
			}
		})
	}

	static all (callback) {
		connection.query('SELECT * FROM users', (err, rows) => {
			if (err) throw err
			callback(rows.map((row) => new User(row)))
		})
	}

}

module.exports = User
