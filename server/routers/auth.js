import { Router } from "express";

import authController from "../controllers/auth";

const auth = Router();

auth.get("/is-user", authController.get_is_user);
auth.post("/add-user", authController.post_add_user);
auth.post("/login-user", authController.post_login_user);

export default auth;
