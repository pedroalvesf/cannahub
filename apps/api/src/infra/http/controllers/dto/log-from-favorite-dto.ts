import { IsString, IsDateString } from 'class-validator'

export class LogFromFavoriteDto {
  @IsDateString()
  date!: string

  @IsString()
  time!: string
}
