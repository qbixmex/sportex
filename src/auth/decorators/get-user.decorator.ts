import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  if (!request.user) {
    throw new InternalServerErrorException('Usuario no encontrado (request)');
  }

  return request.user;
});
