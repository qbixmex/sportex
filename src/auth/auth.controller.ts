import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

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
  @Get('private')
  @SetMetadata('roles', ['user', 'admin'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRoute(@GetUser('email') email: string) {
    return {
      ok: true,
      message: 'Ruta Privada 🔐',
      data: email,
    };
  }
}
