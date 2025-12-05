import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserInfoDto } from './dto/userinfo.dto';

interface RequestWithUser extends Request {
  user: UserInfoDto;
}

@Injectable()
export class OrganizadorGuard implements CanActivate {

   canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

     if (user.role === 'organizador') {
       return true;
     }
    throw new ForbiddenException('Solo los organizadores pueden realizar esta acción.');
  }
}
