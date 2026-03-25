export class ProductNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Product "${id}" not found.` : 'Product not found.');
  }
}
