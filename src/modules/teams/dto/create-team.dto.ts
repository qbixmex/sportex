import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Gender, GENDER } from '@/modules/teams/enums';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  permalink!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  format!: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: Gender;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imagePublicId?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ValidateIf((o) => o.tournamentId !== null && o.tournamentId !== undefined)
  @IsUUID()
  tournamentId?: string | null;

  @ValidateIf((o) => o.categoryId !== null && o.categoryId !== undefined)
  @IsUUID()
  categoryId?: string | null;

  @IsEmpty()
  tournament?: never;

  @IsEmpty()
  category?: never;
}