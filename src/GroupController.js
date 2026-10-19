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
   * Shows the page for one group. The view gets plain values, never the group object itself.
   *
   * @param {Request} req - The request, with the group id in its params.
   * @param {Response} res - The response.
   */
  showGroup(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)

    res.render('group', { id, name: group.getName(), members: group.getMembers() })
  }

  /**
   * Adds a member to a group and goes back to the group page. The group is changed in place, so it
   * does not have to be stored again.
   *
   * @param {Request} req - The request, with the group id in its params and the name in its body.
   * @param {Response} res - The response.
   */
  addMember(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)
    const name = req.body.name
    group.addMember(name)

    res.redirect(`/groups/${id}`)
  }

  /**
   * Shows the form for a new expense, with the members to choose from.
   *
   * @param {Request} req - The request, with the group id in its params.
   * @param {Response} res - The response.
   */
  showExpenseForm(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)

    res.render('expense-form', { id, name: group.getName(), members: group.getMembers() })
  }

  /**
   * Adds an expense split equally between the checked members. Form values arrive as text, and a
   * single checked box arrives as a string rather than an array, so both are converted first.
   *
   * @param {Request} req - The request, with the group id in its params and the expense in its body.
   * @param {Response} res - The response.
   */
  addExpense(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)
    const amount = Number(req.body.amount)
    const participants = [req.body.participants].flat()

    group.addExpense({
      description: req.body.description,
      paidBy: req.body.paidBy,
      amount,
      participants,
    })

    res.redirect(`/groups/${id}`)
  }
}
