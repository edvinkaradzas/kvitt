/**
 * Abstract base class for validation rules.
 * 
 * Subclasses define their own validation logic by implementing validate()
 * 
 */
export class Rule {

  /**
   * Creates a validation rule.
   * 
   * @param {string} errorMessage - The message returned when the rule is violated.
   * @throws {Error} If rule is instantiated directly.
   */
  constructor(errorMessage) {
    if (this.constructor === Rule) {
      throw new Error('Rule is an abstract class and cannot be instantiated')
    }

    this.errorMessage = errorMessage
  }

  /**
   * Validates a value according to the rule.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} Whether the value satisfies the rule.
   * @throws {Error} If called without being implemented by a subclass.
   */
  validate(value, field, formData) {
    throw new Error(`The method 'validate()' must be implemented by the subclass [${this.constructor.name}]`)
  }
}

/**
 * Validates that a field contains a value.
 * 
 * Empty strings, null and undefined values are considered invalid.
 */
export class RequiredRule extends Rule {

  /**
   * Creates a required-field rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'This field is required.')
  }

  /**
   * Checks whether the value is present and not empty.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value is present.
   */
  validate(value, field, formData) {
    return value !== null && value !== undefined && value.trim() !== ''
  }
}

/**
 * Validates that a value has a valid email address format.
 */
export class EmailRule extends Rule {

  /**
   * Creates a email validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'Please enter a valid email address.')
  }

  /**
   * Checks whether the value matches the expected email format.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value has a valid email format.
   */
  validate(value, field, formData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }
}

/**
 * Validates that a value contains only letters.
 */
export class OnlyLettersRule extends Rule {

  /**
   * Creates a only-letters validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'This field may only contain letters.')
  }

  /**
   * Checks whether the value contains only letters.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value contains only letters.
   */
  validate(value, field, formData) {
    const letterRegex = /^\p{L}*$/u
    return letterRegex.test(value)
  }
}

/**
 * Validates that a value contains only digits.
 */
export class OnlyDigitsRule extends Rule {

  /**
   * Creates a only-digits validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'This field may only contain digits.')
  }

  /**
   * Checks whether the value contains only digits.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value contains only digits.
   */
  validate(value, field, formData) {
    const digitRegex = /^\d+$/
    return digitRegex.test(value)
  }
}

/**
 * Validates that a value contains at least a specified number of characters.
 */
export class MinLengthRule extends Rule {

  /**
   * Creates a minimum-length validation rule.
   * 
   * @param {number} minLength - The minimum number of characters allowed.
   * @param {string} [errorMessage] - Optional custom error message.
   * @throws {Error} If minLength is not a non-negative integer.
   */
  constructor(minLength, errorMessage) {
    if (!Number.isInteger(minLength) || minLength < 0) {
      throw new Error('minLength must be a non-negative integer')
    }

    super(errorMessage || `This field must contain at least ${minLength} characters.`)
    this.minLength = minLength
  }

  /**
   * Checks whether the value meets the minimum length.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value has the required minimum length.
   */
  validate(value, field, formData) {
    return value.length >= this.minLength && value.length >= 0
  }
}

/**
 * Validates that a value does not exceed a specified number of characters.
 */
export class MaxLengthRule extends Rule {

  /**
   * Creates a maximum-length validation rule.
   * 
   * @param {number} maxLength - The maximum number of characters allowed.
   * @param {string} [errorMessage] - Optional custom error message.
   * @throws {Error} If maxLength is not a non-negative integer.
   */
  constructor(maxLength, errorMessage) {
    if (!Number.isInteger(maxLength) || maxLength < 0) {
      throw new Error('maxLength must be a non-negative integer')
    }

    super(errorMessage || `This field may contain at most ${maxLength} characters.`)
    this.maxLength = maxLength
  }

  /**
   * Checks whether the value is within the maximum length.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value does not exceed the maximum length.
   */
  validate(value, field, formData) {
    return value.length <= this.maxLength && value.length >= 0
  }
}

/**
 * Validates that a numeric value is greater than or equal to a minimum value.
 */
export class MinValueRule extends Rule {

  /**
   * Creates a minimum-value validation rule.
   * 
   * @param {number} minValue - The minimum value allowed.
   * @param {string} [errorMessage] - Optional custom error message.
   * @throws {Error} If minValue is not a valid number.
   */
  constructor(minValue, errorMessage) {
    if (typeof minValue !== 'number' || Number.isNaN(minValue)) {
      throw new Error('minValue must be a number')
    }

    super(errorMessage || `This value must be at least ${minValue}.`)
    this.minValue = minValue
  }

  /**
   * Checks whether the value is greater than or equal to the minimum value.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value meets the minimum value.
   */
  validate(value, field, formData) {
    return Number(value) >= this.minValue && value.length >= 0
  }
}

/**
 * Validated that a numeric value does not exceed a maximum value.
 */
export class MaxValueRule extends Rule {

  /**
   * Creates a maximum-value validation rule.
   * 
   * @param {number} maxValue - The maximum value allowed.
   * @param {string} [errorMessage] - Optional custom error message.
   * @throws {Error} If maxValue is not a valid number.
   */
  constructor(maxValue, errorMessage) {
    if (typeof maxValue !== 'number' || Number.isNaN(maxValue)) {
      throw new Error('maxValue must be a number')
    }

    super(errorMessage || `This value must not exceed ${maxValue}.`)
    this.maxValue = maxValue
  }

  /**
   * Checks whether the value does not exceed the maximum value.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value is within the maximum value.
   */
  validate(value, field, formData) {
    return Number(value) <= this.maxValue && value.length >= 0
  }
}

/**
 * Validates that a value contains a uppercase letter.
 */
export class UppercaseRule extends Rule {

  /**
   * Creates a uppercase validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'This field must contain an uppercase letter.')
  }

  /**
   * Checks whether the value contains an uppercase letter.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value contains an uppercase letter.
   */
  validate(value, field, formData) {
    const uppercaseRegex = /\p{Lu}/u
    return uppercaseRegex.test(value)
  }
}

/**
 * Validates that a value contains a lowercase letter.
 */
export class LowercaseRule extends Rule {

  /**
   * Creates a lowercase validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'This field must contain a lowercase letter.')
  }

  /**
   * Checks whether the value contains a lowercase letter.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value contains a lowercase letter.
   */
  validate(value, field, formData) {
    const lowercaseRegex = /\p{Ll}/u
    return lowercaseRegex.test(value)
  }
}

/**
 * Validates that a value contains at least one special character.
 */
export class SpecialCharacterRule extends Rule {

  /**
   * Creates a special-character validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage)
    this.errorMessage = errorMessage || 'This field must contain a special character.'
  }

  /**
   * Checks whether the value contains a special character.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value contains a special character.
   */
  validate(value, field, formData) {
    const specialCharacterRegex = /[^\p{L}\d\s]/u
    return specialCharacterRegex.test(value)
  }
}

/**
 * Validates that a value does not contain code or web links.
 */
export class NoCodeOrLinksRule extends Rule {

  /**
   * Creates a code-and-link validation rule.
   * 
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(errorMessage) {
    super(errorMessage || 'This field may not contain code or links.')
  }

  /**
   * Checks whether the value contains neither code nor links.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when the value contains no detected code or links.
   */
  validate(value, field, formData) {
    const codeRegex = /<[^>]*>|javascript:/i
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i

    return (!codeRegex.test(value) && !linkRegex.test(value))
  }
}

/**
 * Validates that a field has the same value as another field.
 */
export class MatchingFieldsRule extends Rule {

  /**
   * Creates a matching-fields validation rule.
   * 
   * @param {string} identifier - Identifier of the field to compare against.
   * @param {string} [errorMessage] - Optional custom error message.
   */
  constructor(identifier, errorMessage) {
    super(errorMessage || 'The fields do not match.')
    this.identifier = identifier
  }

  /**
   * Checks whether the value matches the referenced field.
   * 
   * @param {*} value - The value to validate.
   * @param {Field} field - The field being validated.
   * @param {Object} formData - All submitted form data.
   * @returns {boolean} True when both field values are equal.
   */
  validate(value, field, formData) {
    return value === formData[this.identifier]
  }
}
