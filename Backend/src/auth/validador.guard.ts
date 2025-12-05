import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserInfoDto } from './dto/userinfo.dto';

interface RequestWithUser extends Request {
  user: UserInfoDto;
}

@Injectable()
export class ValidadorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (user.role === 'validador') {
      return true;
    }
    throw new ForbiddenException('Solo los validadores pueden realizar esta acción.');
  }
}

