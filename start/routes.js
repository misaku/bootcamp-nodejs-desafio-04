'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route
    .resource('user', 'UserController')
    .apiOnly()
    .validator(new Map([
      [
        ['user.store'],
        ['User/Store']
      ],
      [
        ['user.update'],
        ['User/Update']
      ]
    ])).middleware(new Map([
      [
        ['user.index', 'user.delete', 'user.show', 'user.update'],
        ['auth']
      ]
    ]))
  Route
    .post('share', 'CompartilharController.store')
    .validator(['Compartilhar']).middleware(['auth'])
  Route
    .resource('event', 'EventController')
    .apiOnly()
    .validator(new Map([
      [
        ['event.store'],
        ['Event/Store']
      ],
      [
        ['event.update'],
        ['Event/Update']
      ]
    ])).middleware(['auth'])
  Route
    .resource('auth', 'AuthController')
    .apiOnly()
    .except(['show'])
    .validator(new Map([
      [
        ['auth.store'],
        ['Auth/Store']
      ],
      [
        ['auth.update'],
        ['Auth/Renew']
      ]
    ]))
    .middleware(new Map([
      [
        ['auth.index', 'auth.delete'],
        ['auth']
      ]
    ]))
})
