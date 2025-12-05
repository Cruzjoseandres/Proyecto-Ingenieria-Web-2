import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const usuarioexistente = await this.findByEmail(createUserDto.email)
    if(usuarioexistente){
      throw new ConflictException(`El correo ${createUserDto.email} ya está en uso`);
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save(createUserDto);
  }

async createValidator(createUserDto: CreateUserDto) {
    const usuarioexistente = await this.findByEmail(createUserDto.email)
    if(usuarioexistente){
      throw new ConflictException(`El correo ${createUserDto.email} ya está en uso`);
    }
  createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const validatorUser = {
      ...createUserDto,
      role: 'validator',
    };
    return await this.userRepository.save(validatorUser);
  }

  async createOrganizador(createUserDto: CreateUserDto) {
      const usuarioexistente = await this.findByEmail(createUserDto.email)
      if(usuarioexistente){
        throw new ConflictException(`El correo ${createUserDto.email} ya está en uso`);
      }
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const organizadorUser = {
        ...createUserDto,
        role: 'organizador',
      };
      return await this.userRepository.save(organizadorUser);
    }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id })
    if(!user){
      throw new NotFoundException(`Usuario no encontrado`);
    }
    return user ;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });

  }
  async update(id: number, updateUserDto: UpdateUserDto) {
      console.log("datos", updateUserDto);
    await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }
}
