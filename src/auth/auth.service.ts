import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('¡ Las credenciales son incorrectas !');
    }

    const passwordsMatches = compareSync(dto.password, user.password);

    if (!passwordsMatches) {
      throw new UnauthorizedException('¡ Las credenciales son incorrectas !');
    }

    const data = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password' )
    );

    return {
      message: 'Usuario autentificado satisfactoriamente 👍🎉',
      data,
      // TODO return JWT
      token: 'lorem ipsum',
    };
  }
}
