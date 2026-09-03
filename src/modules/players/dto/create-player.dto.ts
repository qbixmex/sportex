import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imagePublicId?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ValidateIf((o) => o.teamId !== null && o.teamId !== undefined)
  @IsUUID()
  teamId?: string | null;

  @IsEmpty()
  team?: never;
}
