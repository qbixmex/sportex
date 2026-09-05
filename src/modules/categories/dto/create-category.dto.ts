import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: '¡ El nombre es obligatorio !' })
  @IsString({ message: '¡ El nombre debe ser una cadena de texto !' })
  @MinLength(3, { message: '¡ El nombre debe ser igual o mayor a 3 caracteres !' })
  name!: string;

  @IsOptional()
  @IsString({ message: '¡ El enlace permanente debe ser una cadena de texto !' })
  @MinLength(3, { message: '¡ El enlace permanente debe ser igual o mayor a 3 caracteres !' })
  permalink?: string;
}
