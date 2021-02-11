import { Router } from "express";

import authController from "../controllers/auth";
import authenticateUser from "../middlewares/authenticateUser";

const auth = Router();

auth.get("/is-user", authenticateUser, authController.get_is_user);
auth.get("/logout-user", authenticateUser, authController.get_logout_user);
auth.post("/add-user", authController.post_add_user);
auth.post("/login-user", authController.post_login_user);

export default auth;
