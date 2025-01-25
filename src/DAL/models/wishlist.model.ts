import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./product.model";
import { Person } from "./person.model";

@Entity({ name: "wishlists" })
export class Wishlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @OneToMany(() => Product, (product) => product.wishlist)
  products: Product[];
}
