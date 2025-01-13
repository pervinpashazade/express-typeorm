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
      // data.created_at = new Date();
      // data.updated_at = new Date();

      await AppDataSource.getRepository(Contact)
        .save(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.json({ error: error.message });
        });

      // await Contact.create({
      //   name,
      //   surname,
      //   email,
      //   inquiryType,
      //   companyName,
      //   message,
      // }).save()
      //   .then((result) => {
      //     res.json(result);
      //   })
      //   .catch((error) => {
      //     res.json({ error: error.message });
      //   });
      // })
    });

    app.get("/contact", async (req, res) => {
      // const list = await AppDataSource.getRepository(Contact).find({
      //   where: {
      //     id: 4,
      //     email: "tet@te.as",
      //   },
      // }); // [ ]
      // res.json(list);

      // const contactItem = await AppDataSource.getRepository(Contact).findOne({
      //   where: { email: "tet@te.as" },
      // });
      // res.json(contactItem);

      // const list2 = await AppDataSource.manager.find(Contact, {
      //   where: {
      //     id: 4,
      //     email: "tet@te.as",
      //   },
      // });
      // res.json(list2);

      // const contactCount = await AppDataSource.getRepository(Contact).countBy({
      //   email: "tet@te.as",
      // });
      // console.log("contactCount", contactCount);

      // res.json(contactCount);

      const list = await Contact.find({
        withDeleted: true,
      });
      res.json(list);
    });

    app.put("/contact/:id", async (req, res, next) => {
      const id = req.params.id;
      if (!id) return next(new Error("Id is required"));

      const { name, surname, email, inquiryType, companyName, message } =
        req.body;

      const data = await Contact.findOne({
        where: { id: +id },
      });
      if (!data) return next(new Error("Contact not found"));

      // data.name = name;
      // data.surname = surname;
      // data.email = email;
      // data.companyName = companyName;
      // data.inquiryType = inquiryType;
      // data.message = message;

      // const updatedData = await Contact.save(data);

      // res.json({
      //   message: "Contact updated successfully",
      //   data: updatedData,
      // });

      const updatedData = await Contact.update(2, {
        name,
        surname,
      });
      res.json(updatedData);
    });

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.error("Error connecting to database", error);
  });
