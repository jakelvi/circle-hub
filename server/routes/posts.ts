import { Router } from "express";
import { validateToken } from "../middleware/validate-token";
import {
  validatePostCreation,
  validateUpdatePost,
} from "../middleware/validation";
import {
  deletePost,
  getAllFavorites,
  getAllPosts,
  getPostById,
  getRecentPosts,
  getUserPosts,
  handleFileUpload,
  handleUploadPostImage,
  logMiddleware,
  postCreation,
  searchPosts,
  toggleFavorite,
  toggleLike,
  updatePost,
} from "../controllers/postControllers";
import { isAdminOrUser } from "../middleware/is-admin-or-user";

const router = Router();

router.post("/createPosts", validateToken, validatePostCreation, postCreation);

router.post(
  "/uploadFiles",
  validateToken,
  handleUploadPostImage,
  handleFileUpload
);

router.post("/like/:id", validateToken, toggleLike);

router.post("/favorite/:id", validateToken, toggleFavorite);

router.put("/updatePost", validateToken, updatePost);

router.get("/searchPosts", validateToken, searchPosts);

router.get("/getFavorites/:id", logMiddleware, validateToken, getAllFavorites);

router.get(
  "/getHighestLiked/:id",

  validateToken,
  getAllFavorites
);

router.get("/getPosts", validateToken, getAllPosts);

router.get("/getUserPosts/:id", validateToken, getUserPosts);

router.get("/getPost/:id", validateToken, getPostById);

router.get("/getRecentPosts/", validateToken, getRecentPosts);

router.delete(
  "/deletePost/:id",

  validateToken,

  deletePost
);

export { router as postsRouter };
