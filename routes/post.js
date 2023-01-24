const express = require("express");
const router = express.Router();

const {
  getPostById,
  createPost,
  getPost,
  photo,
  deletePost,
  updatePost,
  getAllPosts,
} = require("../controllers/post");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isLoggedIn } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("postId", getPostById);

//routes create post
router.post("/post/create/:userId", isLoggedIn, isAuthenticated, createPost);
//show post
router.get("/post/:postId", getPost);
//middleware
router.get("/post/photo/:postId", photo);

//delete post
router.delete("/post/:postId/:userId", isLoggedIn, isAuthenticated, deletePost);

//update post
router.put("/post/:postId/:userId", isLoggedIn, isAuthenticated, updatePost);

//get ALL user post
router.get("/posts", isLoggedIn, getAllPosts);
module.exports = router;
