import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { User, userModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

const router = Router();

router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const userCount = await userModel.countDocuments();
    if (userCount > 0) {
      res.send("Seed is already done!");
    }

    await userModel.create(sample_users);
    res.send("Seed is done!");
  })
);

router.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateResponseToken(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Email or Password is not valid !");
    }
  })
);

router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist,please login !");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
    };

    const dbUser = await userModel.create(newUser);
    res.send(generateResponseToken(dbUser));
  })
);

const generateResponseToken = (user: any) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_CODE!,
    {
      expiresIn: "30d",
    }
  );
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
