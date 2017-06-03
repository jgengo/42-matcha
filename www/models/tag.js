// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

const chalk       	= require('chalk');
const log         	= console.log

class Tag 
{

	// Rails like functions
    //---------------------------------------------------------------------------------------------------------------------

	static create(tag) {
		return new Promise( (resolve, reject) => {
			connection.query('SELECT name FROM tags WHERE name = ?', [tag], (err, rows) => {
				if (err) throw err;
				if (rows.length) { resolve(); return;}
				connection.query('INSERT INTO tags (name) VALUES (?)', [tag], (err,rows) => {
					if (err) throw err;
					log(chalk.bold.yellow('[Tag]') + " " + chalk.magenta(tag) + " added into db.");
					resolve();
				})
			})
		})
	}

}

module.exports = Tag
