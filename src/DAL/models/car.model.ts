import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Person } from "./person.model";

@Entity({ name: "cars" })
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  // ...

  @OneToOne(() => Person, { cascade: true })
  @JoinColumn({ name: "person_id" })
  person: Person;
}
