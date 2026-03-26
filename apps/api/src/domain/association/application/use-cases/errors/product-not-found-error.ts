export class ProductNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Produto não encontrado (ID: ${id}).` : 'Produto não encontrado.');
  }
}
