import { IsBoolean } from 'class-validator';

export class ToggleDocumentSharingDto {
  @IsBoolean()
  share!: boolean;
}
