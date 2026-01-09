import { IsUUID, IsString, IsNumber, Min } from 'class-validator';

export class CreateMilestoneDto {
  @IsUUID()
  tenderId: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
