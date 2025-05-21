import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const prismaClient = new PrismaClient();

// const callbackURL =
//   process.env.NODE_ENV === "production"
//     ? "https://recipe-app-lhce.onrender.com/api/auth/google/callback"
//     : `${process.env.BACKEND_URL}/api/auth/google/callback`;

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        // find user in db
        const user = await prismaClient.user.findUnique({
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
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prismaClient.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              email: profile.emails[0].value,
              password: "google-auth-no-password",
            },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prismaClient.user.findUnique({ where: { id } });

    done(null, user);
  } catch (err) {
    console.error(err);
    done(err);
  }
});

export default passport;
