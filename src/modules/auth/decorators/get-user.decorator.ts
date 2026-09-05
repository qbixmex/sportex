import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  if (!request.user) {
    throw new InternalServerErrorException('Usuario no encontrado (request)');
  }

  return (!data) ? request.user : request.user[data];
});
