import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { JwtService } from "@nestjs/jwt";
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserRegisterResponseDto } from './dto/register-response.dto';
import { UserInfoDto } from './dto/userinfo.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(body: UserLoginDto): Promise<any> {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const hashedPassword = await bcrypt.compare(body.password, user.password);
    if (!hashedPassword) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email, rol: user.role  };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }


  async register(body: UserRegisterDto): Promise<UserRegisterResponseDto> {
    const newUser = await this.usersService.create(body);
    return { id: newUser.id, email: newUser.email, fullName: newUser.fullName, role: newUser.role } as UserRegisterResponseDto;
  }


  async getUserById(id: number): Promise<UserInfoDto> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    } as UserInfoDto;
  }
}
