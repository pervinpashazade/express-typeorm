import express, { NextFunction, Request, Response } from "express";
import { v1Routes } from "./routes";
import "reflect-metadata";
import { AppDataSource } from "./DAL/config/data-source";
import { Contact } from "./DAL/models/contact.model";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    const app = express();

    app.use(express.json());

    app.use("/api/v1", v1Routes);

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(error);
      res.status(500).json({ error });
    });

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Error connecting to database", error);
  });
