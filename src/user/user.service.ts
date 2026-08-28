import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  private users: Map<string, User> = new Map();

  findAll() {
    return Array.from(this.users.values());
  }

  findById(id: string): User {
    if (!this.users.has(id)) {
      throw new NotFoundException(`El usuario con id: [${id}], no existe en la base de datos`)
    }

    return this.users.get(id) as User;
  }

  create(dto: CreateUserDto) {
    const users = Array.from(this.users.values());

    if (users.find(({ email }) => email === dto.email)) {
      throw new BadRequestException(
        `¡ El usuario con el email: [${dto.email}] ya existe !`
      );
    }

    const newUser = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      createdAt: new Date(),
    };

    this.users.set(newUser.id, newUser);

    return {
      message: 'Usuario creado satisfactoriamente',
      data: this.users.get(newUser.id) as User,
    };
  }

  update(id: string, dto: UpdateUserDto) {
    const foundUser = this.findById(id);

    const updatedUser = {
      ...foundUser,
      name: dto.name as string,
      email: dto.email as string,
    };

    this.users.set(id, updatedUser);

    return updatedUser;
  }

  delete(id: string) {
    const foundUser = this.findById(id);

    this.users.delete(foundUser.id);

    return {
      message: 'Usuario eliminado satisfactoriamente',
    };
  }
}
