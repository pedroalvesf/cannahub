import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { ProductsRepository } from '@/domain/association/application/repositories/products-repository';

@Controller('associations')
@Public()
export class GetAssociationProductTypesController {
  constructor(private productsRepository: ProductsRepository) {}

  @Get(':id/product-types')
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const products = await this.productsRepository.findByAssociationId(id);

    const types = [...new Set(products.map((p) => p.type))];
    const categories = [...new Set(products.map((p) => p.category))];

    return {
      types,
      categories,
      totalProducts: products.length,
    };
  }
}
