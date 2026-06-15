import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

const RELATIONSHIP_TYPES = ['parent', 'legal_guardian', 'caregiver', 'spouse'];

export class CreateDependentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsIn(RELATIONSHIP_TYPES)
  relationshipType!: string;
}
