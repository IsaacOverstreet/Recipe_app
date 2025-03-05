import passport from "passport";
import LocalStrategy from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const saltRounds = 10;

const prismaClient = new PrismaClient();

export async function registerUser(req, res) {
  const endPoint = req.originalUrl;
  console.log("🚀 ~ registerUser ~ endPoint:", endPoint);
  const email = req.body.email;
  console.log("🚀 ~ registerUser ~ email:", email);
  const password = req.body.password;
  console.log("🚀 ~ registerUser ~ password:", password);

  try {
    const checkUser = await prismaClient.user.findUnique({
      where: { email: email },
    });
    console.log("🚀 ~ registerUser ~ checkUser:", checkUser);

    if (checkUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    console.log("🚀 ~ registerUser ~ hashPassword:", hashPassword);
    const user = await prismaClient.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });
    console.log("🚀 ~ registerUser ~ InsertNewDB:", user);

    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login after registration failed", err });
      }
    });
    return res.status(201).json({
      message: "user sucessfull created and loggedin ",
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error during registration", error });
  }
}

export async function loginUser(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("server error during authentication", err);
      return res.status(500).json({ message: "internal server error" });
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("login session error", err);
        return res.status(500).json({ message: "could not login user" });
      }
      return res.status(200).json({
        message: "login success",
        user: { id: user.id, email: user.email },
      });
    });
  });
  req, res, next; // Invoke passport.authenticate with (req, res, next)
}

export function logout(req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "error during logout", err });
    }
    res.json({ message: "logout successful" });
  });
}
