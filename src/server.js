import { App } from './App.js'
import { GroupController } from './GroupController.js'
import { GroupRepository } from './GroupRepository.js'
import { GroupPresenter } from './GroupPresenter.js'
import { FormValidator } from './FormValidator.js'

const repository = new GroupRepository()
const presenter = new GroupPresenter()
const validator = new FormValidator()
const controller = new GroupController(repository, presenter, validator)
const app = new App(controller)

const PORT = process.env.PORT || 3000

app.listen(PORT)
