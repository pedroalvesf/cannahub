import { IsString, IsOptional, IsBoolean, IsArray, IsDateString, IsInt, Max, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class SymptomAssessmentDto {
  @IsString()
  symptomLogId!: string

  @IsInt()
  @Min(0)
  @Max(10)
  severityAfter!: number
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

export class CreateDiaryFollowUpDto {
  @IsDateString()
  evaluatedAt!: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SymptomAssessmentDto)
  symptomAssessments?: SymptomAssessmentDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EffectInputDto)
  effects?: EffectInputDto[]
}

export class UpdateDiaryFollowUpDto {
  @IsOptional()
  @IsDateString()
  evaluatedAt?: string

  @IsOptional()
  @IsString()
  notes?: string | null

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SymptomAssessmentDto)
  symptomAssessments?: SymptomAssessmentDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EffectInputDto)
  effects?: EffectInputDto[]
}
