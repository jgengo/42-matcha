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
    	return param.length < size ? name + " is not enough big" : undefined
    }

    static register (params, callback)
    {
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
    }
}

module.exports = Checker