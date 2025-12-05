import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IsJsonValidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: 'El cuerpo de la solicitud no es válido' });
    }
    next();
  }
}