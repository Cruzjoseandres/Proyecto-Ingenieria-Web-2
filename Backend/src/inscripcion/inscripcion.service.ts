import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { LugarService } from '../lugar/lugar.service';
import { UserService } from '../user/user.service';
import { UserInfoDto } from '../auth/dto/userinfo.dto';
import * as crypto from 'crypto';
import { ValidateQrResponseDto } from './dto/validate-qr-response.dto';


@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly lugarService: LugarService,
    private readonly userService: UserService,
  ) {}

  async create(id:number, user: UserInfoDto) {
    const lugar = await this.lugarService.findOne(id);
    if (!lugar) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Verificar si ya está inscrito
    const existingInscripcion = await this.inscripcionRepository.findOne({
      where: {
        user: { id: user.id },
        lugar: { id }
      }
    });

    if (existingInscripcion) {
      throw new BadRequestException('Ya estás inscrito en este evento');
    }

    // Verificar capacidad máxima
    const inscripciones = await this.inscripcionRepository.count({
      where: { lugar: { id} }
    });

    if (inscripciones >= lugar.maxPersonas) {
      throw new BadRequestException('El evento ha alcanzado su capacidad máxima');
    }

    const userData = await this.userService.findOne(user.id);

    // Para eventos gratuitos, se genera el QR inmediatamente
    const qrToken = lugar.precio === 0 ? crypto.randomBytes(32).toString('hex') : undefined;

    const inscripcion = this.inscripcionRepository.create({
      qrToken: qrToken || undefined,
      user: userData,
      lugar: lugar,
      estado: lugar.precio === 0,
      comprobantePagoVerificado: lugar.precio === 0,
    });

    const inscripcionGuardada = await this.inscripcionRepository.save(inscripcion);

    return {
      id: inscripcionGuardada.id,
      qrToken: inscripcionGuardada.qrToken || null,
      qrUrl: inscripcionGuardada.qrToken ? `http://localhost:3000/inscripcion/validar-qr/${inscripcionGuardada.qrToken}` : null,
      estado: inscripcionGuardada.estado,
      requierePago: lugar.precio > 0,
      mensaje: lugar.precio > 0
        ? 'Inscripción creada. Por favor sube el comprobante de pago para completar el proceso.'
        : 'Inscripción completada. Puedes usar tu QR para ingresar al evento.',
      evento: {
        id: lugar.id,
        titulo: lugar.titulo,
        fecha: lugar.fecha,
        precio: lugar.precio,
      }
    };
  }

  async findByUser(userId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: { user: { id: userId } },
      relations: ['lugar'],
    });

    return inscripciones.map(inscripcion => {
      let estadoMensaje = 'Pendiente';
      if (inscripcion.comprobantePago && !inscripcion.comprobantePagoVerificado) {
        estadoMensaje = 'Comprobante en revisión';
      } else if (inscripcion.comprobantePagoVerificado && inscripcion.estado) {
        estadoMensaje = 'Aprobado';
      } else if (inscripcion.comprobantePago === null && inscripcion.lugar.precio > 0) {
        estadoMensaje = 'Comprobante rechazado - Intenta nuevamente';
      }

      return {
        id: inscripcion.id,
        qrToken: inscripcion.qrToken,
        qrUrl: inscripcion.qrToken ? `http://localhost:3000/inscripcion/validar-qr/${inscripcion.qrToken}` : null,
        estado: inscripcion.estado,
        estadoMensaje,
        comprobantePago: inscripcion.comprobantePago,
        comprobantePagoVerificado: inscripcion.comprobantePagoVerificado,
        ingresado: inscripcion.ingresado,
        fechaIngreso: inscripcion.fechaIngreso,
        evento: {
          id: inscripcion.lugar.id,
          titulo: inscripcion.lugar.titulo,
          fecha: inscripcion.lugar.fecha,
          precio: inscripcion.lugar.precio,
          imagePath: inscripcion.lugar.imagePath,
        }
      };
    });
  }

  async findOne(inscripcionId: number, userId: number) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: inscripcionId, user: { id: userId } },
      relations: ['lugar'],
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return {
      id: inscripcion.id,
      qrToken: inscripcion.qrToken,
      qrUrl: `http://localhost:3000/inscripcion/validar-qr/${inscripcion.qrToken}`,
      estado: inscripcion.estado,
      comprobantePago: inscripcion.comprobantePago,
      comprobantePagoVerificado: inscripcion.comprobantePagoVerificado,
      ingresado: inscripcion.ingresado,
      fechaIngreso: inscripcion.fechaIngreso,
      evento: {
        id: inscripcion.lugar.id,
        titulo: inscripcion.lugar.titulo,
        descripcion: inscripcion.lugar.descripcion,
        fecha: inscripcion.lugar.fecha,
        precio: inscripcion.lugar.precio,
        imagePath: inscripcion.lugar.imagePath,
      }
    };
  }

  async subirComprobante(idLugar: number, userId: number, comprobante: Express.Multer.File) {
    if (!comprobante) {
      throw new BadRequestException('El comprobante es obligatorio');
    }

    const inscripcion = await this.inscripcionRepository.findOne({
      where: {
        user: { id: userId },
        lugar: { id: idLugar }
      },
      relations: ['user', 'lugar'],
    });

    if (!inscripcion) {
      throw new NotFoundException('No estás inscrito en este evento');
    }

    if (inscripcion.comprobantePagoVerificado) {
      throw new BadRequestException('Tu comprobante ya ha sido verificado');
    }

    inscripcion.comprobantePago = `http://localhost:3000/inscripcion/comprobante/${comprobante.filename}`;
    await this.inscripcionRepository.save(inscripcion);

    return {
      message: 'Comprobante subido correctamente. Espera la verificación del administrador.',
      comprobantePago: inscripcion.comprobantePago,
    };
  }

  async cancelarInscripcion(inscripcionId: number, userId: number) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: inscripcionId },
      relations: ['user', 'lugar'],
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    if (inscripcion.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta inscripción');
    }

    // Verificar si el evento ya pasó
    const fechaEvento = new Date(inscripcion.lugar.fecha);
    const ahora = new Date();

    if (fechaEvento < ahora) {
      throw new BadRequestException('No puedes cancelar una inscripción de un evento que ya pasó');
    }

    // Verificar si ya se realizó un pago
    if (inscripcion.comprobantePagoVerificado) {
      throw new BadRequestException('No puedes cancelar una inscripción con pago verificado');
    }

    await this.inscripcionRepository.remove(inscripcion);

    return {
      message: 'Inscripción cancelada correctamente',
    };
  }

  async validarQr(qrToken: string): Promise<ValidateQrResponseDto> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { qrToken },
      relations: ['user', 'lugar'],
    });

    if (!inscripcion) {
      return {
        valid: false,
        message: 'QR inválido',
        estado: 'invalido',
      };
    }

    if (!inscripcion.estado || !inscripcion.comprobantePagoVerificado) {
      return {
        valid: false,
        message: 'Inscripción no confirmada o pago no verificado',
        estado: 'no_confirmado',
        participante: {
          fullName: inscripcion.user.fullName,
          email: inscripcion.user.email,
        },
        evento: {
          titulo: inscripcion.lugar.titulo,
          fecha: inscripcion.lugar.fecha,
        }
      };
    }

    if (inscripcion.ingresado) {
      return {
        valid: false,
        message: 'El participante ya ingresó al evento',
        estado: 'ya_ingresado',
        participante: {
          fullName: inscripcion.user.fullName,
          email: inscripcion.user.email,
        },
        evento: {
          titulo: inscripcion.lugar.titulo,
          fecha: inscripcion.lugar.fecha,
        },
        fechaIngreso: inscripcion.fechaIngreso,
      };
    }

    // Marcar como ingresado
    inscripcion.ingresado = true;
    inscripcion.fechaIngreso = new Date().toISOString();
    await this.inscripcionRepository.save(inscripcion);

    return {
      valid: true,
      message: 'Ingreso válido y registrado',
      estado: 'valido',
      participante: {
        fullName: inscripcion.user.fullName,
        email: inscripcion.user.email,
      },
      evento: {
        titulo: inscripcion.lugar.titulo,
        fecha: inscripcion.lugar.fecha,
      },
      fechaIngreso: inscripcion.fechaIngreso,
    };
  }

  async verificarComprobante(inscripcionId: number, aprobar: boolean) {
    let inscripcion = await this.inscripcionRepository.findOne({
      where: { id: inscripcionId },
      relations: ['user', 'lugar'],
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    if (!inscripcion.comprobantePago) {
      throw new BadRequestException('No hay comprobante de pago para verificar');
    }

    if (aprobar) {
      // Generar QR token cuando se aprueba
      inscripcion.qrToken = crypto.randomBytes(32).toString('hex');
      inscripcion.comprobantePagoVerificado = true;
      inscripcion.estado = true;
      await this.inscripcionRepository.save(inscripcion);
    } else {
      // Si se rechaza, limpiar el comprobante para que pueda subir uno nuevo
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      await this.inscripcionRepository.update(inscripcion.id, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        comprobantePago: null as any,
        comprobantePagoVerificado: false,
        estado: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        qrToken: null as any,
      });
      // Recargar la inscripción actualizada
      const inscripcionActualizada = await this.inscripcionRepository.findOne({
        where: { id: inscripcionId },
        relations: ['user', 'lugar'],
      });
      if (inscripcionActualizada) {
        inscripcion = inscripcionActualizada;
      }
    }

    return {
      message: aprobar
        ? 'Comprobante verificado correctamente. QR generado.'
        : 'Comprobante rechazado. El usuario puede intentar subir un nuevo comprobante.',
      inscripcion: {
        id: inscripcion.id,
        estado: inscripcion.estado,
        comprobantePagoVerificado: inscripcion.comprobantePagoVerificado,
        qrToken: inscripcion.qrToken,
        qrUrl: inscripcion.qrToken ? `http://localhost:3000/inscripcion/validar-qr/${inscripcion.qrToken}` : null,
        participante: {
          fullName: inscripcion.user.fullName,
          email: inscripcion.user.email,
        },
        evento: {
          titulo: inscripcion.lugar.titulo,
        }
      }
    };
  }

  async findPendientesVerificacion() {
    const inscripciones = await this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.user', 'user')
      .leftJoinAndSelect('inscripcion.lugar', 'lugar')
      .where('inscripcion.comprobantePago IS NOT NULL')
      .andWhere('inscripcion.comprobantePagoVerificado = :verificado', { verificado: false })
      .getMany();

    return inscripciones.map(inscripcion => ({
      id: inscripcion.id,
      comprobantePago: inscripcion.comprobantePago,
      participante: {
        fullName: inscripcion.user.fullName,
        email: inscripcion.user.email,
      },
      evento: {
        titulo: inscripcion.lugar.titulo,
        fecha: inscripcion.lugar.fecha,
      }
    }));
  }

  async findByEvento(eventoId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: { lugar: { id: eventoId }, estado: true },
      relations: ['user'],
    });

    return inscripciones.map(inscripcion => ({
      id: inscripcion.id,
      estado: inscripcion.estado,
      comprobantePagoVerificado: inscripcion.comprobantePagoVerificado,
      ingresado: inscripcion.ingresado,
      fechaIngreso: inscripcion.fechaIngreso,
      participante: {
        fullName: inscripcion.user.fullName,
        email: inscripcion.user.email,
      }
    }));
  }


  async getComprobantesByEventoVerificar(eventoId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: {
        lugar: { id: eventoId },
        comprobantePago: Not(IsNull()),
        comprobantePagoVerificado: false,
      },
      relations: ['user'],
    });

    return inscripciones.map(inscripcion => ({
      id: inscripcion.id,
      comprobantePago: inscripcion.comprobantePago,
      participante: {
        fullName: inscripcion.user.fullName,
        email: inscripcion.user.email,
      }
    }));
  }
}
