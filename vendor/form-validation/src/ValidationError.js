/**
 * Represents a validation error caused by a failed validation rule.
 */
class ValidationError {

  /**
   * Creates a validation error
   * 
   * @param {Field} field - The field that failed validation.
   * @param {Rule} rule - The rule that was violated.
   */
  constructor(field, rule) {
    this.field = field
    this.rule = rule
    this.errorMessage = rule.errorMessage
  }
}

export default ValidationError
