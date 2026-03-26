export class LinkNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Vínculo não encontrado (ID: ${id}).` : 'Vínculo não encontrado.');
  }
}
