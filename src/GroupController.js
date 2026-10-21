import { ExpenseGroup } from 'split-ledger'

/** @typedef {import('./GroupRepository.js').GroupRepository} GroupRepository */
/** @typedef {import('./GroupPresenter.js').GroupPresenter} GroupPresenter */
/** @typedef {import('./FormValidator.js').FormValidator} FormValidator */
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * Handles the HTTP requests about groups. Checks the forms, passes the work on to split-ledger and
 * the repository, and decides which page the user sees next.
 */
export class GroupController {
  #repository
  #presenter
  #validator

  /**
   * Creates a controller. Everything it depends on is passed in, so that server.js alone decides
   * how the application is put together.
   *
   * @param {GroupRepository} repository - Where the groups are kept.
   * @param {GroupPresenter} presenter - Turns group data into text for the views.
   * @param {FormValidator} validator - Checks the forms before anything is stored.
   */
  constructor(repository, presenter, validator) {
    this.#repository = repository
    this.#presenter = presenter
    this.#validator = validator
  }

  /**
   * Creates a group from the submitted form and redirects to it, so that reloading the page does not
   * create the group a second time. An invalid form is shown again with the error, and status 400.
   *
   * @param {Request} req - The request, with the group name in its body.
   * @param {Response} res - The response.
   */
  createGroup(req, res) {
    const errors = this.#validator.validateGroup(req.body)

    if (this.#hasErrors(errors)) {
      res.status(400).render('start', { errors, form: req.body })
      return
    }

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

    this.#renderGroup(res, id, group)
  }

  /**
   * Renders the group page. Shared by showGroup and by every form on the page that has to be shown
   * again with an error, so the page's data is gathered in one place.
   *
   * @param {Response} res - The response.
   * @param {string} id - The group id.
   * @param {object} group - The group to show.
   * @param {object} [errors] - Field errors from FormValidator, if a form on the page was invalid.
   */
  #renderGroup(res, id, group, errors = {}) {
    res.render('group', {
      id,
      name: group.getName(),
      members: group.getMembers(),
      expenses: this.#presenter.expensesOf(group),
      balances: this.#presenter.balancesOf(group),
      transfers: this.#presenter.transfersOf(group),
      errors,
    })
  }

  /**
   * Adds a member to a group and goes back to the group page. The group is changed in place, so it
   * does not have to be stored again. An invalid form shows the group page again with the error.
   *
   * @param {Request} req - The request, with the group id in its params and the name in its body.
   * @param {Response} res - The response.
   */
  createMember(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)
    const errors = this.#validator.validateMember(req.body)

    if (this.#hasErrors(errors)) {
      res.status(400)
      this.#renderGroup(res, id, group, errors)
      return
    }

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
   * Adds an expense, split either equally or by exact amounts depending on what the user chose. Form
   * values arrive as text, so the amount is converted to a number first.
   *
   * @param {Request} req - The request, with the group id in its params and the expense in its body.
   * @param {Response} res - The response.
   */
  createExpense(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)
    const amount = Number(req.body.amount)

    group.addExpense({
      description: req.body.description,
      paidBy: req.body.paidBy,
      amount,
      ...this.#splitFrom(req.body),
    })

    res.redirect(`/groups/${id}`)
  }

  /**
   * Reads how the expense should be split. The form always sends both the checkboxes and the amount
   * fields; the chosen radio button decides which of them counts.
   *
   * @param {object} body - The submitted form.
   * @returns {object} Either { participants } or { exactAmounts }, ready to spread into addExpense.
   */
  #splitFrom(body) {
    if (body.split === 'exact') {
      return { exactAmounts: this.#exactAmountsFrom(body.exactAmounts) }
    }

    return { participants: [body.participants].flat() }
  }

  /**
   * Turns the amount fields into numbers. A field left empty means the member is not part of the
   * expense, so it is left out.
   *
   * @param {object} amounts - The amount per member, as text from the form.
   * @returns {object} The amount per member in kronor, for the members who have one.
   */
  #exactAmountsFrom(amounts) {
    const exactAmounts = {}

    for (const [member, amount] of Object.entries(amounts)) {
      if (amount !== '') {
        exactAmounts[member] = Number(amount)
      }
    }

    return exactAmounts
  }

  /**
   * Deletes an expense that was entered by mistake. The expense id comes from the URL as text, but
   * split-ledger compares ids as numbers, so it is converted first.
   *
   * @param {Request} req - The request, with the group id and the expense id in its params.
   * @param {Response} res - The response.
   */
  deleteExpense(req, res) {
    const id = req.params.id
    const group = this.#repository.findById(id)
    const expenseId = Number(req.params.expenseId)
    group.removeExpense(expenseId)

    res.redirect(`/groups/${id}`)
  }

  /**
   * Tells whether the validator found anything wrong.
   *
   * @param {object} errors - The result from FormValidator.
   * @returns {boolean} True if at least one field is invalid.
   */
  #hasErrors(errors) {
    return Object.keys(errors).length > 0
  }
}
