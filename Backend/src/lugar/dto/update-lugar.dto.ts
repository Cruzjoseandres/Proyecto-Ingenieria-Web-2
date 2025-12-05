import { IsOptional, IsString } from 'class-validator';

export class UpdateLugarDto {
  @IsOptional()
  @IsString({message: 'El titulo debe ser una cadena de texto'})
  titulo?: string;

  @IsOptional()
  @IsString({message: 'La descripcion debe ser una cadena de texto'})
  descripcion?: string;

  @IsOptional()
  @IsString({message: 'La fecha debe ser una cadena de texto'})
  fecha?: string;

  @IsOptional()
  @IsString({message: 'El precio debe ser una cadena de texto'})
  precio?: string;

  @IsOptional()
  @IsString({message: 'El maximo de personas debe ser un texto'})
  maxPersonas?: string;

  @IsOptional()
  @IsString({message: 'La latitud debe ser una cadena de texto'})
  latitude?: string;

  @IsOptional()
  @IsString({message: 'La longitud debe ser una cadena de texto'})
  longitude?: string;
}
