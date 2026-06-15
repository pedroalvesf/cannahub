export class NotAllowedError extends Error {
  constructor() {
    super('Voce nao tem permissao para acessar este recurso.')
  }
}
