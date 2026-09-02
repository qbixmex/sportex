import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { RegisterUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterUserDto) {
    try {
      const { password, ...userData } = dto;

      const newUser = this.userRepository.create({
        email: userData.email,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      return {
        message: 'El registro fue realizado exitosamente 👍',
        data: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          imageUrl: newUser.imageUrl,
          imagePublicId: newUser.imagePublicId,
          isActive: newUser.isActive,
          roles: newUser.roles,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        token: this.getJwtToken({ id: newUser.id }),
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

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
      Object.entries(user).filter(([key]) => key !== 'password')
    );

    return {
      message: 'Usuario autentificado satisfactoriamente 👍🎉',
      data,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }

  private handleExceptions(error: unknown): never {
    if (error instanceof QueryFailedError) {
      this.logger.error(`📌 Database Error (TypeORM):\n${error.message}`);
      this.logger.error(`Postgres Code: ${error.driverError?.code}`);
      if (error.driverError?.code === '23505') {
        const columnError = (error.driverError?.detail as string).split('=')[1].split(' ')[0];
        const errorMessage = `${columnError} ya existe, elija otro`;
        this.logger.error(errorMessage);
        throw new BadRequestException('Database Error', errorMessage);
      }
    } else if (error instanceof Error) {
      this.logger.error(`📌 Message:\n${error.message}`);
      this.logger.error(`Stack trace:\n${error.stack}`);
    } else {
      this.logger.error(error);
    }
    throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
  }
}
