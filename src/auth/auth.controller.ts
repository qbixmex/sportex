import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { VALID_ROLES } from './enums';
import { Auth } from './decorators/auth.decorator';
import { User } from '../users/entities/user.entity';

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
