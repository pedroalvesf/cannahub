export class NotAuthorizedForAssociationError extends Error {
  constructor() {
    super('Você não tem permissão para realizar esta ação nesta associação.');
  }
}
