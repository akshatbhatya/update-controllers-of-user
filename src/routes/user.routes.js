import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { logIn } from "../controllers/user.controller.js";
import { logOut } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
    {
      name: "coverAvtar",
      maxCount: 1,
    },
  ]),
  userRegister
);

router.route("/login").post(logIn);
router.route("/logout").post(logOut);
export { router };
