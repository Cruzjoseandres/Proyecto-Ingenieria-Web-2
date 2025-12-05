import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
  Patch,
} from '@nestjs/common';
import type { Response } from 'express';
import { InscripcionService } from './inscripcion.service';
import { AuthGuard } from '../auth/auth.guard';
import { ValidadorGuard } from '../auth/validador.guard';
import { UserInfoDto } from '../auth/dto/userinfo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {OrganizadorGuard} from "../auth/organizador.guard";

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  // Crear inscripción (requiere autenticación)
  @UseGuards(AuthGuard)
  @Post('/:lugarId')
  create( @Param('lugarId') id: number,@Req() req: { user: UserInfoDto }) {
    return this.inscripcionService.create(id , req.user);
  }

  // Obtener inscripciones del usuario autenticado
  @UseGuards(AuthGuard)
  @Get('mis-inscripciones')
  findByUser(@Req() req: { user: UserInfoDto }) {
    return this.inscripcionService.findByUser(req.user.id);
  }

  // Obtener detalle de una inscripción específica
  @UseGuards(AuthGuard)
  @Get('detalle/:id')
  findOne(@Param('id') id: string, @Req() req: { user: UserInfoDto }) {
    return this.inscripcionService.findOne(+id, req.user.id);
  }

  // Subir comprobante de pago (id es el ID del lugar/evento)
  @UseGuards(AuthGuard)
  @Post('lugar/:lugarId/comprobante')
  @UseInterceptors(FileInterceptor('comprobante'))
  subirComprobante(
    @Param('lugarId') lugarId: string,
    @Req() req: { user: UserInfoDto },
    @UploadedFile() comprobante: Express.Multer.File
  ) {
    return this.inscripcionService.subirComprobante(+lugarId, req.user.id, comprobante);
  }

  // Ver imagen del comprobante
  @Get('comprobante/:filename')
  getComprobante(@Param('filename') filename: string, @Res() res: Response) {
    const path = `./uploads/${filename}`;
    return res.sendFile(path, { root: '.' });
  }

  // Cancelar inscripción
  @UseGuards(AuthGuard)
  @Delete(':id')
  cancelarInscripcion(@Param('id') id: string, @Req() req: { user: UserInfoDto }) {
    return this.inscripcionService.cancelarInscripcion(+id, req.user.id);
  }

  // Validar QR
  @UseGuards(AuthGuard, ValidadorGuard)
  @Get('validar-qr/:token')
  validarQr(@Param('token') token: string) {
    return this.inscripcionService.validarQr(token);
  }
  
  @UseGuards(AuthGuard, OrganizadorGuard)
  @Patch(':id/verificar-comprobante')
  verificarComprobante(@Param('id') id: number, @Body('aprobar') aprobar: boolean) {
    return this.inscripcionService.verificarComprobante(id, aprobar);
  }

  // Obtener inscripciones pendientes de verificación
  @UseGuards(AuthGuard, OrganizadorGuard)
  @Get('pendientes-verificacion')
  findPendientesVerificacion() {
    return this.inscripcionService.findPendientesVerificacion();
  }

  // Obtener inscripciones de un evento específico
  @UseGuards(AuthGuard, OrganizadorGuard)
  @Get('evento/:eventoId')
  findByEvento(@Param('eventoId') eventoId: number) {
    return this.inscripcionService.findByEvento(eventoId);
  }

  @UseGuards(AuthGuard, OrganizadorGuard)
    @Get('comprobantesVerificar/evento/:eventoId')
    getComprobantesByEvento(@Param('eventoId') eventoId: number) {
      return this.inscripcionService.getComprobantesByEventoVerificar(eventoId);
  }

}
