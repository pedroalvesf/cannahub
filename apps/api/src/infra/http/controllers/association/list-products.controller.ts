import { Controller, ForbiddenException, Get, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { ListAssociationProductsUseCase } from '@/domain/association/application/use-cases/list-association-products';

@Controller('association/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_catalog', 'read')
export class AssociationListProductsController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private listProducts: ListAssociationProductsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.listProducts.execute({
      associationId: assocResult.value.associationId,
    });

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
        createdAt: product.createdAt,
        variants: variants.map((v) => ({
          id: v.id.toString(),
          volume: v.volume,
          price: Number(v.price),
        })),
      })),
    };
  }
}
