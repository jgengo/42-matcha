class Checker {
    // All useful functions
    // --------------------------------------------------------------------------------------------------------------------
    static _isRequired (param, name)
    {
        return param === undefined || param === '' ? name + " is not defined" : undefined
    }

    static _isEqual (param1, param2, name)
    {
      return param1 !== param2 ? name + " don't match" : undefined
    }

    static _isSecure (param, name)
    {
        return (param.match(/(?=.*[0-9].*[0-9]).{8,}/) === null) ? name + " is not enough secure at least 2 digits for at least a total of 8 chars" : undefined
    }

    static _isBigEnough (param, name, size)
    {
      return param.length < size && param.length > 0 ? name + " is not enough big" : undefined
    }
    static _isNotBiggerThan (param, name, size)
    {
        return param.length > size ? name + " is too big" : undefined 
    }

    static _checkInclusion (sp, params)
    {
        let keys = []

        // get keys from params
        for (var key in params) {
            keys.push(key);
        }

        // check all fields
        for (var x in keys) {
            if (sp.indexOf(keys[x]) == -1)
                return (-1);
        }
        return (0);
    }


    // Login and register forms
    // --------------------------------------------------------------------------------------------------------------------

    static login (params, callback)
    {
        let strong_parameters = ['email', 'password']

        return new Promise( (resolve, reject) => {
            if (this._checkInclusion(strong_parameters, params) == -1) reject(['Inclusion detected']);
            else {
                let array = [
                    this._isRequired(params.email, 'E-mail'),
                    this._isRequired(params.password, 'Password'),
                    this._isBigEnough(params.password, 'Password', 8)
                ]
                let filtered = array.filter( (d) => d !== undefined );
                filtered.length ? reject(filtered) : resolve()  

            }
        })
    }

    static register (params) {
        let strong_parameters = ['firstName', 'lastName', 'email', 'password', 'passwordCheck']

        return new Promise( (resolve, reject) => {
            if (this._checkInclusion(strong_parameters, params) == -1) reject(['Inclusion detected'])
            else {
                let array = [
                    this._isRequired(params.firstName, 'First name'),
                    this._isRequired(params.lastName, 'Last name'),
                    this._isRequired(params.email, 'E-mail'),
                    this._isRequired(params.password, 'Password'),
                    this._isRequired(params.passwordCheck, 'Password Check'),
                    this._isEqual(params.password, params.passwordCheck, 'Passwords'),
                    this._isBigEnough(params.password, 'Password', 8),
                    this._isBigEnough(params.passwordCheck, 'Password Check', 8),
                    this._isSecure(params.password, 'Password')
                ]
                let filtered = array.filter( (d) => d !== undefined );
                filtered.length ? reject(filtered) : resolve() 
            }
        })
    }

    static register_step_1(params)
    {
      let strong_parameters = ['validate_step', 'gender', 'birthdate','location', 'interested_by'];

      return new Promise ( (resolve, reject) => {
        if (this._checkInclusion(strong_parameters, params) == -1)
          reject(['Inclusion detected']);
        else {
          let array = [
              this._isRequired(params.gender, 'Gender')
          ]
          let filtered = array.filter( (d) => d !== undefined );
          filtered.length ? reject(filtered) : resolve()            
        }
      })
    }
    static register_step_2(params)
    {
      let strong_parameters = ['validate_step', 'tags', 'bio'];

      return new Promise ( (resolve, reject) => {
        if (this._checkInclusion(strong_parameters, params) == -1)
          reject(['Inclusion detected']);
        else {
          let array = [ 
            this._isRequired(params.tags, 'Tags'),
            this._isNotBiggerThan(params.tags.split(','), 'Tags', 5),
            this._isNotBiggerThan(params.bio, 'About you', 1000),
          ]
          let filtered = array.filter( (d) => d !== undefined );
          filtered.length ? reject(filtered) : resolve()
        }
      })
    }

    static edit_profil(params)
    {
        let strong_parameters = ['gender', 'interested_by', 'firstName', 'lastName', 'birthdate', 'location', 'tags', 'bio'];

        return new Promise ( (resolve, reject) => {
            if (this._checkInclusion(strong_parameters, params) == -1)
                reject(['Inclusion detected']);
            else {
                let array = [
                    this._isRequired(params.firstName, 'First name'),
                    this._isRequired(params.lastName, 'Last name'),

                    this._isRequired(params.gender, 'Gender'),

                    this._isRequired(params.tags, 'Tags'),
                    this._isNotBiggerThan(params.tags.split(','), 'Tags', 5),
                    this._isNotBiggerThan(params.bio, 'About you', 1000)                
                ]
                let filtered = array.filter( (d) => d !== undefined );
                filtered.length ? reject(filtered) : resolve()
            }
        })
    }
    
    static mail_issue(params)
    {
        let strong_parameters = ['reason', 'title', 'message'];

        return new Promise ( (resolve, reject) => {
            if (this._checkInclusion(strong_parameters, params) == -1) reject(['Inclusion detected']);
            else {
                let array = [
                    this._isRequired(params.reason, 'Reason'),
                    this._isRequired(params.title, 'Title'),
                    this._isRequired(params.message, 'Message')
                ]
                let filtered = array.filter( (d) => d !== undefined );
                filtered.length ? reject(filtered) : resolve()
            }
        })
    }



    static bio_edit(params)
    {
        let strong_parameters = ['bio'];

        return new Promise ( (resolve, reject) => {
            if (this._checkInclusion(strong_parameters, params) == -1) reject(['Inclusion detected']);
            else {
                resolve();
            }
        })
    }






    static messages_send(params)
    {
        let strong_parameters = ['id', 'content'];

        return new Promise ( (resolve, reject) => {
            if (this._checkInclusion(strong_parameters, params) == -1) reject(['Inclusion detected']);
            else {
                let array = [
                    this._isRequired(params.id, 'sender_id'),
                    this._isRequired(params.content, 'content')
                ]
                let filtered = array.filter( (d) => d !== undefined );
                filtered.length ? reject(filtered) : resolve()
            }
        })
    }

}
module.exports = Checker