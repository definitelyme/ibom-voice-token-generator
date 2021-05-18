/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const InvalidParamsException = class InvalidParamsException {
  constructor(message, errors) {
    this.message = message;
    this.errors = errors;
  }

  toJson() {
    return {
      message: this.message,
      errors: this.errors,
    };
  }
};

module.exports = {
  InvalidParamsException,
};
