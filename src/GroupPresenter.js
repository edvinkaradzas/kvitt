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
   * Describes where each member stands: whether they are owed money, owe money or are even.
   *
   * @param {ExpenseGroup} group - The group whose balances to describe.
   * @returns {object[]} One object per member with name, status and amount, all ready to print.
   */
  balancesOf(group) {
    return [...group.getBalances()].map(([name, balance]) => ({
      name,
      status: this.#statusOf(balance),
      amount: this.#amountOf(balance),
    }))
  }

  /**
   * Describes the payments that settle the group. split-ledger's own Transfer.toString() is in
   * English, so the sentence is built in the view instead.
   *
   * @param {ExpenseGroup} group - The group to settle.
   * @returns {object[]} One object per payment with from, to and amount, all ready to print.
   */
  transfersOf(group) {
    return group
      .getSettlementPlan()
      .getTransfers()
      .map((transfer) => ({
        from: transfer.getFrom(),
        to: transfer.getTo(),
        amount: this.#formatMoney(transfer.getAmount()),
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

  /**
   * Puts a balance into words. Zero is checked first, since zero is neither owed nor owing.
   *
   * @param {Money} balance - A member's balance. Positive means the member is owed money.
   * @returns {string} 'är kvitt', 'ska betala' or 'ska få'.
   */
  #statusOf(balance) {
    if (balance.isZero()) {
      return 'är kvitt'
    }

    if (balance.isNegative()) {
      return 'ska betala'
    }

    return 'ska få'
  }

  /**
   * Formats a balance without its sign, since the status already says which way the money goes.
   *
   * @param {Money} balance - A member's balance.
   * @returns {string} The amount, or an empty string for a member who is even.
   */
  #amountOf(balance) {
    if (balance.isZero()) {
      return ''
    }

    return this.#currency.format(Math.abs(balance.getKronor()))
  }
}
