// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')
const bcrypt        = require('bcrypt');
const moment        = require('moment');
const saltRounds    = 10;

const chalk         = require('chalk');
const log           = console.log
const info          = chalk.magenta


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
                connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);', [content.firstName, content.lastName, content.email, hash],
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