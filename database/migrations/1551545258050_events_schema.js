'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.increments()
      table.string('title', 255).notNullable()
      table.string('street', 255).notNullable()
      table.string('number', 255).notNullable()
      table.string('adjunct', 255)
      table.string('district', 255).notNullable()
      table.string('city', 255).notNullable()
      table.string('state', 255).notNullable()
      table.string('place', 255).notNullable()
      table.string('postal_code', 255).notNullable()
      table.text('description')
      table.timestamp('start_event').notNullable()
      table.timestamp('finish_event').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventsSchema
