'use strict'
const Mail = use('Mail')
class NewTaskMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewTaskMail-job'
  }

  // This is where the work is done.
  async handle ({ username, email, title, start_event,
    finish_event,
    description,
    street,
    number,
    adjunct,
    district,
    city,
    state,
    place,
    postal_code }) {
    await Mail.send(
      ['emails.NewTask'],
      { username,
        title,
        start_event,
        finish_event,
        description,
        street,
        number,
        adjunct,
        hasadjunct: !!adjunct,
        district,
        hasdistrict: !!adjunct,
        city,
        state,
        place,
        postal_code },
      message => {
        message
          .to(email)
          .from('michel.kuguio@gmail.com', 'michel dos santos kuguio')
          .subject('Nova tarefa para você')
      }
    )
  }
}

module.exports = NewTaskMail
