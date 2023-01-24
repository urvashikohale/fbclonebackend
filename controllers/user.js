const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.getAllUser = (req, res) => {
  User.find().exec((err, user) => {
    if (err || !user) {
      return res.json({
        err: "NO USER FOUND",
      });
    }
    req.profile = user;
    return res.json(req.profile);
  });
};
