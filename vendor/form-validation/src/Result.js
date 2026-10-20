/**
 * Represents the result of a validation.
 * 
 * The result contains the overall validation status and any validation errors.
 *
 */
class Result {

  /**
   * Creates a new validation result.
   * 
   * @param {boolean} success - Whether the validation was successful.
   */
  constructor(success) {
    this.success = success
    this.errors = []
  }

  /**
   * Adds a validation error to the result.
   *
   * @param {ValidationError} validationError - The error produced vy a failed rule.
   */
  addError(validationError) {
    this.errors.push(validationError)
  }

}

export default Result
