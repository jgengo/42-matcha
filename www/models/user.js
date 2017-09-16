// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')

const bcrypt        = require('bcrypt');
const saltRounds    = 10;

const moment        = require('moment');
const iplocation    = require('iplocation');


const chalk         = require('chalk');
const log           = console.log
const info          = chalk.magenta



const Mail        = require('../models/mail');

class User {

    // Getter
    //---------------------------------------------------------------------------------------------------------------------

    constructor(row) {
        this.row = row;
    }

    get user () { return this.row }

    // Methods
    //---------------------------------------------------------------------------------------------------------------------


    static sign_in (content) {
      return new Promise ( (resolve, reject) => {
        connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [content.email], (err, rows) => {
          if (err) throw err;
          if (rows.length) {
            bcrypt.compare(content.password, rows[0].password, (err, res) => {
              if (err) throw err;
              res ? resolve(new User(rows[0]).user) : reject(['Invalid credentials'])
            })
          } else { reject(['Invalid credentials']); }
        })
      })
    }
    
    static is_complete(id) {
      return new Promise ( (resolve, reject) => {
        connection.query('SELECT validate_step FROM users WHERE id = ?', [id], (err, rows) => {
          if (err) throw err;
          (rows[0].validate_step === 0) ? resolve() : reject()
        })
      })
    }

    static force_geoloc(req) {
      return new Promise ( (resolve, reject) => {
          iplocation(req.ip)
          .then( res => {
            if (!res.city)
            {
              log(chalk.bold.yellow('[Geoloc] ') + "user_id: "+req.session.user.id+" IP can't be found. Forced !"); 
              connection.query('UPDATE users SET geoloc_city = "Paris", geoloc_lat = 48.8965, geoloc_lon = 2.3182 WHERE id = ?', [req.session.user.id])
              reject();
            } else {
              log(chalk.bold.yellow('[Geoloc] ') + "user_id: "+req.session.user.id+" found ("+res.city+")");
              connection.query('UPDATE users SET geoloc_city = ?, geoloc_lat = ?, geoloc_lon = ? WHERE id = ?', [res.city, res.latitude, res.longitude, req.session.user.id]);
              resolve(); 
            }
          })
      })
    }

    static set_online(user_id, status) {
      return new Promise ( (resolve, reject) => {
        connection.query('UPDATE users SET online = ?, last_seen = ? WHERE id = ?', [status, moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), user_id]);
        resolve();
      });
    }

    static ping(user_id) {
      return new Promise( (resolve, reject) => {
        connection.query('SELECT online, last_seen FROM users WHERE id = ?', [user_id], (err, rows) => {
          if (err) throw err;
          rows[0].last_seen = (rows[0].last_seen) ? moment(rows[0].last_seen).fromNow() : 'N/A';
          resolve(rows[0]);
        })
      })
    }

    static reset_password(params) {
      return new Promise( (resolve, reject) => {
        var token = Math.random().toString(36).substring(2);
        connection.query('SELECT email FROM users WHERE email = ?', [params.email], (err, rows) => {
          if (rows.length) {
            connection.query('UPDATE users SET reset_token = ? WHERE email = ?', [token, params.email], (err, rows) => {
              if (err) throw err;
              Mail.reset_password(token, params.email);
              resolve(token);
            })
          } else {
            reject(['Email not found'])
          }
        })
      })
    }



    // Relations Getter Methods
    //---------------------------------------------------------------------------------------------------------------------
    static getTags(id) {
      return new Promise( (resolve, reject) => {
        connection.query('SELECT tags.name as tags FROM users JOIN tagsusers ON tagsusers.user_id = users.id JOIN tags ON tags.id = tagsusers.tag_id WHERE users.id = ?;', [id], (err, rows) => {
          if (err) throw err;
          resolve(rows.map( (row) => row.tags ));
        })
      })
    }

    // Rails like functions
    //---------------------------------------------------------------------------------------------------------------------

    static create(content) {
        return new Promise( (resolve, reject) => {
            bcrypt.hash(content.password, saltRounds, (err, hash) => {
                if (err) reject(err);
                connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);', [content.firstName, content.lastName.toUpperCase(), content.email, hash],
                    (err, result) => {
                        if (err) { reject(err.code); log(chalk.bold.yellow('[User] ') + info('error') + " SQL catched while "+info('user creation')+" ["+err.code+"]"); return; }
                        log(chalk.bold.yellow('[User] ') + "added into db.");
                        resolve();
                })
            })
        })
    }
    
    static find(id)
    {
      return new Promise( (resolve, reject) => {
        connection.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
          if (err) throw err;
          resolve(new User(rows[0]).user);
        })
      })
    }


    static destroy(user) {
      return new Promise ( (resolve, reject) => {
        connection.query("DELETE FROM users WHERE id = ?", [user.id], (err, result) => {
          if (err) throw err;
          log(chalk.bold.yellow('[User] ') + 'id: ' + info(user.id) + ' removed from db and all their relations.')
          resolve()
        })
      })
    }

    static all() {
      return new Promise( () => { 
        connection.query('SELECT * FROM users', (err, rows) => {
          if (err) throw err;
          resolve(rows.map( (row) => new User(row)));
        })
      })
    }
    
    static update(req) {
        return new Promise( (fulfill, reject) => {
            let params = req.body
            let sql = "UPDATE users SET"
            for (let p in params)
              sql += " " + p + " = " + connection.escape(params[p]) + ","
            sql = sql.slice(0, -1);
            sql+=" WHERE id = " + connection.escape(req.session.user.id)
            connection.query( sql, (err, res) => {
                if (err) throw err;
                log(chalk.bold.yellow('[User] ') + "updated into db."); 
                fulfill(); 
            })
        })
    }

}

module.exports = User