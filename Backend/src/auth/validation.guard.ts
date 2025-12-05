import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserInfoDto } from './dto/userinfo.dto';

interface RequestWithUser extends Request {
  user: UserInfoDto;
}

@Injectable()
export class ValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const resourceId = parseInt(request.params.id, 10);

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado.');
    }

    const isAdmin = user.role === 'admin';
    const isOwner = user.id === resourceId;

    if (isAdmin || isOwner) {
      return true;
    }

    throw new ForbiddenException('No tienes permiso para realizar esta acción sobre este recurso.');
  }
}
