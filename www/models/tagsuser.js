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

    static destroy_all(user_id) {
    	return new Promise( (resolve, reject) => {
	        connection.query("DELETE FROM tagsusers WHERE user_id = ?", [user_id], (err, result) => {
	          if (err) throw err;
	          log(chalk.bold.yellow('[TagsUser] ') + 'User: ' + info(user_id) + ' Tags relation removed from db.')
	          resolve()
	        })
    	})
    }
}

module.exports = TagsUser