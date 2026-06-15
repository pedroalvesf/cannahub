import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ListAssociationProductsUseCase } from '@/domain/association/application/use-cases/list-association-products';

@Controller('associations')
@Public()
export class GetAssociationProductsController {
  constructor(private listProducts: ListAssociationProductsUseCase) {}

  @Get(':id/products')
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.listProducts.execute({ associationId: id });

    return {
      products: result.value.products.map(({ product, variants }) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        type: product.type,
        category: product.category,
        concentration: product.concentration,
        cbd: product.cbd,
        thc: product.thc,
        dosagePerDrop: product.dosagePerDrop,
        inStock: product.inStock,
        imageUrl: product.imageUrl,
        variants: variants.map((v) => ({
          id: v.id.toString(),
          volume: v.volume,
          price: Number(v.price),
        })),
      })),
    };
  }
}
