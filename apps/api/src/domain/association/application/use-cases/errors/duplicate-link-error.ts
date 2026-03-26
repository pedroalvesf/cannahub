export class DuplicateLinkError extends Error {
  constructor() {
    super('Já existe uma solicitação de vínculo para este paciente e associação.');
  }
}
