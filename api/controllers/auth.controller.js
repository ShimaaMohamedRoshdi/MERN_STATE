import bcryptjs from "bcryptjs";
import { handleErrors } from "../utils/error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// funtion for signup user:
export const signup_post = async (req, res, next) => {
  // get username and email and password from the body:
  const { username, email, password } = req.body;
  // hash password:
  const hashedPassword = bcryptjs.hashSync(password, 15);
  // create a new user:
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    // create a response:
    res.status(200).json("user created successfully!");
  } catch (error) {
    next(error);
  }
};

// function to signin user:
export const signin_post = async (req, res, next) => {
  // get email and password from the body:
  const { email, password } = req.body;
  try {
    // check the email:
    // find user by email:
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(
        handleErrors(404, "User not found! Please try to sign up again.")
      );
    }
    // check the password:
    // compare hashed password with password stored:
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(handleErrors(404, "Wrong password! Please try again."));
    }
    // create a token :
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    // reset password:
    const { password: pass, ...rest } = validUser._doc;
    // save token to prowsser:
    res
      .cookie("access_token", token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// function to sign in with google account:
export const google_post = async (req, res, next) => {
  try {
    // find user by email:
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // create a token :
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      // reset password:
      const { password: pass, ...rest } = user._doc;
      // save token to password:
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(rest);
    } else {
      // generate password:
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 15);
      // create new user:
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avator: req.body.photo,
      });

      // save new user:
      await newUser.save();
      // create a token :
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      // reset password:
      const { password: pass, ...rest } = newUser._doc;
      // save token to  Browsser:
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// function to signout user:
export const signout_get = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User signed out successfully!");
  } catch (error) {
    next(error);
  }
};
