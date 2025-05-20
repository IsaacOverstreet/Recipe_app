import passport from "passport";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const saltRounds = 10;

const prismaClient = new PrismaClient();

// register controller
export async function registerUser(req, res) {
  const email = req.body.email;

  const password = req.body.password;

  try {
    const checkUser = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (checkUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = await prismaClient.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });

    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login after registration failed", err });
      }
      return res.status(201).json({
        message: "user sucessfull created and loggedin ",
        user,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "error during registration", error });
  }
}

// login controller
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
  })(req, res, next); // Invoke passport.authenticate with (req, res, next)
}

export function logout(req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "error during logout", err });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("error destroying session", err);
      }
      res.clearCookie("connect.sid");

      res.json({ success: true, message: "logged out successful" });
    });
  });
}
