import { AbstractError } from './error.abstract';

export class NotAuthorizedError extends AbstractError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return {
      notAuthorized: this.message,
    };
  }
}
