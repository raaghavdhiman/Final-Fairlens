import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CreateTenderDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;
}
