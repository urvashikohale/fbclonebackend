const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  getAllUser,
  list,
  update,
  remove,
  photo,
  defaultPhoto,
  findPeople,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
} = require("../controllers/user");
const { isLoggedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
// router.get("/users", getAllUser);

router.get("/users", list);
// router.post("/users", create);

//followers
router.put("/users/follow", isLoggedIn, addFollowing, addFollower);
router.put("/users/follow", isLoggedIn, removeFollowing, removeFollower);

//findpeople
router.get("/users/findpeople/:userId", isLoggedIn, findPeople);

router.get("/users/:userId", isLoggedIn, getUser);

router.put("/users/:userId", isLoggedIn, isAuthenticated, update);
router.delete("/users/:userId", isLoggedIn, isAuthenticated, remove);

//photo middleware
router.get("/users/photo/:userId", photo, defaultPhoto);
router.get("users/defaultphoto", defaultPhoto);

// router.get("/users/defaultphoto", defaultPhoto);

module.exports = router;
