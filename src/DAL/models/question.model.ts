import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from "typeorm";
import { Category } from "./category.model";

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Category, (category) => category.questions)
  @JoinTable({
    name: "questions_categories",
    joinColumn: { name: "question_id" },
    inverseJoinColumn: { name: "category_id" },
  })
  categories: Category[];
}
