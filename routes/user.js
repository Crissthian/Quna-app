import express from "express";
import passport from "passport";
import userController from "../controllers/users.js";
import isLoggedIn, { saveRedirectUrl } from "../utils/isLoggedIn.js";
import wrapAsync from "../utils/wrapAsync.js";
const router = express.Router();

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

router.get("/logout", userController.logout);
router.get("/profile", isLoggedIn, wrapAsync(userController.userProfile));
router.get("/users/:id", wrapAsync(userController.publicProfile));

export default router;
