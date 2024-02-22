export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail address already in use');
  }
}
