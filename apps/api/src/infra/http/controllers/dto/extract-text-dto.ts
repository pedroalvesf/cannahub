import { IsNotEmpty, IsString } from 'class-validator';

export class ExtractTextDto {
  @IsString()
  @IsNotEmpty()
  input!: string;
}
