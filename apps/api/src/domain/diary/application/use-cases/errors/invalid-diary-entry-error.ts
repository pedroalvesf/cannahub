export class InvalidDiaryEntryError extends Error {
  constructor(message?: string) {
    super(message ?? 'Dados do registro de diario invalidos.')
  }
}
