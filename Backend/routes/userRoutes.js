import express from "express";
import bcrypt from 'bcryptjs';
import User from "../models/userModel.js";
import { generateToken } from "../util.js";
import expressAsyncHandler from 'express-async-handler';

const UserRouter = express.Router();

// Signin route (for user login)
UserRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (user) {
      // Compare the entered password with the hashed password
      if (bcrypt.compareSync(password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    // If authentication fails
    res.status(401).send({ message: "Invalid email or password" });
  })
);

// Signup route (for user registration)
UserRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists by email
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send({ message: "User already exists" });
      return;
    }

    // Hash the password using bcryptjs
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const user = await newUser.save();

    // Send the response with user info and token
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default UserRouter;
