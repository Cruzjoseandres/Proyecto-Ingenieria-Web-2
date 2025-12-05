import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Lugar } from '../lugar/entities/lugar.entity';


  export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Lugar, Inscripcion],

  synchronize: true,
};