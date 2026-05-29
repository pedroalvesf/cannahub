import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min } from 'class-validator'

export class UpdateDiaryEntryDto {
  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsString()
  time?: string

  @IsOptional()
  @IsString()
  productId?: string | null

  @IsOptional()
  @IsString()
  customProductName?: string | null

  @IsOptional()
  @IsString()
  administrationMethod?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  doseAmount?: number

  @IsOptional()
  @IsString()
  doseUnit?: string

  @IsOptional()
  @IsString()
  notes?: string | null

  @IsOptional()
  @IsString()
  targetCondition?: string | null

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean
}
