'use strict'
const Antl = use('Antl')
class UserStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|min:6|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserStore
