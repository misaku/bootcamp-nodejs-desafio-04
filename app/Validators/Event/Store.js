'use strict'
const Antl = use('Antl')
class EventStore {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      // validation rules
      title: 'required|string',
      street: 'required',
      number: 'required|integer',
      district: 'string',
      city: 'required|string',
      state: 'required|string',
      place: 'required|string',
      postal_code: 'required',
      start_event: 'required|date',
      finish_event: 'required|date'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = EventStore
