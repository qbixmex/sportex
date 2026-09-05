import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsArray, IsBoolean, IsEnum, IsOptional } from "class-validator";
import { VALID_ROLES } from "../../../auth/enums";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean({ message: '¡ La propiedad debe ser del tipo boleano !' })
  @IsOptional()
  emailVerified?: boolean;

  @IsArray()
  @IsOptional()
  @IsEnum(VALID_ROLES, {
    each: true,
    message: '¡ Los roles deben ser "admin" ó "user" !',
  })
  roles?: string[];
}