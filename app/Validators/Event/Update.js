'use strict'
const Antl = use('Antl')
class EventUpdate {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      // validation rules
      title: 'string',
      number: 'integer',
      district: 'string',
      city: 'string',
      state: 'string',
      place: 'string',
      start_event: 'date',
      finish_event: 'date'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = EventUpdate
