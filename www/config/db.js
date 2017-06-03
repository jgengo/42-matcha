let mysql = require('mysql')

let connection_config = {
	host		: 'localhost',
	port    	: '1338',
	user		: 'root',
	password 	: 'root',
	database	: 'matcha_db'
}

let connection = mysql.createConnection(connection_config);

connection.connect(function(err) { 
	if (err) throw err 
})
connection.on('close', function(err) { 
	(err) ? connection = mysql.createConnection(connection_config) : console.log('Connection closed normally.')
});

module.exports = connection