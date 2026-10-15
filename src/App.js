import express from 'express'

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
    this.#registerRoutes()
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
      console.log(`Server is running on port ${port}...`)
      console.log('CTRL+C to terminate the server.')
    })
  }
}
