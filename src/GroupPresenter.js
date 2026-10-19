/** @typedef {import('split-ledger').ExpenseGroup} ExpenseGroup */
/** @typedef {import('split-ledger').Money} Money */

/**
 * Turns split-ledger's objects into plain Swedish text for the views, so that no template has to
 * know what a Money or an Expense is.
 */
export class GroupPresenter {
  #currency = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' })

  /**
   * Describes every expense in a group, in the order they were added.
   *
   * @param {ExpenseGroup} group - The group whose expenses to describe.
   * @returns {object[]} One object per expense with id, description, paidBy, amount and
   *   participants, all ready to print.
   */
  expensesOf(group) {
    return group.getExpenses().map((expense) => ({
      id: expense.getId(),
      description: expense.getDescription(),
      paidBy: expense.getPaidBy(),
      amount: this.#formatMoney(expense.getAmount()),
      participants: expense.getParticipants().join(', '),
    }))
  }

  /**
   * Formats an amount the Swedish way, for example "3 000,00 kr".
   *
   * @param {Money} money - The amount to format.
   * @returns {string} The amount as text.
   */
  #formatMoney(money) {
    return this.#currency.format(money.getKronor())
  }
}
