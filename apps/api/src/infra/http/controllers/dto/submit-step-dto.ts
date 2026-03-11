import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SubmitStepDto {
  @IsInt()
  @Min(1)
  stepNumber!: number;

  @IsString()
  @IsOptional()
  input?: string;

  @IsString()
  @IsOptional()
  selectedOption?: string;
}
