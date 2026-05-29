import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsDateString, IsInt, Max, ValidateNested, Min } from 'class-validator'
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

class EffectInputDto {
  @IsString()
  effectKey!: string

  @IsBoolean()
  isPositive!: boolean

  @IsOptional()
  @IsString()
  customEffectName?: string
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EffectInputDto)
  effects?: EffectInputDto[]
}
