export class DocumentsNotSharedError extends Error {
  constructor() {
    super('Este paciente não compartilhou os documentos com a associação.');
  }
}
