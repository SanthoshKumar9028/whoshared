import { Router } from "express";

import authenticateUser, {
  verifyBlockedUser,
} from "../middlewares/authenticateUser";
import {
  get_is_user,
  get_logout_user,
  post_add_user,
  post_login_user,
} from "../controllers/auth";

const auth = Router();

auth.get("/is-user", authenticateUser, verifyBlockedUser, get_is_user);
auth.get("/logout-user", authenticateUser, get_logout_user);
auth.post("/add-user", post_add_user);
auth.post("/login-user", post_login_user);

export default auth;
