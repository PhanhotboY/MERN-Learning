import { AbstractError } from './error.abstract';

export class NotFoundError extends AbstractError {
  statusCode = 404;

  constructor() {
    super('Page not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return {
      notFound: 'Page not found',
    };
  }
}
