import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginUserDto, RegisterUserDto } from './dto/index.js';
import { GetUser } from './decorators/get-user.decorator.js';
import { VALID_ROLES } from './enums/index.js';
import { Auth } from './decorators/auth.decorator.js';
import { User } from '../../modules/users/entities/user.entity.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Version('1')
  @Get('check-status')
  @Auth(VALID_ROLES.USER)
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}
