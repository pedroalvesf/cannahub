export class DuplicateLinkError extends Error {
  constructor() {
    super('A link request already exists for this patient and association.');
  }
}
