import { DataSource } from "typeorm";
import { Contact } from "../models/contact.model";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "express_typeorm",
  entities: [Contact],
  subscribers: [],
  migrations: [],
  logging: false,
  synchronize: true,
});
