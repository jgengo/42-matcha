// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

const chalk         = require('chalk');
const log           = console.log
const info          = chalk.magenta
const title         = chalk.bold.yellow

class Like
{

  // static ls(user_id) {
  //   return new Promise( (resolve, reject) => {
  //     connection.query(`
  //     SELECT stalks.created_at,users.id, users.last_name,users.first_name 
  //     FROM stalks
  //     LEFT JOIN users ON stalks.stalker_id = users.id
  //     WHERE stalks.victim_id = ?
  //     ORDER BY created_at DESC`, [user_id], (err, rows) => {
  //       if (err) throw err;
  //       log(title('[Stalk]') + " user_id: " + info(user_id) + " just get stalk list");
  //       rows.map( x =>  { x.created_at = moment(x.created_at).fromNow() } );
  //       resolve(rows);
  //     });
  //   })
  // }


  static count(user_id) {
    return new Promise ( (resolve, reject) => {
      connection.query('SELECT COUNT(id) as result FROM likes WHERE liked_id = ?;', [user_id], (err, rows) => {
        resolve(rows[0].result)
      })
    })
  }

  static both_liked(user1_id, user2_id) {
    return new Promise ( (resolve, reject) => {
      connection.query(
        `
        SELECT IF(COUNT(id) = 2, 1, 0) as result FROM likes
        WHERE (liker_id = ? and liked_id = ?) or (liked_id = ? and liker_id = ?)
        `, [user1_id, user2_id, user1_id, user2_id], (err, rows) => 
        {
          if (err) throw err;
          resolve(rows[0].result)
        })
    });
  }


  static create(liker_id, liked_id) {
    return new Promise( (resolve, reject) => {
      connection.query('INSERT INTO likes (liker_id, liked_id) VALUES (?, ?);', [liker_id, liked_id], (err,rows) => {
        if (err) throw "[like]"+err;
        log(title('[Like]') + " " + info(liker_id) + " just liked " + info(liked_id));
        resolve();
      })
    })
  }

  static destroy(liker_id, liked_id) {
    return new Promise( (resolve, reject) => {
      connection.query('DELETE FROM likes WHERE (liker_id = ? and liked_id = ?)', [liker_id, liked_id], (err, rows) => {
        if (err) throw "[unlike]"+err;
        log(title('[Like]') + " " + info(liker_id) + " just unliked " + info(liked_id) );
        resolve();
      })
    })
  }


}

module.exports = Like