import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { LugarService } from './lugar.service';
import { CreateLugarDto } from './dto/create-lugar.dto';
import { UpdateLugarDto } from './dto/update-lugar.dto';
import { AuthGuard } from '../auth/auth.guard';
import { OrganizadorGuard } from '../auth/organizador.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizadorInfoDto } from '../auth/dto/organizadorInfo.dto';

@Controller('lugar')
export class LugarController {
  constructor(private readonly lugarService: LugarService) {}

  @UseGuards(AuthGuard, OrganizadorGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(@Body() createLugarDto: CreateLugarDto, @UploadedFile() image: Express.Multer.File, @Req() req: {user: OrganizadorInfoDto}) {
    return this.lugarService.create(createLugarDto, image, req);
  }

  @Get()
  findAll() {
    return this.lugarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lugarService.findOne(+id);
  }

  @Get('image/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const path = `./uploads/${filename}`;
    return res.sendFile(path, { root: '.' });
  }

   @UseGuards(AuthGuard, OrganizadorGuard)
   @Patch(':id')
   @UseInterceptors(FileInterceptor("image"))
   update(@Param('id') id: number, @Body() updateLugarDto: UpdateLugarDto,@UploadedFile() image: Express.Multer.File, @Req() req: {user: OrganizadorInfoDto}) {
    console.log(updateLugarDto);
    return this.lugarService.update(id, updateLugarDto, image, req);
   }

  @UseGuards(AuthGuard, OrganizadorGuard)
  @Delete(':id')
  remove(@Param('id') id: number,@Req() req: {user: OrganizadorInfoDto}) {
    return this.lugarService.remove(id, req);
  }
}
