import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {Lugar} from '../../lugar/entities/lugar.entity';
import {Inscripcion} from '../../inscripcion/entities/inscripcion.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number;
  @Column({ unique: true })
  email:string;
  @Column()
  password:string;
  @Column()
  fullName:string;
  @Column({ default: 'user' })
  role:string;

  //Un Usuario (Organizador) -> Muchos Lugares♦
  @OneToMany(() => Lugar, (lugar) => lugar.organizador)
  lugares: Lugar[];

  //Un Usuario (Participante) -> Muchas Inscripciones
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.user)
  inscripcions: Inscripcion[];
}
