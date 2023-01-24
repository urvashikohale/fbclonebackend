var mongoose = require("mongoose");
const crypto = require("node:crypto");
const { v4: uuidv4 } = require("uuid");
var bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "EMAIL required"],
    },
    //TODO PASSWORD
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    //role is to diff user from admin
    role: {
      type: Number,
      default: 0,
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now,
    },
    about: {
      type: String,
      trim: true,
    },
    post: {
      type: Array,
      default: [],
    },

    friends: {
      type: Array,
      default: [],
    },
    profilePhoto: {
      data: Buffer,
      contentType: String,
    },
    coverPhoto: {
      data: Buffer,
      contentType: String,
    },
    lives: {},
  },
  { timestamps: true }
);

//password hashing here
//Schema method from lco 30->06
//thapa technical mern 14
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  // userSchema.pre("save", async function (next) {
  //   if (this.isModified("password")) {
  //     this.password = await bcrypt.hash(this.password, 12);
  //   }
  //   next();
  // })
};

module.exports = mongoose.model("User", userSchema);
