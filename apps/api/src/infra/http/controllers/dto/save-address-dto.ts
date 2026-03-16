import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class SaveAddressDto {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state!: string;

  @IsString()
  @IsNotEmpty()
  zipCode!: string;
}
