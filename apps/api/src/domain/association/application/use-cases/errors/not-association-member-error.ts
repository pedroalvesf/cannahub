export class NotAnAssociationMemberError extends Error {
  constructor() {
    super('User is not a member of any association.');
  }
}
