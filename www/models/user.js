let connection = require('../config/db')

class User {

	constructor (row) {
		this.row = row
	}
	get email() {
		return this.row.email
	}

	static create (content, callback) {
		connection.query('SELECT email FROM users WHERE email = ?', [content.email], (err, result) => {
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
	static find (content, callback) {
		connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [content], (err, rows) => {
			if (err) throw err
			callback(new User(rows[0]))
		})
	}
	static all (callback) {
		connection.query('SELECT * FROM users', (err, rows) => {
			if (err) throw err
			callback(rows.map((row) => new User(row)))
		})
	}
	static is_complete (id, callback) {
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
