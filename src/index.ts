import express, { NextFunction, Request, Response } from "express";
import { v1Routes } from "./routes";
import "reflect-metadata";
import { AppDataSource } from "./DAL/config/data-source";
import { Contact } from "./DAL/models/contact.model";
import { Person } from "./DAL/models/person.model";
import { Car } from "./DAL/models/car.model";
import { Category } from "./DAL/models/category.model";
import { Question } from "./DAL/models/question.model";
import { In, Not } from "typeorm";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    const app = express();

    app.use(express.json());

    app.use("/api/v1", v1Routes);

    // /api/v1/cars/create

    app.post("/api/v1/create-person", async (req: Request, res: Response) => {
      const newCar = new Car();
      newCar.model = req.body.model;

      await Car.save(newCar);

      const newPerson = new Person();
      newPerson.fullname = req.body.fullname;
      newPerson.car = newCar;

      await Person.save(newPerson);

      res.json({
        newCar,
        newPerson,
      });
    });

    app.get("/api/v1/persons/:id", async (req: Request, res: Response) => {
      const person = await Person.findOne({
        where: {
          id: +req.params.id,
        },
        relations: [
          "car",
          "photos",
          "wishlist",
          "wishlist.products",
          "favorities",
        ],
        // relations: {
        //   car: true,
        //   photos: true,
        //   wishlist: {
        //     products: {},
        //   },
        //   favorities: true,
        // },
      });

      res.json(person);
    });

    app.get("/api/v1/cars", async (req: Request, res: Response) => {
      const carList = await Car.find({
        relations: {
          person: true,
        },
      });

      res.json(carList);
    });

    app.post("/api/v1/create-category", async (req: Request, res: Response) => {
      const newCategory = new Category();
      newCategory.name = req.body.name;

      await Category.save(newCategory);

      res.json(newCategory);
    });

    app.get("/api/v1/category/list", async (req: Request, res: Response) => {
      const list = await Category.find({
        relations: ["questions"],
      });
      res.json(list);
    });

    app.post("/api/v1/create-question", async (req: Request, res: Response) => {
      // Category table find req.body.category_id_list -> Category[]

      // In -> find multiple ids
      const category_list = await Category.find({
        where: {
          // id: [1, 6],
          // id: Not(In([1, 2])),
          id: In(req.body.category_id_list),
        },
      });

      const newQuestion = new Question();
      newQuestion.title = req.body.title;
      newQuestion.categories = category_list; // number[]; -> Category[]

      await Question.save(newQuestion);

      res.json(newQuestion);
    });

    app.get("/api/v1/question/list", async (req: Request, res: Response) => {
      const list = await Question.find({
        relations: ["categories"],
      });
      res.json(list);
    });

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
