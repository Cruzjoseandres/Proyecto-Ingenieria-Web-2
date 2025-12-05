import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLugarDto } from './dto/create-lugar.dto';
import { UpdateLugarDto } from './dto/update-lugar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lugar } from './entities/lugar.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { OrganizadorInfoDto } from '../auth/dto/organizadorInfo.dto';


@Injectable()
export class LugarService {
  constructor(
    @InjectRepository(Lugar)
    private readonly lugarRepository: Repository<Lugar>,
    private readonly userService: UserService ,
  ) {}

  async create(createLugarDto: CreateLugarDto, image?: Express.Multer.File, req?: {user: OrganizadorInfoDto}) {
    if(!image){
      throw new NotFoundException('La imagen es obligatoria y debe ser un archivo de imagen válido (jpg, jpeg, png, gif, webp, bmp, svg)');
    }
    if(!req){
      throw new NotFoundException('Usuario no autenticado');
    }

    const organizador = await this.userService.findOne(req.user.id);
    if (!organizador) {
      throw new NotFoundException('Organizador no encontrado');
    }

    const datosOrganizador = {
      id: organizador.id,
      fullName: organizador.fullName
    }

    const lugar = {
      titulo: createLugarDto.titulo,
      descripcion: createLugarDto.descripcion,
      fecha: createLugarDto.fecha,
      precio: Number(createLugarDto.precio),
      maxPersonas: Number(createLugarDto.maxPersonas),
      latitude: createLugarDto.latitude,
      longitude: createLugarDto.longitude,
      imagePath: `http://localhost:3000/uploads/${image.filename}`,
      organizador: datosOrganizador,
    }

    const lugarCreado = await this.lugarRepository.save(lugar);

    return {
      id: lugarCreado.id,
      titulo: lugarCreado.titulo,
      descripcion: lugarCreado.descripcion,
      fecha: lugarCreado.fecha,
      precio: lugarCreado.precio,
      maxPersonas: lugarCreado.maxPersonas,
      latitude: lugarCreado.latitude,
      longitude: lugarCreado.longitude,
      imagePath: lugarCreado.imagePath,
      organizador: {
        id: lugarCreado.organizador.id,
        fullName: lugarCreado.organizador.fullName
      }
    };
  }

  async findAll() {
    const lugares = await this.lugarRepository.find({
      relations: ['organizador']
    });

    return lugares.map(lugar => ({
      ...lugar,
      organizador: {
        id: lugar.organizador.id,
        fullName: lugar.organizador.fullName
      }
    }));
  }

  async findOne(id: number) {
    const lugar = await this.lugarRepository.findOne({
      where: { id },
      relations: ['organizador']
    });
    if (!lugar) {
      throw new NotFoundException(`Lugar con ID ${id} no encontrado`);
    }
    return lugar;
  }

   async update(id: number, updateLugarDto: UpdateLugarDto, image?: Express.Multer.File,req? : {user: OrganizadorInfoDto}) {
    if(!req){
       throw new NotFoundException('Usuario no autenticado');
     }

    const organizador = await this.userService.findOne(req.user.id);
     if (!organizador) {
       throw new NotFoundException('Organizador no encontrado');
     }
     const verificarLugar = await this.findOne(id);
     if(verificarLugar.organizador.id !== organizador.id){
       throw new NotFoundException('No tienes permiso para actualizar este lugar');
     }

     const datosOrganizador = {
       id: organizador.id,
       fullName: organizador.fullName
     }

     const lugar = {
       titulo: updateLugarDto.titulo,
        descripcion: updateLugarDto.descripcion,
        fecha: updateLugarDto.fecha,
        precio: Number(updateLugarDto.precio),
        maxPersonas: Number(updateLugarDto.maxPersonas),
        latitude: updateLugarDto.latitude,
        longitude: updateLugarDto.longitude,
        organizador: datosOrganizador,
     };

     if(image){
       lugar['imagePath'] = `http://localhost:3000/uploads/${image.filename}`;
     }

     await this.lugarRepository.update(id, lugar);
     const lugarActualizado = await this.findOne(id);
     return {
       id: lugarActualizado.id,
       titulo: lugarActualizado.titulo,
       descripcion: lugarActualizado.descripcion,
       fecha: lugarActualizado.fecha,
       precio: lugarActualizado.precio,
       maxPersonas: lugarActualizado.maxPersonas,
       latitude: lugarActualizado.latitude,
       longitude: lugarActualizado.longitude,
       imagePath: lugarActualizado.imagePath,
       organizador: {
         id: lugarActualizado.organizador.id,
         fullName: lugarActualizado.organizador.fullName
       }
     };
   }

  async remove(id: number, req? : {user: OrganizadorInfoDto}) {
    if(!req){
       throw new NotFoundException('Usuario no autenticado');
     }

    const organizador = await this.userService.findOne(req.user.id);
     if (!organizador) {
       throw new NotFoundException('Organizador no encontrado');
     }
     const verificarLugar = await this.findOne(id);
     if(verificarLugar.organizador.id !== organizador.id){
       throw new NotFoundException('No tienes permiso para eliminar este lugar');
     }
    await this.findOne(id);
    await this.lugarRepository.delete(id);
    return { message: `Lugar con ID ${id} eliminado correctamente` };
  }
}
