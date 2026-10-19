import { App } from './App.js'
import { GroupController } from './GroupController.js'
import { GroupRepository } from './GroupRepository.js'

const repository = new GroupRepository()
const controller = new GroupController(repository)
const app = new App(controller)

const PORT = process.env.PORT || 3000

app.listen(PORT)
