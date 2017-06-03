// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

//
//---------------------------------------------------------------------------------------------------------------------
const chalk       	= require('chalk');
const log         	= console.log
const info			= chalk.magenta

class TagsUser
{
	static create(user, tag) 
	{
		return new Promise ( (resolve, reject) => {
			connection.query('SELECT id FROM tags WHERE name = ?', [tag], (err, rows) => {
				if (err) throw err;
				connection.query('INSERT INTO tagsusers (user_id, tag_id) VALUES (?, ?)', [user.id, rows[0].id], (err, i_rows) => {
					log(chalk.bold.yellow('[TagsUser]') + " User: " + info(user.id) + " and Tag: " + info(rows[0].id) + " relation added into db.");
				})
			})
			
			resolve();
		})
	}

}

module.exports = TagsUser