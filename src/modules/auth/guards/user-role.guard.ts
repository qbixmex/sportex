import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    // const request = context.switchToHttp().getRequest();
    // const user = request.user as User;

    // if (!user) {
    //   throw new BadRequestException('¡ Usuario no encontrado !');
    // }

    // for (const role of user.roles) {
    //   if (validRoles.includes(role)) {
    //     return true;
    //   }
    // }
    
    // throw new ForbiddenException(
    //   'No tienes permisos administrativos para realizar esta acción'
    // );
    return true;
  }
}
