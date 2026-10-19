import { App } from './App.js'
import { GroupController } from './GroupController.js'
import { GroupRepository } from './GroupRepository.js'
import { GroupPresenter } from './GroupPresenter.js'

const repository = new GroupRepository()
const presenter = new GroupPresenter()
const controller = new GroupController(repository, presenter)
const app = new App(controller)

const PORT = process.env.PORT || 3000

app.listen(PORT)
