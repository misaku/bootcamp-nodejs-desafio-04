'use strict'
const Antl = use('Antl')
class AuthStore {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      // validation rules
      email: 'required|email',
      password: 'required|min:6'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = AuthStore
