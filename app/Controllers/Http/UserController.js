'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const addresses = request.input('addresses')

    const transaction = await Database.beginTransaction()

    const user = await User.create(data, transaction)

    if (roles) {
      await user.roles().attach(roles, transaction)
    }

    if (permissions) {
      await user.permissions().attach(permissions, transaction)
    }

    await user.loadMany(['roles', 'permissions'])

    await user.addresses().createMany(addresses, transaction)

    await transaction.commit()

    return user
  }

  async update ({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const user = await User.findOrFail(params.id)

    user.merge(data)
    await user.save()

    if (roles) {
      await user.roles().sync(roles)
    }

    if (permissions) {
      await user.permissions().sync(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    return user
  }
}

module.exports = UserController
