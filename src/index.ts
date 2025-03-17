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
import { Promocode } from "./DAL/models/promocode.model";
import { Home } from "./DAL/models/home.model";
import moment from "moment";

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


    app.post("/promocode/create", async (req: Request, res: Response) => {
      const {
        code,
        from_date,
        to_date,
        discount_type,
        discount_value,
      } = req.body;

      const newPromocode = new Promocode();
      newPromocode.code = code;
      newPromocode.from_date = from_date;
      newPromocode.to_date = to_date;
      newPromocode.discount_type = discount_type;
      newPromocode.discount_value = discount_value;

      const newData = await newPromocode.save();

      res.json(newData);

    });

    app.post("/home/create", async (req: Request, res: Response) => {
      const {
        title,
        price,
      } = req.body;

      const newHome = new Home();
      newHome.title = title;
      newHome.price = price;

      const newData = await newHome.save();

      res.json(newData);

    });

    app.post("/promocode/calculate", async (req: Request, res: Response) => {
      const { promocode: code, product_id: homeId, quantity } = req.body;

      const promocode = await Promocode.findOne({
        where: {
          code: code,
        },
      });
      if (!promocode) {
        res.status(404).json({ error: "Promocode not found" });
        return;
      };

      const product = await Home.findOne({
        where: {
          id: homeId,
        },
      });
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      };

      const total_amount = product.price * quantity; // 100azn * 5 eded = 500azn

      // validate promo & apply discount

      // 1. Check if date is valid
      const currentDate = moment();

      const isBefore = currentDate.isBefore(promocode.to_date);
      const isAfter = currentDate.isAfter(promocode.from_date);

      if (!isBefore || !isAfter) {
        res.status(400).json({
          error: "Promocode is not valid",
          today: currentDate.format("DD-MM-YYYY HH:mm"),
          validDates: {
            from: moment(promocode.from_date).format("DD-MM-YYYY HH:mm"),
            to: moment(promocode.to_date).format("DD-MM-YYYY HH:mm"),
          },
        });
        return;
      }

      // 2. validate order min amount
      if (promocode.min_order_amount > total_amount) {
        res.status(400).json({
          error: `Order total amount is less than required minimum: ${promocode.min_order_amount} AZN. You order total: ${total_amount} AZN`,
          exception: "Less than minimum",
        });
        return;
      }

      // 15.000 -> 20% (3.000 discount)
      // 2000 -> 20% (400 discount)

      // 3. validate order max amount
      if (promocode.max_order_amount < total_amount) {
        res.status(400).json({
          error: `Order total amount is more than required maximum: ${promocode.max_order_amount} AZN. You order total: ${total_amount} AZN`,
          exception: "More than maximum",
        });
        return;
      }

      // Calculate discount and send response

      if (promocode.discount_type === "amount") {
        res.json({
          total_amount,
          promocode_discount: {
            type: "amount",
            value: promocode.discount_value,
          },
          discount: promocode.discount_value,
          total_amount_with_discount: total_amount - promocode.discount_value,
        });
      } else if (promocode.discount_type === "percentage") {
        res.json({
          total_amount,
          promocode_discount: {
            type: "percentage",
            value: promocode.discount_value,
          },
          discount: (total_amount * promocode.discount_value) / 100,
          total_amount_with_discount: total_amount - (total_amount * promocode.discount_value) / 100,
        });
      }

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
