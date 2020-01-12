'use strict'

const TaskHook = exports = module.exports = {}

const Mail = use('Mail')
const Helpers = use('Helpers')
const Env = use('Env')

TaskHook.sendNewTaskMail = async (taskInstance) => {
  // quando alterar a task ou criar uma nova task
  if (!taskInstance.user_id && taskInstance.dirty.user_id) return

  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()

  const { title } = taskInstance

  await Mail.send(
    ['emails.new_task'],
    { username, title, hasAttachment: !!file },
    message => {
      message
        .to(email)
        .from(Env.get('MAIL_FROM'))
        .subject('Nova tarefa para você')

      if (file) {
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name
        })
      }
    }
  )
}
