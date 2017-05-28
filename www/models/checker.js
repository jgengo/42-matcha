class Checker {

    static _isRequired(param, name)
    {
        return param === undefined || param === '' ? name + " is not defined" : undefined
    }
    static _isEqual(param1, param2, name)
    {
    	return param1 !== param2 ? name + " don't match" : undefined
    }
    static _isBigEnough(param, name, size)
    {
    	return param.length < size && param.length > 0 ? name + " is not enough big" : undefined
    }
    static _checkInclusion(sp, params)
    {
        console.log("sp: "+sp+"  -  params:"+params)
        for (var x in params) {
            console.log('x: '+x+'   -->   '+sp)
            if (sp.includes(x) === false)
                return -1;
        }
        return 0;
    }
    static register (params, callback)
    {
        let strong_parameters = ['firstName', 'lastName', 'email', 'password', 'passwordCheck']
        // console.log('--->'+Array.from(Object.keys(params))+'\n')
        // console.log(params+'\n')
        // if (this._checkInclusion(strong_parameters, Object.keys(params)) == -1)
        //    callback(['Inclusion detected'])
        // else {
            let array = [
                this._isRequired(params.firstName, 'First name'),
                this._isRequired(params.lastName, 'Last name'),
                this._isRequired(params.email, 'E-mail'),
                this._isRequired(params.password, 'Password'),
                this._isRequired(params.passwordCheck, 'Password Check'),
                this._isEqual(params.password, params.passwordCheck, 'Passwords'),
                this._isBigEnough(params.password, 'Password', 8),
                this._isBigEnough(params.passwordCheck, 'Password Check', 8)
            ]
            let callbacks = array.filter( (d) => d !== undefined );
            callbacks.length ? callback(callbacks) : callback('ok')
        // }
    }
    static login (params, callback)
    {
        let array = [
            this._isRequired(params.email, 'E-mail'),
            this._isRequired(params.password, 'Password'),
            this._isBigEnough(params.password, 'Password', 8)
        ]
        let callbacks = array.filter( (d) => d !== undefined );
        callbacks.length ? callback(callbacks) : callback('ok')
    }
    static register_step_1(params, callback)
    {
        let strong_parameters = ['validate_step', 'gender', 'birthdate','location', 'hide_location', 'interested_by']
        if (this._checkInclusion(strong_parameters, params) == -1)
            callback(['Inclusion detected'])

        let array = [
            this._isRequired(params.gender, 'Gender')
        ]
        let callbacks = array.filter( (d) => d !== undefined );
        callbacks.length ? callback(callback) : callback('ok')
    }

}

module.exports = Checker