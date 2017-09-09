// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

const chalk         = require('chalk');
const log           = console.log
const info          = chalk.magenta

class Message {

    static unread_messages(user_id)
    {
    	return new Promise ( (resolve, reject) => {
    		connection.query(`
          SELECT * 
          FROM messages 
          WHERE (recipient_id = ? and unread = 1)`, [user_id], (err, rows) => {
    			if (err) throw err;
    			resolve(rows);
    		})
    	})
    }

    static messages_from(sender_id, recipient_id)
   	{
   		return new Promise ( (resolve, reject) => {
   			connection.query(`
          SELECT * 
          FROM messages 
          WHERE (recipient_id = ? and sender_id = ?)`, [recipient_id, sender_id], (err, rows) => {
   				if (err) throw err;
  				resolve(rows);
   			})
   		})
   	}

    static messages_from_to(user_one, user_two)
    {
      return new Promise ( (resolve, reject) => {
        connection.query(`
          SELECT messages.*,users.id,users.first_name
          FROM messages
          LEFT JOIN users ON messages.sender_id = users.id
          WHERE (recipient_id = ? and sender_id = ?) or (sender_id = ? and recipient_id = ?)
          ORDER BY messages.id`, [user_one, user_two, user_one, user_two], (err, rows) => {
            if (err) throw err;
            resolve(rows);
          })
      })
    }

    static messages_to(recipient_id)
    {
      return new Promise( (resolve, reject) => {
        connection.query(`
          SELECT messages.sender_id, messages.recipient_id,users.id,users.last_name,users.first_name 
          FROM messages 
          LEFT JOIN users ON messages.sender_id = users.id 
          WHERE messages.recipient_id = ? 
          GROUP BY messages.sender_id;`, [recipient_id], (err, rows) => {
          if (err) throw err;
          resolve(rows);
        })
      })
    }









    static create(data)
    {
      return new Promise( (resolve, reject) => {
        connection.query('INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?);', 
        [data.sender_id, data.recipient_id, data.content],
        (err, result) => {
          if (err) { reject(err.code); log(chalk.bold.yellow('[Message] ') + info('error') + " SQL catched while "+info('message creation')+" ["+err.code+"]"); return; }
          console.log(result);
          log(chalk.bold.yellow('[Message] ') + "added into db.");
          connection.query(`
            SELECT messages.*, users.id,users.first_name
            FROM messages
            LEFT JOIN users ON messages.sender_id = users.id
            WHERE messages.id = ?`, [result.insertId], (err, rows) => { if (err) throw err; resolve(rows); }
        )
        })
      })
    }







}
module.exports = Message