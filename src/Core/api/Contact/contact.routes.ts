import { Router } from "express";
import { Contact } from "../../../DAL/models/contact.model";
import { CreateContactDTO } from "./contact.dto";
import { validate } from "class-validator";
import moment from "moment";

interface IContactResponse {
  id: number;
  name: string;
  surname: string;
  created_at: string;
}

interface IPerson {
  id: number;
  age: number;
}

export const contactRoutes = Router();

contactRoutes.post("/create", async (req, res, next) => {
  try {
    // validate body class validator
    const { name, surname, email, inquiryType, companyName, message } =
      req.body;

    const dto = new CreateContactDTO();
    dto.name = name;
    dto.surname = surname;
    dto.email = email;
    dto.companyName = companyName;
    dto.inquiryType = inquiryType;
    dto.message = message;

    const errors = await validate(dto);
    if (errors.length > 0) throw errors;

    const data = new Contact();
    data.name = name;
    data.surname = surname;
    data.email = email;
    data.companyName = companyName;
    data.inquiryType = inquiryType;
    data.message = message;

    await Contact.save(data)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json({ error: error.message });
      });
  } catch (error) {
    next(error);
  }
});

contactRoutes.get("/list", async (req, res) => {
  const list = await Contact.find({
    withDeleted: true,
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      companyName: true,
      inquiryType: true,
      message: true,
      created_at: true,
    },
  });

  const response: Array<IContactResponse> = list.map((item) => ({
    id: item.id,
    name: item.name,
    surname: item.surname,
    email: item.email,
    companyName: item.companyName,
    inquiryType: item.inquiryType,
    message: item.message,
    created_at: moment(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
  }));

  res.json(response);
});

contactRoutes.put("/contact/:id", async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new Error("Id is required"));

  const { name, surname, email, inquiryType, companyName, message } = req.body;

  const data = await Contact.findOne({
    where: { id: +id },
  });
  if (!data) return next(new Error("Contact not found"));

  const updatedData = await Contact.update(id, {
    name,
    surname,
  });
  res.json(updatedData);
});

contactRoutes.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) return next(new Error("Id is required"));

  const data = await Contact.findOne({
    where: { id },
    select: [
      "id",
      "name",
      "surname",
      "email",
      "companyName",
      "inquiryType",
      "message",
      "created_at",
    ],
  });
  if (!data) return next(new Error("Contact not found"));

  res.json({
    ...data,
    created_at: moment(data.created_at).format("YYYY-MM-DD HH:mm:ss"),
  });
});
