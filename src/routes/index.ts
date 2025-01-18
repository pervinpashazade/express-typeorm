import { Router } from "express";
import { contactRoutes } from "../Core/api/Contact/contact.routes";

export const v1Routes = Router();

v1Routes.use("/contact", contactRoutes);
