import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard} from '../auth/auth.guard';
import { ValidationGuard } from '../auth/validation.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('validator')
  @UseGuards(AuthGuard, AdminGuard)
  createValidator(@Body() createUserDto: CreateUserDto) {
    return this.userService.createValidator(createUserDto);
  }

  @Post('organizador')
  @UseGuards(AuthGuard, AdminGuard)
  createOrganizador(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOrganizador(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @UseGuards(AuthGuard,ValidationGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard,ValidationGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
