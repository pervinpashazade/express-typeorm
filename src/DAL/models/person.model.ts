import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Car } from "./car.model";
import { Photo } from "./photo.model";
import { Wishlist } from "./wishlist.model";
import { Product } from "./product.model";

@Entity({ name: "persons" })
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  fullname: string;

  @OneToOne(() => Car, { onDelete: "CASCADE" })
  @JoinColumn()
  car: Car;

  @OneToMany(() => Photo, (photo) => photo.person)
  photos: Photo[];

  @OneToOne(() => Wishlist, { onDelete: "CASCADE" })
  @JoinColumn()
  wishlist: Wishlist;

  @OneToMany(() => Product, (product) => product.wishlist)
  favorities: Product[];
}
