const Post = require("../models/post");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getPostById = (req, res, next, id) => {
  Post.findById(id).exec((err, post) => {
    if (err) {
      return res.status(400).json({
        err: "No POST Found",
      });
    }
    req.post = post;
    next();
  });
};

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with PHOTO",
      });
    }

    let post = new Post(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: "File size too big",
        });
      }
      post.photo.data = fs.readFileSync(file.photo.filepath);
      post.photo.contentType = file.photo.mimetype;
    }
    console.log(post);

    post.save((err, post) => {
      if (err) {
        return res.status(400).json({
          err: "Saving photo in DB failed",
        });
      }
      res.json({
        id: post._id,
      });
    });
  });
};

exports.getPost = (req, res, id) => {
  req.post.photo = undefined;
  return res.json(req.post);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
  }
  next();
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, deletedPost) => {
    if (err) {
      return res.status(400).json({
        err: "Failed to delete post",
      });
    }
    res.json({
      message: "Post Deleted Successfully",
      deletedPost,
    });
  });
};

exports.updatePost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with PHOTO",
      });
    }
    const { description } = fields;

    let post = req.post;
    post = _.extend(post, fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: "File size too big",
        });
      }
      post.photo.data = fs.readFileSync(file.photo.filepath);
      post.photo.contentType = file.photo.mimetype;
    }
    console.log(post);

    post.save((err, post) => {
      if (err) {
        return res.status(400).json({
          err: "Updation of photo in DB failed",
        });
      }
      res.json({
        id: post._id,
      });
    });
  });
};

exports.getAllPosts = (req, res) => {
  Post.find()
    .select("-photo") //these - specify without photo we are getting posts
    .sort([["updatedAt", "descending"]])
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          err: "NO POST in DB",
        });
      }
      res.json(posts);
    });
};
