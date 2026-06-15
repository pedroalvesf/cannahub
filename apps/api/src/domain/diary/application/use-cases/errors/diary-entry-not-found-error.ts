export class DiaryEntryNotFoundError extends Error {
  constructor(id?: string) {
    super(
      id
        ? `Registro de diario nao encontrado (ID: ${id}).`
        : 'Registro de diario nao encontrado.',
    )
  }
}
