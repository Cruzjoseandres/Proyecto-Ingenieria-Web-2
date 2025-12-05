import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { OrganizadorGuard } from './organizador.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard, OrganizadorGuard],
  exports: [AuthService, AuthGuard, AdminGuard, OrganizadorGuard],
})
export class AuthModule {}
