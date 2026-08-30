import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateTournamentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name!: string;

  @IsString()
  @IsString()
  @MinLength(4)
  permalink!: string;

  @IsString()
  @IsUrl({ protocols: ['https'] })
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imagePublicId?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(255)
  description?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  stage?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  country?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  state?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  city?: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  season?: string;

  @IsDateString()
  @IsOptional()
  startDate!: Date;

  @IsDateString()
  @IsOptional()
  endDate!: Date;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
