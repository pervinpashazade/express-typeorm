import { DataSource } from "typeorm";
import { Contact } from "../models/contact.model";
import { Person } from "../models/person.model";
import { Car } from "../models/car.model";
import { Photo } from "../models/photo.model";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "shop",
  // entities: [Contact, Person, Car, Photo],
  entities: ["src/DAL/models/*{.ts,.js}"],
  subscribers: [],
  migrations: [],
  logging: false,
  synchronize: true,
});
