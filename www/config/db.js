let mysql = require('mysql')

let connection = mysql.createConnection({
	host		: 'localhost',
	port    	: '1338',
	user		: 'root',
	password 	: 'root',
	database	: 'matcha_db'
})

connection.connect(function(err) {
  if (err) throw err
})

module.exports = connection