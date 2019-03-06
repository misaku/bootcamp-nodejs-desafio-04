'use strict'
const Antl = use('Antl')
class Compartilhar {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      eventId: 'required|integer',
      email: 'required|email'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Compartilhar
