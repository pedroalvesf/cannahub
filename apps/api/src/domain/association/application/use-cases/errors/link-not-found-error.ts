export class LinkNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Link "${id}" not found.` : 'Link not found.');
  }
}
