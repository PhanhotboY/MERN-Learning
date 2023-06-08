import { AbstractError } from './error.abstract';

export class BadRequestError extends AbstractError {
  statusCode = 400;
  type?: string;

  constructor({ type, message }: { type?: string; message: string }) {
    super(message);
    this.type = type;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return {
      [this.type || 'badRequest']: this.message,
    };
  }
}
