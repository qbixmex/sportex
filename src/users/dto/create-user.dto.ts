import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsString()
  @IsOptional()
  @IsUrl({ protocols: ['https'] })
  @MinLength(1)
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  imagePublicId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: string;
}
