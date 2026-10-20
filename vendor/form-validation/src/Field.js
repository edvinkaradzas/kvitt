/**
 * Represents a field that can be validated.
 * 
 * A field has a unique identifier and a collection of validation rules.
 */
class Field {

  /**
   * Creates a new field.
   * 
   * @param {string} identifier - The unique identifier of the field.
   */
  constructor(identifier) {
    this.identifier = identifier
    this.rules = []
  }

  /**
   * Adds a validation rule to the field.
   * 
   * A field cannot contain more than one rule of the same rule type.
   *
   * @param {Rule} rule - The validation rule to add.
   * @throws {Error} If a rule of the same type has already been added.
   */
  addRule(rule) {
    if (this.rules.some(existingRule => existingRule.constructor === rule.constructor)) {
      throw new Error(`Rule already exists for field ${this.identifier}`)
    }
    this.rules.push(rule)
  }

}

export default Field
