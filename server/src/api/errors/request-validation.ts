import { FieldValidationError } from 'express-validator';

import { AbstractError } from './error.abstract';
import { ErrorInterface } from './error.interface';

export class RequestValidationError extends AbstractError {
  statusCode = 400;
  type = 'validation';

  constructor(public errors: FieldValidationError[]) {
    super('Request Validation Errors');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const errors = {};
    this.errors.map((error) => (errors[error.path] = error.msg));

    return errors;
  }
}
