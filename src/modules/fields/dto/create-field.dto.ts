import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateFieldDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  permalink?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  map?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teamsIds?: string[];
}
