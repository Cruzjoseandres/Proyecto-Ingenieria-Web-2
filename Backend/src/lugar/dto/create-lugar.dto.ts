import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLugarDto {
  @IsString({message: 'El titulo debe ser una cadena de texto'})
  @IsNotEmpty({message: 'El titulo no debe estar vacio'})
  titulo: string;

  @IsString({message: 'La descripcion debe ser una cadena de texto'})
  @IsNotEmpty({message: 'La descripcion no debe estar vacia'})
  descripcion: string;

  @IsString({message: 'La fecha debe ser una cadena de texto'})
  @IsNotEmpty({message: 'La fecha no debe estar vacia'})
  fecha: string;

  @IsString({message: 'El precio debe ser una cadena de texto'})
  @IsNotEmpty({message: 'El precio no debe estar vacio'})
  precio: string;

  @IsString({message: 'El maximo de personas debe ser un texto'})
  @IsNotEmpty({message: 'El maximo de personas no debe estar vacio'})
  maxPersonas: string;

  @IsNotEmpty({message: 'La latitud no debe estar vacia'})
  @IsString({message: 'La latitud debe ser una cadena de texto'})
  latitude: string;

  @IsNotEmpty({message: 'La longitud no debe estar vacia'})
  @IsString({message: 'La longitud debe ser una cadena de texto'})
  longitude: string;
}
