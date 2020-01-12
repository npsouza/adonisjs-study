'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  async index ({ request, auth }) {
    const user = await auth.getUser()
    const { page } = request.get()

    if (await user.can('read_private_projects')) {
      const projects = await Project.query()
        .with('user')
        .paginate(page)

      return projects
    }

    const projects = await Project.query()
      .where({ private: true })
      .with('user')
      .paginate(page)

    return projects
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only(['title', 'description', 'private'])

    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const project = await Project.findOrFail(params.id)

    await project.load('user')
    await project.load('tasks')

    if (!project.private) {
      return project
    }

    const user = await auth.getUser()
    if (await user.can('read_private_projects')) {
      return project
    }

    return response.status(400).send({
      error: { message: 'Você não tem permissão de leitura' }
    })
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const project = await Project.findOrFail(params.id)

    const data = request.only(['title', 'description', 'private'])

    project.merge(data)

    await project.save()

    return project
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}

module.exports = ProjectController
