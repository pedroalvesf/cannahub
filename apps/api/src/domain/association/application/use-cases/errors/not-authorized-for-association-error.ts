export class NotAuthorizedForAssociationError extends Error {
  constructor() {
    super('You are not authorized to perform this action on this association.');
  }
}
