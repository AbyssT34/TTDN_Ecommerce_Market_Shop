import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, deleteAddressController, getAllAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add",auth,addAddressController)
addressRouter.get("/get",auth,getAllAddressController)
addressRouter.delete("/:id", auth, deleteAddressController);


export default addressRouter