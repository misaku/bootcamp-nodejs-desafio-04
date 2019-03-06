'use strict'
const Env = use('Env')
const Youch = use('Youch')
const BaseExceptionHandler = use('BaseExceptionHandler')
/* const sentry = use('Sentry') */
/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }
    if (Env.get('NODE_ENV') === 'development') {
      const youch = new Youch(error, request.request)
      let errorJson
      if ((Env.get('YOUCH_TYPE')).toUpperCase() === 'JSON') {
        errorJson = await youch.toJSON()
      } else {
        errorJson = await youch.toHTML()
      }
      return response.status(error.status).send(errorJson)
    }
    return response.status(error.status)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    /*    if (error.name !== 'ValidationException') {
      sentry.captureException(error)
    } */
  }
}

module.exports = ExceptionHandler
