import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Wishlist } from "./wishlist.model";

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.products)
  @JoinColumn({ name: "wishlist_id" })
  wishlist: Wishlist;
}
