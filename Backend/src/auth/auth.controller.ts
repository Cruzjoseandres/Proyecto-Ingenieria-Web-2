import { Body, Controller, Get, Post, Req, Request, UseGuards } from "@nestjs/common";
import { UserLoginDto } from "./dto/user-login.dto";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserRegisterResponseDto } from "./dto/register-response.dto";
import { UserInfoDto } from "./dto/userinfo.dto";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  login(@Body() body: UserLoginDto): Promise<any> {
    return this.authService.login(body);
  }
  @Post("register")
  register(@Body() body: UserRegisterDto): Promise<UserRegisterResponseDto> {
    return this.authService.register(body);
  }
  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() request: Request): Promise<UserInfoDto> {
    const loggedInUser = request["user"] as UserInfoDto;
    return this.authService.getUserById(loggedInUser.id);
  }
}
