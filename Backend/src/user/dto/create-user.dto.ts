import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsEmail()
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre completo debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;
}

