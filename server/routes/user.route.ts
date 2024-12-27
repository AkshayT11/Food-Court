import  express from "express";
import { checkAuth, forgotPassword, Login, Logout, resetPassword, Signup, updateProfile, verifyEmail } from "../controller/user.controler";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/signup").post(Signup);
router.route("/login").post(Login);
router.route("/logout").post(Logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").put(updateProfile);
router.route("/check-auth").get(isAuthenticated, checkAuth);


export default router;