import Result from './Result.js'
import ValidationError from './ValidationError.js'
import { RequiredRule } from './Rule.js'

/**
 * Coordinates validation of configured fields and their rules.
 * 
 * A Validation instance contains the fields that should be validated and produces a Result containing the validation status and errors.
 */
class Validation {

  /**
   * Creates an empty validation configuration.
   */
  constructor() {
    this.fields = []
  }

  /**
   * Adds a field to the validation configuration.
   * 
   * Field identifiers must be unique within a Validation instance.
   * 
   * @param {Field} field - The field to add.
   * @throws {Error} If another field has the same identifier.
   */
  addField(field) {
    if (this.fields.some(f => f.identifier === field.identifier)) {
      throw new Error(`Field with identifier ${field.identifier} already exists`)
    }

    this.fields.push(field)
  }

  /**
   * Removes a field from the validation configuration.
   * 
   * If no field within the specified identifier exists, nothing is removed.
   * 
   * @param {string} identifier - Identifier of the field to remove.
   */
  removeField(identifier) {
    const index = this.fields.findIndex(f => f.identifier === identifier)
    if (index !== -1) {
      this.fields.splice(index, 1)
    }
  }

  /**
   * Validates submitted form data against all configures fields and rules.
   * 
   * Empty values are handled separately so that a RequiredRule can determine whether an empty field is valid.
   *
   * @param {Object} data - Form data indexed by field identifier.
   * @return {Result} The validation result containing success status and errors. 
   */
  validate(data) {
    const result = new Result(true)

    for (const field of this.fields) {
      const value = data[field.identifier]

      const isEmpty = value === null
        || value === undefined
        || typeof value === 'string' && value.trim() === ''

      if (isEmpty) {
        const requiredRuleInstance = field.rules.find(r => r instanceof RequiredRule)

        if (requiredRuleInstance) {
          if (!requiredRuleInstance.validate(value, field, data)) {
            result.success = false
            const validationError = new ValidationError(field, requiredRuleInstance)
            result.addError(validationError)
          }
        }
        continue
      }
      for (const rule of field.rules) {
        if (!rule.validate(value, field, data)) {
          result.success = false
          const validationError = new ValidationError(field, rule)
          result.addError(validationError)
        }
      }
    }
    return result
  }

}

export default Validation
