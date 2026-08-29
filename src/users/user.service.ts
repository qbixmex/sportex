import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll() {
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
  }

  async findById(id: string) {
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
  }

  async findByUsername(username: string) {
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
  }

  async create(dto: CreateUserDto) {
    const emailExists = await this.userRepository.count({
      where: {
        email: dto.email,
      }
    });

    if (emailExists > 0) {
      throw new BadRequestException(
        `¡ El usuario con el email: [${dto.email}] ya existe !`
      );
    }

    try {
      const newUser = this.userRepository.create({
        ...dto,
        password: bcrypt.hashSync(dto.password),
      });

      await this.userRepository.save(newUser);

      const { password, ...user } = newUser;

      return {
        message: 'Usuario creado satisfactoriamente 👍',
        data: user
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
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
      throw new NotFoundException(`¡ El usuario con id: [${id}], no existe en la base de datos !`)
    }

    const updatedUser = this.userRepository.merge(user, dto);

    try {
      await this.userRepository.save(updatedUser);

      return {
        message: 'Usuario actualizado exitosamente 👍',
        data: updatedUser,
      }
    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
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
      throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`)
    }

    try {
      await this.userRepository.delete({ id: user.id });

      return {
        message: 'Usuario eliminado satisfactoriamente 👍',
        user,
      };
    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException('¡ Error desconocido, revisa los logs para mas información !');
    }
  }
}
