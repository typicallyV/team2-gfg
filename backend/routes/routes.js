//all functions are stored in testController.js
import express from "express";
import {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getDashboard,
  postLogout,
} from "../controller/controllers.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

 
router.get("/login", getLogin);
router.post("/login", postLogin);

 
router.get("/register", getRegister);
router.post("/register", postRegister);


router.get("/dashboard", isAuth, getDashboard);


router.post("/logout", postLogout);

export default router;