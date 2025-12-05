import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsString({ message: 'El email de usuario debe ser un texto' })
  @IsNotEmpty({ message: 'El email de usuario es obligatorio' })
  @IsEmail()
  readonly email: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre completo debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;
}
