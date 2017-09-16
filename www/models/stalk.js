// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

const chalk       	= require('chalk');
const log         	= console.log
const info					= chalk.magenta
const title     	  = chalk.bold.yellow

class Stalk
{


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