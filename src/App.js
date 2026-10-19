import express from 'express'
import { join } from 'node:path'

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
   * Turns submitted form data into req.body. Must run before the routes, which read from it.
   */
  #configureMiddleware() {
    this.#app.use(express.urlencoded({ extended: false }))
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
