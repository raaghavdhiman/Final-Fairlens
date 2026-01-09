import { IsUUID, IsNumber, IsString, Min } from 'class-validator';

export class CreateBidDto {
  @IsUUID()
  tenderId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  proposal: string;
}
