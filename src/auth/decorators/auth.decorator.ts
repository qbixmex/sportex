import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleProtected } from "./role-protected.decorator";
import { UserRoleGuard } from "../guards";
import { ValidRoles } from "../enums";

export const Auth = (...roles: ValidRoles[]) =>
  applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
