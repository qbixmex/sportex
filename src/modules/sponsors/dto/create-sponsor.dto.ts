import {
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class CreateSponsorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imagePublicId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  position?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  clicks?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}