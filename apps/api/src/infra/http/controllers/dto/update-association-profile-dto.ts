import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAssociationProfileDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsNumber()
  @IsOptional()
  membershipFee?: number;

  @IsString()
  @IsOptional()
  membershipPeriod?: string;

  @IsString()
  @IsOptional()
  membershipDescription?: string;
}
