import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export const ACCOUNT_TYPES = ['patient', 'guardian', 'prescriber', 'veterinarian', 'caregiver'] as const;
export type AccountTypeValue = (typeof ACCOUNT_TYPES)[number];

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  name!: string;

  @IsIn(ACCOUNT_TYPES, { message: 'Tipo de conta inválido' })
  @IsOptional()
  accountType?: AccountTypeValue;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[\d\s()-]{8,20}$/, { message: 'Telefone inválido' })
  phone?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos numéricos' })
  cpf?: string;
}
