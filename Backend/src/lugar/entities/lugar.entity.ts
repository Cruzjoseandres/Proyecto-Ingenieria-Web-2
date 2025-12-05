import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';

@Entity()
export class Lugar {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  titulo:string;
  @Column()
  descripcion:string;
  @Column()
  fecha:string;
  @Column()
  precio:number;
  @Column()
  imagePath:string;
  @Column()
  maxPersonas:number;
  @Column()
  latitude:string;
  @Column()
  longitude:string;

  // Muchos Lugares -> Pertenecen a Un Usuario (Organizador)
  @ManyToOne(() => User, (user) => user.lugares)
  organizador: User;

  // Un Evento -> Tiene Muchas Inscripciones
  @OneToMany(() => Inscripcion, (incripcion) => incripcion.lugar)
  inscripcions: Inscripcion[];

}
