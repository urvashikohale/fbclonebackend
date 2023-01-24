const User = require("../models/user");
const { validationResult } = require("express-validator");
// var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
//jwt helps to create token ,cookie helps to put cookie
//in browser, expressJWT helps to keep you logged in

exports.signup = (req, res) => {
  //validation of data
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }

  //to get wht user has type and saved it in db
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in Database",
      });
    }
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      id: user._id,
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  //data validation
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }

  //authentication
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "Email does not exist",
      });
    }

    // const isMatch = await bcrypt.compare(password, user.password);

    if (!user.authenticate(password)) {
      return res.status(400).json({
        err: "Password does not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie in browser
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to frontend
    const { _id, firstname, email, role } = user;
    return res.json({ token, user: { _id, firstname, email, role } });
  });
};

exports.logout = (req, res) => {
  //clear cookie for logout
  res.clearCookie("token");
  res.json({
    message: "User logout successfully",
  });
};

//isloggedin is used when user want to see the post of friends
//but isauthenticate means user want to modify changes in acc

//protected routes
exports.isLoggedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, ACCESS DENIED",
    });
  }
  next();
};
