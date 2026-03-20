export class CpfAlreadyInUseError extends Error {
  constructor() {
    super('CPF already in use');
  }
}
