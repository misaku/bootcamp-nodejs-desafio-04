'use strict'
const Database = use('Database')
const Event = use('App/Models/Event')
const moment = require('moment')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    let event
    if (request.qs && request.qs.date) {
      event = await Event.query()
        .where(
          (builder) => (
            builder
              .where('start_event', '>=', request.qs.date)
              .orWhere(
                (builder2) => (
                  builder2
                    .where('start_event', '<=', request.qs.date)
                    .andWhere('finish_event', '>=', request.qs.date)
                )
              )
          )
        )
        .andWhere('user_id', auth.user.id).with('user').fetch()
    } else {
      event = await Event.query().where('user_id', auth.user.id).with('user').fetch()
    }
    return event
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only(
      [
        'title',
        'street',
        'number',
        'district',
        'adjunct',
        'city',
        'state',
        'place',
        'postal_code',
        'description',
        'start_event',
        'finish_event'
      ]
    )
    // INICIANDO TRANSACTION PARA GARANTIR QUE SÓ VAI GRAVAR O USUARIO SE NAO TIVER ERRO NOS
    // ENDERECOS
    const event = await Event.query()
      .where(
        (builder) => (
          builder
            .where(
              (builder2) => (
                builder2
                  .where('start_event', '<=', data.start_event)
                  .andWhere('finish_event', '>=', data.finish_event)
              )
            )
            .orWhere(
              (builder2) => (
                builder2
                  .where('start_event', '>=', data.start_event)
                  .andWhere('start_event', '<=', data.finish_event)
              )
            )
            .orWhere(
              (builder2) => (
                builder2
                  .where('finish_event', '>=', data.start_event)
                  .andWhere('finish_event', '<=', data.finish_event)
              )
            )
            .orWhere(
              (builder2) => (
                builder2
                  .where('start_event', '>=', data.start_event)
                  .andWhere('finish_event', '<=', data.finish_event)
              )
            )
        )
      )
      .andWhere('user_id', auth.user.id)
      .fetch()
    if (event.rows.length === 0) {
      const trx = await Database.beginTransaction()
      const dataIn = { ...data, user_id: auth.user.id }
      console.log(dataIn)
      const user = await Event.create(dataIn, trx)
      await trx.commit()
      const { password, ...res } = user.toJSON()
      return res
    }
    return response
      .status(401)
      .send({ error: { message: 'voce ja tem eventos cadastrado para esse periodo' } })
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) {
    const event = await Event.query().where('id', '=', params.id).andWhere('user_id', auth.user.id).with('user').fetch()
    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const data = request.only(
      [
        'title',
        'street',
        'number',
        'district',
        'adjunct',
        'city',
        'state',
        'place',
        'postal_code',
        'description',
        'start_event',
        'finish_event'
      ]
    )
    const event = await Event.findOrFail(params.id)
    if (event.user_id === auth.user.id) {
      if (moment(event.start_event) >= moment()) {
        event.merge(data)
        await event.save()
        return event
      } else {
        return response
          .status(401)
          .send({ error: { message: 'não é possivel atualizar um evento ja finalizado ou' +
                ' iniciado' } })
      }
    } else {
      return response
        .status(401)
        .send({ error: { message: 'Permissão invalida' } })
    }
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)
    if (event.user_id === auth.user.id) {
      if (moment(event.start_event) >= moment()) {
        event.delete()
      } else {
        return response
          .status(401)
          .send({ error: { message: 'não é possivel remover um evento ja finalizado ou iniciado' } })
      }
    } else {
      return response
        .status(401)
        .send({ error: { message: 'Permissão invalida' } })
    }
  }
}

module.exports = EventController
