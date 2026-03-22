import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['approved', 'rejected'])
  accountStatus!: 'approved' | 'rejected';
}
