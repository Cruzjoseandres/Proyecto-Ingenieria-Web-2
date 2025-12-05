import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { Lugar } from '../lugar/entities/lugar.entity';

// Detectamos si estamos en producción (Render) buscando la variable de la base de datos
const isProduction = !!process.env.DATABASE_URL;

export const typeOrmConfig: TypeOrmModuleOptions = {
    // Cambia dinámicamente el tipo de base de datos
    type: isProduction ? 'postgres' : 'sqlite',

    // Si es Postgres, usa la URL de Render. Si es Sqlite, undefined.
    url: isProduction ? process.env.DATABASE_URL : undefined,

    // Si es Sqlite, usa el archivo local. Si es Postgres, undefined.
    database: isProduction ? undefined : 'database.sqlite',

    entities: [User, Lugar, Inscripcion],

    // En la feria esto es vital: TRUE para que cree las tablas automáticamente
    synchronize: true,

    // Configuración SSL requerida por Render (Postgres)
    ssl: isProduction ? { rejectUnauthorized: false } : false,
}as TypeOrmModuleOptions;