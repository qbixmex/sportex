import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: () => void) {
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== 'secret-key-123') {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
