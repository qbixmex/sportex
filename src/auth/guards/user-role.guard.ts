import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../../users/entities/user.entity';

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
