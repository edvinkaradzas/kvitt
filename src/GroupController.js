import { ExpenseGroup } from 'split-ledger'

/** @typedef {import('./GroupRepository.js').GroupRepository} GroupRepository */
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * Handles the HTTP requests about groups. Passes the work on to split-ledger and the repository and
 * decides which page the user sees next.
 */
export class GroupController {
  #repository

  /**
   * Creates a controller that stores and finds groups through the given repository.
   *
   * @param {GroupRepository} repository - Where the groups are kept.
   */
  constructor(repository) {
    this.#repository = repository
  }

  /**
   * Creates a group from the submitted form and redirects to it, so that reloading the page does not
   * create the group a second time.
   *
   * @param {Request} req - The request, with the group name in its body.
   * @param {Response} res - The response.
   */
  createGroup(req, res) {
    const name = req.body.name
    const group = new ExpenseGroup(name)
    const id = this.#repository.add(group)

    res.redirect(`/groups/${id}`)
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  /**
   * Shows the page for one group. The view gets plain values, never the group object itself.
   *
   * @param {Request} req - The request, with the group id in its params.
   * @param {Response} res - The response.
   */
  showGroup(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)
    res.render('group', { name: group.getName() })
  }
}
