export class DiaryFavoriteNotFoundError extends Error {
  constructor(id?: string) {
    super(
      id
        ? `Favorito nao encontrado (ID: ${id}).`
        : 'Favorito nao encontrado.',
    )
  }
}
