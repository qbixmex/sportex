import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository, QueryFailedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async findAll() {
    try {
      return await this.userRepository.find({
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          emailVerified: true,
          imageUrl: true,
          imagePublicId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          imageUrl: true,
          imagePublicId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`)
      }

      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          imageUrl: true,
          imagePublicId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException(
          `¡ No se encuentra el usuario con su nombre de usuario: [${username}], en la base de datos !`
        )
      }

      return user;
    } catch(error) {
      this.handleExceptions(error);
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create({
        email: dto.email,
        password: bcrypt.hashSync(dto.password),
      });

      await this.userRepository.save(newUser);

      const userWithoutPassword = Object.fromEntries(
        Object.entries(newUser).filter(([key]) => key !== 'password'),
      );

      return {
        message: 'Usuario creado satisfactoriamente 👍',
        data: userWithoutPassword,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        imagePublicId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException(
        `¡ El usuario con id: [${id}], no existe en la base de datos !`
      );
    }

    const updatedUser = this.userRepository.merge(user, {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      imageUrl: dto.imageUrl,
      imagePublicId: dto.imagePublicId,
      isActive: Boolean(dto.isActive),
    });

    try {
      await this.userRepository.save(updatedUser);

      return {
        message: 'Usuario actualizado exitosamente 👍',
        data: updatedUser,
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        imagePublicId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`);
    }

    try {
      await this.userRepository.delete({ id: user.id });

      return {
        message: 'Usuario eliminado satisfactoriamente 👍',
        user,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: unknown) {
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
