'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterProjectsSchema extends Schema {
  up () {
    this.table('projects', (table) => {
      table.boolean('private').defaultTo(false)
    })
  }

  down () {
    this.table('projects', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterProjectsSchema
