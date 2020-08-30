'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPersonalSchema extends Schema {
  up () {
    this.create('user_personals', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_personals')
  }
}

module.exports = UserPersonalSchema
