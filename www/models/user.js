
// const
//---------------------------------------------------------------------------------------------------------------------
const connection    = require('../config/db')
const bcrypt        = require('bcrypt');
const saltRounds    = 10;

class User {

    // Getter
    //---------------------------------------------------------------------------------------------------------------------
    constructor(row) {
        this.row = row;
    }

    get user () { return this.row }

    // Rails like functions
    //---------------------------------------------------------------------------------------------------------------------

    static create(content) {
        return new Promise( (resolve, reject) => {
            connection.query("SELECT email FROM users WHERE email = ?", [content.email], (err, rows) => {
                if (err) reject(err);
                if (rows.length > 0) reject('taken');
                bcrypt.hash(content.password, saltRounds, (err, hash) => {
                    if (err) reject(err);
                    connection.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?);', [content.firstName, content.lastName, content.email, hash],
                        (err, result) => {
                            if (err) reject(err);
                            resolve();
                    })
                })
            })
        })
    }

    static find(content, callback) {
        connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [content], (err, rows) => {
            if (err) throw err
            if (rows.length)
              callback(new User(rows[0]).user)
            else
              callback('invalid')
        })
    }
    
    static all(callback) {
        connection.query('SELECT * FROM users', (err, rows) => {
            if (err) throw err
            callback(rows.map((row) => new User(row)))
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
                (err) ? reject(err) : fulfill() 
            })
        })
    }

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


}

module.exports = User