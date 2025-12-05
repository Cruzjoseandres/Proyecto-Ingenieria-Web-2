import { Module, forwardRef } from '@nestjs/common';
import { LugarService } from './lugar.service';
import { LugarController } from './lugar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lugar } from './entities/lugar.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lugar]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req: Request, file: Express.Multer.File, callback) => {
          console.log('Entró a filename');
          const timestamp = Date.now();
          const randomSuffix = Math.round(Math.random() * 1E9);
          const extension = file.originalname.split('.').pop()?.toLowerCase();

          // Extensiones de imagen permitidas
          const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

          if (!extension || !allowedExtensions.includes(extension)) {
            return callback(
              new Error(`Solo se permiten archivos de imagen: ${allowedExtensions.join(', ')}`),
              ''
            );
          }

          const filename = `lugar_${timestamp}_${randomSuffix}.${extension}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req: Request, file: Express.Multer.File, callback) => {
        // Validación adicional por MIME type
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/bmp',
          'image/svg+xml'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Solo se permiten archivos de imagen'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  ],
  controllers: [LugarController],
  providers: [LugarService],
  exports: [LugarService],
})
export class LugarModule {}
