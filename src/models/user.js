import mongoose, { Schema, Types } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String || Number,
      trim: true,
      required: true,
    },
    profile_Photo: {
      type: String,
    },
    cover_Photo: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// userSchema.plugin(mongooseAggregatePaginate);

//pre middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//custom method
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXP_TIME,
    }
  );
};
userSchema.methods.generateRefreshToken = async function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXP_TIME,
    }
  );
};
export const User = mongoose.model("User", userSchema);
