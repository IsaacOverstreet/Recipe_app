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
    const InsertNewDB = await prismaClient.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });
    console.log("🚀 ~ registerUser ~ InsertNewDB:", InsertNewDB);
    res
      .status(201)
      .json({ message: "user sucessfull created", user: InsertNewDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error during registration", error });
  }
}
