import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, deleteAddressController, editAddress, getAllAddressController, getSingleAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add",auth,addAddressController)
addressRouter.get("/get",auth,getAllAddressController)
addressRouter.get("/:id", auth, getSingleAddressController);    
addressRouter.delete("/:id", auth, deleteAddressController);
addressRouter.put("/:id", auth, editAddress);  


export default addressRouter