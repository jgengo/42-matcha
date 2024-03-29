// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

const moment 				= require('moment');

const chalk       	= require('chalk');
const log         	= console.log
const info					= chalk.magenta
const title     	  = chalk.bold.yellow

class Stalk
{

	static ls(user_id) {
		return new Promise( (resolve, reject) => {
			connection.query(`
			(SELECT 'stalk' as type,users.id, users.first_name, users.last_name, stalks.created_at FROM stalks
			LEFT JOIN users ON stalks.stalker_id = users.id
			WHERE victim_id = ?)
UNION
			(SELECT 'like' as type, users.id, users.first_name, users.last_name, likes.created_at FROM likes
			LEFT JOIN users ON likes.liker_id = users.id
			WHERE liked_id = ?)
			ORDER BY created_at DESC`, [user_id, user_id], (err, rows) => {
				if (err) throw err;
				log(title('[Stalk]') + " user_id: " + info(user_id) + " just get stalk list");
				rows.map( x =>  { x.created_at = moment(x.created_at).fromNow() } );
				resolve(rows);
			});
		})
	}

	static create(stalker_id, victim_id) {
		return new Promise( (resolve, reject) => {
			connection.query('INSERT INTO stalks (`stalker_id`, `victim_id`) VALUES (?, ?);', [stalker_id, victim_id], (err,rows) => {
				if (err) throw "[stalk]"+err;
				log(title('[Stalk]') + " " + info(stalker_id) + " just watched " + info(victim_id));
				resolve();
			})
		})
	}

}

module.exports = Stalk