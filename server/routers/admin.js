import { Router } from "express";

import authUser, {
  blockUnauthorizedUser,
} from "../middlewares/authenticateUser";
import {
  get_reports,
  get_all_reports,
  post_send_warning,
  post_block_user_by,
  delete_reports,
  delete_remove_user,
} from "../controllers/admin";

const router = Router();

router.get("/reports/:username", authUser, blockUnauthorizedUser, get_reports);
router.get("/all-reports", authUser, blockUnauthorizedUser, get_all_reports);

router.post(
  "/block-user-by",
  authUser,
  blockUnauthorizedUser,
  post_block_user_by
);
router.post(
  "/send-warning",
  authUser,
  blockUnauthorizedUser,
  post_send_warning
);

router.delete(
  "/reports/:userId",
  authUser,
  blockUnauthorizedUser,
  delete_reports
);
router.delete(
  "/remove-user/:userId",
  authUser,
  blockUnauthorizedUser,
  delete_remove_user
);

export default router;
