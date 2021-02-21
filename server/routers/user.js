import { Router } from "express";

import authUser, {
  blockUnauthorizedUser,
  verifyBlockedUser,
} from "../middlewares/authenticateUser";
import {
  get_user_info,
  get_user_info_by,
  get_users_info,
  get_remove_user,
  get_messages_on,
  get_today_messages,
  get_user_states,
  post_update_username,
  post_update_password,
  post_report_user,
  delete_warning,
} from "../controllers/user";

const router = Router();

router.post("/update-username", authUser, post_update_username);
router.post("/update-password", authUser, post_update_password);
router.post("/report-user", authUser, blockUnauthorizedUser, post_report_user);

router.get("/user-info", authUser, verifyBlockedUser, get_user_info);
router.get("/user-info-by", authUser, get_user_info_by);
router.get("/users-info", authUser, blockUnauthorizedUser, get_users_info);
router.get("/user-states", authUser, blockUnauthorizedUser, get_user_states);
router.get("/remove-user", authUser, blockUnauthorizedUser, get_remove_user);
router.get("/messages-on", get_messages_on);
router.get("/today-messages", get_today_messages);

router.delete(
  "/warning/:warning_id",
  authUser,
  blockUnauthorizedUser,
  delete_warning
);

export default router;
