import express from 'express'
import { join } from 'node:path'

/**
 * The web application. Owns the Express instance and decides which URL gives which response.
 */
export class App {
  #app

  /**
   * Creates the application with all routes in place, ready to listen.
   */
  constructor() {
    this.#app = express()
    this.#configureViews()
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
   * Maps each URL the application answers to the response it should give.
   */
  #registerRoutes() {
    this.#app.get('/', (_req, res) => {
      res.send('Hello World!')
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
