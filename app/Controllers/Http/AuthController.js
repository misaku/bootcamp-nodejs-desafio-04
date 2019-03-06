'use strict'

class AuthController {
  async store ({ request, response, auth }) {
    const { email, password } = request.all()
    const token = await auth.withRefreshToken().attempt(email, password)
    return token
  }
  async update ({ request, auth }) {
    // not implemented yet, but would be something like ...
    const refreshToken = request.input('refresh_token')
    const token = await auth.generateForRefreshToken(refreshToken)
    return token
  }
  async index ({ response, auth }) {
    try {
      const { password, ...user } = (await auth.getUser()).toJSON()

      return user
    } catch (error) {
      response.status(401).send(error)
    }
  }
  async delete ({ auth, response }) {
    await auth.logout()
    return response.redirect('/')
  }
}

module.exports = AuthController
