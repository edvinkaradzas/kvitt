/** @typedef {import('split-ledger').ExpenseGroup} ExpenseGroup */

/**
 * Keeps every group in memory and hands out ids. The only class that knows where groups are stored.
 */
export class GroupRepository {
  #groups = new Map()
  #nextId = 1

  /**
   * Stores a group under a new id.
   *
   * @param {ExpenseGroup} group - The group to store.
   * @returns {string} The id, as a string, since ids come back from URLs as strings.
   */
  add(group) {
    const id = String(this.#nextId++)
    this.#groups.set(id, group)

    return id
  }

  /**
   * Looks up a group by its id.
   *
   * @param {string} id - The id that add() returned.
   * @returns {ExpenseGroup|undefined} The group, or undefined if no group has that id.
   */
  findById(id) {
    return this.#groups.get(id)
  }
}
