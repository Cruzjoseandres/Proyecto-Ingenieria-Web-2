import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lugar} from '../../lugar/entities/lugar.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Inscripcion {
@PrimaryGeneratedColumn()
  id: number;
@Column({default: false})
  estado:boolean;
@Column({unique: true, nullable: true})
  qrToken:string;
@Column({nullable: true})
  comprobantePago:string;
@Column({default: false})
  ingresado:boolean;
@Column({nullable: true})
  fechaIngreso:string;
@Column({default: false})
  comprobantePagoVerificado:boolean;

//Muchas Inscripciones -> Pertenecen a Un Usuario
  @ManyToOne(() => User, (user) => user.inscripcions)
  @JoinColumn()
  user: User;

  //Muchas Inscripciones -> Pertenecen a Un Evento
  @ManyToOne(() => Lugar, (lugar) => lugar.inscripcions)
  @JoinColumn()
  lugar: Lugar;
}
