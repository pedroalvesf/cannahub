import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductVariantDto {
  @IsString()
  @IsNotEmpty()
  volume!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Preço deve ter no máximo 2 casas decimais' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  price!: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  concentration?: string;

  @IsNumber()
  @IsOptional()
  cbd?: number;

  @IsNumber()
  @IsOptional()
  thc?: number;

  @IsString()
  @IsOptional()
  dosagePerDrop?: string;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants!: ProductVariantDto[];
}
