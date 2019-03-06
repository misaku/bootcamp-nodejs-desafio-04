'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const User = use('App/Models/User')
const Hash = use('Hash')
class UserController {
  async index () {
    const user = await User.query().setHidden(['password']).with('events').fetch()
    return user
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request }) {
    const data = request.only(
      [
        'username',
        'email',
        'password'
      ]
    )
    // INICIANDO TRANSACTION PARA GARANTIR QUE SÓ VAI GRAVAR O USUARIO SE NAO TIVER ERRO NOS
    // ENDERECOS
    const trx = await Database.beginTransaction()
    const user = await User.create(data, trx)
    await trx.commit()
    const { password, ...res } = user.toJSON()
    return res
  }

  async show ({ params }) {
    const user = await User.query().setHidden(['password']).where('id', '=', params.id).with('events').fetch()
    return user
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update ({ params, request, response }) {
    const { password_old, ...data } = request.only(
      [
        'username',
        'password_old',
        'password'
      ]
    )
    const user = await User.findOrFail(params.id)
    const isSame = await Hash.verify(password_old, user.password)
    if (isSame) {
      user.merge(data)
      await user.save()
      const { password, ...res } = user.toJSON()
      return res
    } else {
      return response
        .status(401)
        .send({ error: { message: 'senha inválida' } })
    }
  }

  async destroy ({ params }) {
    const user = await User.findOrFail(params.id)
    user.delete()
  }
}

module.exports = UserController
