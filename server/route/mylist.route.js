import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addToMyListController,
  deleteFromMyListController,
  getMyListController,
} from "../controllers/mylist.controller.js";
import { get } from "mongoose";

const myListRouter = Router();

myListRouter.post("/add", auth, addToMyListController);
myListRouter.get("/", auth, getMyListController);
myListRouter.delete("/:id", auth, deleteFromMyListController);

export default myListRouter;
