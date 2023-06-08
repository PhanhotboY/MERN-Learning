import { ErrorInterface } from './error.interface';

export abstract class AbstractError extends Error {
  abstract statusCode: number;

  abstract serializeErrors(): ErrorInterface;
}
