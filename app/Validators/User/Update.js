'use strict'
const Antl = use('Antl')
class UserUpdate {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      // validation rules
      password_old: 'required|min:6',
      password: 'min:6|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserUpdate
