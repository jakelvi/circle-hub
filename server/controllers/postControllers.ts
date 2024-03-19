import { RequestHandler } from "express";
import { Post } from "../database/model/posts";
import { INewPost, IUpdatePost } from "../@types/posts";
import { Logger } from "../logs/logger";
import { User } from "../database/model/user";
import deleteImages from "../middleware/service/delete-multer-images";
import { upload } from "../middleware/service/post-multer-file";
import multer from "multer";

export const postCreation: RequestHandler = async (req, res, next) => {
  try {
    const savedPost = await Post.create(req.body as INewPost);
    const userId = savedPost.userId;
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: savedPost._id } },
      { new: true }
    );
    res.status(201).json({ message: "Post created", post: savedPost });
    Logger.success("Post was created successfully", 201);
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const handleUploadPostImage: RequestHandler = (req, res, next) => {
  upload.single("file")(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "Error uploading file" });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    next();
  });
};

export const handleFileUpload: RequestHandler = (req, res, next) => {
  try {
    if (!req.file) {
      return;
    }

    const imageUrl = `http://localhost:5000/postUploads/${req.file.filename}`;
    return res.status(200).json({ imageUrl });
  } catch (e) {
    next(e);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const updatedPost = req.body as IUpdatePost;
    await Post.findByIdAndUpdate(updatedPost.id, updatedPost, { new: true });

    const postImagePath = req.body.image;
    const oldPostImagePath = updatedPost.image;

    if (
      postImagePath &&
      oldPostImagePath &&
      postImagePath !== oldPostImagePath
    ) {
      deleteImages(oldPostImagePath);
    }

    res.status(200).json({ message: "Post updated", post: updatedPost });
    Logger.success("Post was updated successfully", 200);
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const searchPosts: RequestHandler = async (req, res, next) => {
  let searchTerm: string;
  try {
    searchTerm = req.query.searchTerm as string;
    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }
    const regex = new RegExp(searchTerm, "i");
    const posts = await Post.find(
      { tags: { $in: [regex] } },
      { caption: 1, image: 1, userId: 1 }
    ).lean();

    Logger.success(200, "Posts searched successfully");
    res.json({ posts });
  } catch (e) {
    Logger.error("Error searching posts:", e.message);
    Logger.error("Stack trace:", e.stack);
    Logger.error("Search term:", searchTerm);
    next(e);
  }
};

export const getAllPosts: RequestHandler = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skipCount =
    (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
  try {
    const posts = await Post.find({}, { caption: 1, image: 1, userId: 1 })
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(parseInt(limit as string, 10))
      .lean();
    Logger.success("Posts were found", 200);
    res.status(200).json({ posts });
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const getPostById: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      Logger.error("post wasnt found successfully");
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ post });
    Logger.success("Post was found", 200);
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = post.userId;

    const deletedPost = await Post.findByIdAndDelete(id);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedPosts = user.posts.filter(
      (postId) => postId.toString() !== id
    );
    user.posts = updatedPosts;

    await user.save();

    res.status(200).json({ message: "Post deleted" });
    Logger.success(200, "Post was deleted successfully");
  } catch (e) {
    next(e);
  }
};

export const toggleLike: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      Logger.error("Post was not found");
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.some((like) => like.userId.equals(userId));
    if (isLiked) {
      post.likes = post.likes.filter((like) => !like.userId.equals(userId));
    } else {
      post.likes.push({ userId });
    }
    await post.save();
    Logger.success(200, "Post was liked  unliked successfully");
    res.json({
      message: isLiked ? "Post unliked" : "Post liked",
      postId,
      post,
    });
  } catch (e) {
    next(e);
  }
};

export const toggleFavorite: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      Logger.error("post was not found");
      return res.status(404).json({ message: "Post not found" });
    }
    const isFavorited = post.favorites.some((favorite) =>
      favorite.userId.equals(userId)
    );
    if (isFavorited) {
      post.favorites = post.favorites.filter(
        (favorite) => !favorite.userId.equals(userId)
      );
    } else {
      post.favorites.push({ userId });
    }
    await post.save();
    Logger.success(200, "post was favorited  unfavorited");
    res.status(200).json({
      message: isFavorited ? "Post unfavorited" : "Post favorited",
      post,
    });
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const getAllFavorites: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const favorites = await Post.find({ "favorites.userId": userId }).lean();
    Logger.success(
      200,
      "Favorites sent successfully",
      JSON.stringify(favorites)
    );
    res
      .status(200)
      .json({ msg: "Favorites retrieved successfully", favorites });
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const getPopularPosts: RequestHandler = async (req, res, next) => {
  try {
    const popularPosts = await Post.find().sort({ likes: -1 }).limit(20);
    Logger.success(200, "Popular posts got successfully");
    res.status(200).json(popularPosts);
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const getRecentPosts: RequestHandler = async (req, res, next) => {
  try {
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(20);
    const formattedPosts = recentPosts.map((post: any) => ({
      ...post._doc,
      createdAt: new Date(post.createdAt).toISOString(),
    }));
    Logger.success(200, "Recent posts retrieved successfully");
    return res.status(200).json(formattedPosts);
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userPosts = await Post.find({ userId: id }).sort({
      createdAt: -1,
    });
    if (userPosts.length === 0) {
      Logger.error("User posts were not found");
      return res.status(404).json({ message: "User posts not found" });
    }
    Logger.success(200, "User posts retrieved successfully");
    return res.status(200).json(userPosts);
  } catch (e) {
    Logger.error("Error fetching user posts:", e);
    next(e);
  }
};

export const deleteFavoritePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      Logger.error("Post was not found");
      return res.status(404).json({ error: "Post not found" });
    }

    const index = post.favorites.indexOf(userId);
    if (index !== -1) {
      post.favorites.splice(index, 1);
      await post.save();
    }
    Logger.success(200, "Favorite post was deleted successfully");
    return res
      .status(200)
      .json({ message: "Favorite post deleted successfully" });
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};
