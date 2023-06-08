export type ErrorInterface = Partial<
  Record<
    // Field validation errors
    | 'password'
    | 'email'
    | 'phoneNumber'
    | 'confirmPassword'
    | 'firstName'
    | 'lastName'

    // Client request errors
    | 'notFound'
    | 'validation'
    | 'forbidden'
    | 'badRequest'
    | 'notAuthorized'

    // Internal server errors
    | 'internalServer',
    string
  >
>;

export interface ErrorResponseInterface {
  errors: ErrorInterface;
}
