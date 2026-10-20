import Field from '../vendor/form-validation/src/Field.js'
import Validation from '../vendor/form-validation/src/Validation.js'
import { RequiredRule } from '../vendor/form-validation/src/Rule.js'

/**
 * Checks Kvitt's forms before anything is stored. The only class that knows the form-validation
 * module exists: the rest of the application only ever sees plain { field: message } objects.
 */
export class FormValidator {
  /**
   * Checks the form that creates a group.
   *
   * @param {object} form - The submitted form.
   * @returns {object} One Swedish message per invalid field. Empty when the form is valid.
   */
  validateGroup(form) {
    const validation = new Validation()
    const name = new Field('name')
    name.addRule(new RequiredRule('Gruppen måste ha ett namn.'))
    validation.addField(name)

    const result = validation.validate(form)

    return this.#errorsFrom(result)
  }

  /**
   * Checks the form that adds a member to a group.
   *
   * @param {object} form - The submitted form.
   * @returns {object} One Swedish message per invalid field. Empty when the form is valid.
   */
  validateMember(form) {
    const validation = new Validation()
    const name = new Field('name')
    name.addRule(new RequiredRule('Medlemmen måste ha ett namn.'))
    validation.addField(name)

    return this.#errorsFrom(validation.validate(form))
  }

  /**
   * Translates form-validation's result into Kvitt's own shape. Keeps only the first message per
   * field, since a field can break more than one rule at once.
   *
   * @param {object} result - The result from form-validation.
   * @returns {object} The field name mapped to its message.
   */
  #errorsFrom(result) {
    const errors = {}

    for (const error of result.errors) {
      errors[error.field.identifier] ??= error.errorMessage
    }

    return errors
  }
}
