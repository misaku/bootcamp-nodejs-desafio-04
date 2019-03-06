'use strict'
const Kue = use('Kue')
const job = use('App/Jobs/NewTaskMail')
const Event = use('App/Models/Event')
const moment = require('moment')
class CompartilharController {
  async store ({ request, response, auth }) {
    const { email, eventId } = request.only(
      [
        'email',
        'eventId'
      ]
    )
    const event = await Event.findOrFail(eventId)
    if (event.user_id === auth.user.id) {
      if (moment(event.start_event) >= moment()) {
        const dataMail=  {
          username: auth.user.username,
          email,
          ...(event.toJSON())
        }
        Kue.dispatch(
          job.key,
          dataMail,
          { attempts: 3 })
      } else {
        return response
          .status(401)
          .send({ error: { message: 'não é possivel compartilhar um evento ja finalizado ou' +
                ' iniciado' } })
      }
    } else {
      return response
        .status(401)
        .send({ error: { message: 'Permissão invalida' } })
    }

  }
}

module.exports = CompartilharController
