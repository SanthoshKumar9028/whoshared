import { Router } from "express";

import authUser, {
  blockUnauthorizedUser,
} from "../middlewares/authenticateUser";
import {
  post_update_username,
  post_update_password,
  get_user_info,
  get_users_info,
  delete_remove_user,
} from "../controllers/user";

const router = Router();

router.post("/update-username", authUser, post_update_username);
router.post("/update-password", authUser, post_update_password);
router.get("/user-info", authUser, get_user_info);
router.get("/users-info", authUser, blockUnauthorizedUser, get_users_info);
router.get("/remove-user", authUser, blockUnauthorizedUser, delete_remove_user);

export default router;
