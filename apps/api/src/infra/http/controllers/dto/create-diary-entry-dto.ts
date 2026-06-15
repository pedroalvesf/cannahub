import { IsString, IsOptional, IsNumber, IsArray, IsDateString, IsInt, Max, ValidateNested, Min } from 'class-validator'
import { Type } from 'class-transformer'

class SymptomInputDto {
  @IsString()
  symptomKey!: string

  @IsOptional()
  @IsString()
  customSymptomName?: string

  @IsInt()
  @Min(0)
  @Max(10)
  severityBefore!: number
}

export class CreateDiaryEntryDto {
  @IsDateString()
  date!: string

  @IsString()
  time!: string

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

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsString()
  targetCondition?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SymptomInputDto)
  symptoms?: SymptomInputDto[]
}
