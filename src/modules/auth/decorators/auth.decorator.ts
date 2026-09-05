import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleProtected } from "./role-protected.decorator.js";
import { UserRoleGuard } from "../guards/index.js";
import { ValidRoles } from "../enums/index.js";

export const Auth = (...roles: ValidRoles[]) =>
  applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
