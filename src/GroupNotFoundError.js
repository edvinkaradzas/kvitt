/**
 * Thrown when a group id does not match any stored group. A separate class lets the error handler
 * tell a missing group (404) apart from a bug (500).
 */
export class GroupNotFoundError extends Error {
  /**
   * Creates the error.
   *
   * @param {string} id - The id that was looked up.
   */
  constructor(id) {
    super(`No group with id ${id}`)
  }
}
