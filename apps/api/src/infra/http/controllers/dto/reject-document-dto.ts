import { IsNotEmpty, IsString } from 'class-validator';

export class RejectDocumentDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
