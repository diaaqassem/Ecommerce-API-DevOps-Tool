const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
//  @desc third schema

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a user Name"],
      minlength: [2, "Too Short user Name"],
      maxlength: [30, "Maximum Length Exceeded"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    profileImg: String,
    phone: String,

    email: {
      type: String,
      unique: [true, "email Must Be  Unique"],
      required: [true, "Please provide a email Name"],
    },
    password: {
      type: String,
      minlength: [6, "Too Short password"],

    },
    passwordChangedAT: Date,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // child refernce (one to many )
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: Number,
        city: String,
        postalCode: String,
      },
    ],
    resetCode: String,
    resetCodeExpires: Date,
    resetVerified: Boolean,
  },
  {
    timestamps: true, //Saves createdAt and updatedAt as dates (default=false)
  }
);

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  const user = this;
  if (user.passwordChangedAT) {
    // 1) convert passwordChangedAt to timestamp and convert ms to seconds
    const changedTimestamp = parseInt(
      user.passwordChangedAT.getTime() / 1000,
      10
    );
    // Check if the JWT timestamp is older than the password change timestamp
    return JWTTimestamp < changedTimestamp;  //return false
  }
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const setImageUrl = (doc) => {
  if (doc.profileImg) {
    doc.profileImg = `${process.env.BASE_URL}users/${doc.profileImg}`;
  }
};

userSchema.post("save", (doc) => {
  //  @desc set base img url
  //  create
  setImageUrl(doc);
});
userSchema.post("init", (doc) => {
  //  @desc set base img url
  //  get all,get one,update
  setImageUrl(doc);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
