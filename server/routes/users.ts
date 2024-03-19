import { Router } from "express";
import {
  validateLogin,
  validateProfileImage,
  validateUserRegistration,
  validateUserUpdate,
} from "../middleware/validation";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { validateToken } from "../middleware/validate-token";
import { resetEmail, resetPassword } from "../middleware/reset";
import { createOTP, verifyOTP } from "../middleware/otp-generator";
import { sendOTPEmail, sendRegisteredEmail } from "../middleware/mailer";
import {
  deleteUser,
  followUserToggle,
  getAllUsers,
  getUser,
  getUserById,
  login,
  register,
  updateUser,
} from "../controllers/userControllers";

import {
  uploadProfileImage,
  handleFileUpload,
} from "../middleware/service/user-multer-file";
const router = Router();

router.post(
  "/register",
  validateUserRegistration,
  sendRegisteredEmail,
  register
);

router.post("/login", validateLogin, login);

router.post("/verifyOTP", validateToken, verifyOTP);

router.get(
  "/generateOTP/:id",
  validateToken,
  isAdminOrUser,
  createOTP,
  sendOTPEmail
);

router.get("/getUsers", validateToken, getAllUsers);

router.get("/admin/getUsers", isAdmin, validateToken, getAllUsers);

router.get("/getUser", validateToken, getUser);

router.get("/getUserById/:id", validateToken, getUserById);

router.put(
  "/updateUser/:id",
  isAdminOrUser,
  validateToken,
  uploadProfileImage,
  handleFileUpload,
  // validateUserUpdate,
  updateUser
);

router.patch("/followUser/:id", validateToken, followUserToggle);

router.patch("/resetPassword/:id", validateToken, isAdminOrUser, resetPassword);

router.patch("/resetEmail/:id", validateToken, isAdminOrUser, resetEmail);

router.delete("/deleteUser/:id", isAdminOrUser, validateToken, deleteUser);

export { router as usersRouter };
