import { IsString, IsOptional, IsNumber, IsArray, Min } from 'class-validator'

export class CreateDiaryFavoriteDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @IsString()
  customProductName?: string

  @IsString()
  administrationMethod!: string

  @IsNumber()
  @Min(0)
  doseAmount!: number

  @IsString()
  doseUnit!: string

  @IsArray()
  @IsString({ each: true })
  symptomKeys!: string[]
}
