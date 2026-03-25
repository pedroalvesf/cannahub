import { Body, Controller, ForbiddenException, HttpCode, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PermissionsGuard } from '@/infra/auth/guards/permissions-guard';
import { RequirePermission } from '@/infra/auth/decorators/require-permission.decorator';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetUserAssociationUseCase } from '@/domain/association/application/use-cases/get-user-association';
import { CreateProductUseCase } from '@/domain/association/application/use-cases/create-product';
import { CreateProductDto } from '../dto/create-product-dto';
import { AssociationNotFoundError } from '@/domain/association/application/use-cases/errors/association-not-found-error';

@Controller('association/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('association_catalog', 'create')
export class AssociationCreateProductController {
  constructor(
    private getUserAssociation: GetUserAssociationUseCase,
    private createProduct: CreateProductUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateProductDto,
  ) {
    const assocResult = await this.getUserAssociation.execute({ userId: user.sub });
    if (assocResult.isLeft()) throw new ForbiddenException();

    const result = await this.createProduct.execute({
      associationId: assocResult.value.associationId,
      ...body,
    });

    if (result.isLeft()) {
      if (result.value instanceof AssociationNotFoundError) {
        throw new NotFoundException(result.value.message);
      }
    }

    if (result.isRight()) {
      return {
        product: {
          id: result.value.product.id.toString(),
          name: result.value.product.name,
        },
      };
    }
  }
}
