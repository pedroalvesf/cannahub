export class NotAnAssociationMemberError extends Error {
  constructor() {
    super('Usuário não é membro de nenhuma associação.');
  }
}
