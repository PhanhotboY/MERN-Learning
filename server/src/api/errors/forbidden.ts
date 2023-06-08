import { AbstractError } from './error.abstract';

export class ForbiddenError extends AbstractError {
  statusCode = 403;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return {
      forbidden: this.message,
    };
  }
}
