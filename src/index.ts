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

    app.post("/contact", async (req, res) => {
      // validate body

      const { name, surname, email, inquiryType, companyName, message } =
        req.body;

      const data = new Contact();
      data.name = name;
      data.surname = surname;
      data.email = email;
      data.companyName = companyName;
      data.inquiryType = inquiryType;
      data.message = message;
      data.created_at = new Date();
      data.updated_at = new Date();

      await AppDataSource.getRepository(Contact)
        .save(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.json({ error: error.message });
        });
    });

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Error connecting to database", error);
  });
