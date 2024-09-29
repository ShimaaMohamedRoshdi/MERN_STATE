import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { handleErrors } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: " Hello World!" });
};

// function to update the user:
export const updateUser = async (req, res, next) => {
  // checked the user:
  if (req.user.id !== req.params.id) {
    return next(handleErrors(401, "You can only update your own accoubt!"));
  }
  try {
    //checked if there is password:
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 15);
    }
    // update the user:
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avator: req.body.avator,
        },
      },
      { new: true }
    );

    // hidden the password:
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// function to delete account:
export const deleteUser = async (req, res, next) => {
  // check the user:
  if (req.user.id !== req.params.id) {
    return next(handleErrors(401, "You can only delete your own accoubt!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};

// function to get listing of users:
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

// function to get user :
export const getUser = async (req, res, next) => {
  try {
    // get user:
    const user = await User.findById(req.params.id);
    // check if there is no user
    if (!user) {
      return next(handleErrors(404, "User not found!"));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
