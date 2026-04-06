import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsDateString, ValidateNested, Min } from 'class-validator'
import { Type } from 'class-transformer'

class SeverityAfterUpdateDto {
  @IsString()
  symptomLogId!: string

  @IsString()
  severityAfter!: string
}

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
  @IsBoolean()
  isFavorite?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeverityAfterUpdateDto)
  severityAfterUpdates?: SeverityAfterUpdateDto[]
}
