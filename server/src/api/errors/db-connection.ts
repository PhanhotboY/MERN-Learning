import { AbstractError } from './error.abstract';

export class DBConnectionError extends AbstractError {
  statusCode = 500;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serializeErrors() {
    return {
      internalServer: this.message,
    };
  }
}
