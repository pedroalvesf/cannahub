import { IsNotEmpty, IsString } from 'class-validator';

export class EscalateDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
