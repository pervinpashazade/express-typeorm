import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Person } from "./person.model";

@Entity({ name: "photos" })
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Person, (person) => person.photos)
  @JoinColumn({ name: "person_id" })
  person: Person;
}
