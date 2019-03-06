'use strict'
const Antl = use('Antl')
class AuthRenew {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      refresh_token: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = AuthRenew
