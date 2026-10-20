import express from 'express'
import { join } from 'node:path'
import { GroupNotFoundError } from './GroupNotFoundError.js'

/** @typedef {import('./GroupController.js').GroupController} GroupController */

/**
 * The web application. Owns the Express instance and decides which URL gives which response.
 */
export class App {
  #app
  #controller

  /**
   * Creates the application with all routes in place, ready to listen.
   *
   * @param {GroupController} controller - Handles every request about groups.
   */
  constructor(controller) {
    this.#app = express()
    this.#controller = controller
    this.#configureViews()
    this.#configureMiddleware()
    this.#registerRoutes()
    this.#handleErrors()
  }

  /**
   * Sets EJS as the template engine. The path is resolved from this file, not from where Node was
   * started, so the views are found no matter which directory the app is launched from.
   */
  #configureViews() {
    this.#app.set('view engine', 'ejs')
    this.#app.set('views', join(import.meta.dirname, 'views'))
  }

  /**
   * Turns submitted form data into req.body. Extended parsing builds objects from bracketed field
   * names, so exactAmounts[Anna] becomes { exactAmounts: { Anna: ... } }. Must run before the
   * routes, which read from req.body.
   */
  #configureMiddleware() {
    this.#app.use(express.urlencoded({ extended: true }))
  }

  /**
   * Maps each URL the application answers to the response it should give.
   */
  #registerRoutes() {
    this.#app.get('/', (_req, res) => {
      res.render('start')
    })
    this.#app.post('/groups', (req, res) => this.#controller.createGroup(req, res))
    this.#app.get('/groups/:id', (req, res) => this.#controller.showGroup(req, res))
    this.#app.post('/groups/:id/members', (req, res) => this.#controller.createMember(req, res))
    this.#app.get('/groups/:id/expenses/new', (req, res) => this.#controller.showExpenseForm(req, res))
    this.#app.post('/groups/:id/expenses', (req, res) => this.#controller.createExpense(req, res))
    this.#app.post('/groups/:id/expenses/:expenseId/delete', (req, res) => this.#controller.deleteExpense(req, res))
  }

  /**
   * Turns a missing group into a 404 page and any other error into a short 500 message, so that
   * users never see stack traces. Registered last, since Express looks forward for error handlers.
   */
  #handleErrors() {
    this.#app.use((error, _req, res, _next) => {
      if (error instanceof GroupNotFoundError) {
        res.status(404).render('not-found')
      } else {
        res.status(500).send('Något gick fel')
      }
    })
  }

  /**
   * Starts accepting HTTP requests.
   *
   * @param {number|string} port - The port to listen on. Hosting platforms pass it as a string.
   */
  listen(port) {
    this.#app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
      console.log('\nCTRL+C to terminate the server.')
    })
  }
}
