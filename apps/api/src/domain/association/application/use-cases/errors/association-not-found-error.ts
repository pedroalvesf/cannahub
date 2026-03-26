export class AssociationNotFoundError extends Error {
  constructor(id?: string) {
    super(
      id
        ? `Associação não encontrada (ID: ${id}). Verifique se a associação está cadastrada no sistema.`
        : 'Associação não encontrada.',
    );
  }
}
