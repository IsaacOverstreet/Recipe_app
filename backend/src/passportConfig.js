import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: "password" }),
  async (email, password, done) => {
    try {
      // find user in db
      const user = await PrismaClient.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        return done(null, false, { message: "user not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "incorrect email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await PrismaClient.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err);
  }
});
