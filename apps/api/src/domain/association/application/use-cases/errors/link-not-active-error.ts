export class LinkNotActiveError extends Error {
  constructor() {
    super(
      'Só é possível compartilhar documentos com associações onde o vínculo está ativo.',
    );
  }
}
