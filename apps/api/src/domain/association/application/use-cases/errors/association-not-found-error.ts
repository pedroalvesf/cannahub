export class AssociationNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Association "${id}" not found.` : 'Association not found.');
  }
}
