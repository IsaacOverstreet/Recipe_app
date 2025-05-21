import express from "express";
import { registerUser, loginUser, logout } from "../authController.js";
import passport from "passport";

import crypto from "crypto";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/logout", logout);

// const redirect_uri =
//   process.env.NODE_ENV === "production"
//     ? "https://recipe-app-lhce.onrender.com/api/auth/google/callback"
//     : `${process.env.BACKEND_URL}/api/auth/google/callback`;

// FLEXIBLE APPROACH OF GETTING THE URL
router.get("/auth/google/url", (req, res) => {
  try {
    //Generate a random CSRF Token
    const csrfToken = crypto.randomBytes(16).toString("hex");

    // encode the state
    const state = {
      csrfToken,
      redirect: req.query.redirect || "/main",
    };
    console.log("🚀 ~ router.get ~ state:", state);

    const encodedState = Buffer.from(JSON.stringify(state)).toString("base64");

    // Store the CSRF Token in session
    res.cookie("csrf_token", csrfToken, {
      httpOnly: true, // Prevent JS access
      secure: false, // HTTPS-only
      sameSite: "Lax", // Prevents CSRF
      maxAge: 3000 * 60 * 5,
      path: "/", // Accessible across all paths
    });

    const options = {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/userinfo.email",
      ],
      access_type: "offline",
      prompt: "consent",
      state: encodedState,
    };

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        response_type: "code",
        ...options,
      }
    )}`;

    res.json({ url: authUrl });
  } catch (error) {
    console.error("google URL Generation error", error);
    return res.status(500).json({
      success: false,
      error: "failed to generate authentication URL",
    });
  }
});

//GOOGLE LOGIN CALLBACK
router.get(
  "/auth/google/callback",
  (req, res, next) => {
    try {
      const { state } = req.query;

      if (!req.query.state) {
        throw new Error("Missing state parameter");
      }

      const stateString = Buffer.from(state, "base64").toString();
      console.log("🚀 ~ stateString:", stateString);
      const decodedState = JSON.parse(stateString);
      console.log("🚀 ~ decodedState:", decodedState);

      const cookieToken = req.cookies.csrf_token;
      console.log("🚀 ~ cookieToken:", cookieToken);

      if (decodedState.csrfToken !== cookieToken) {
        throw new Error("Invalid csrf Token");
      }

      req.session.redirectAfterAuth = decodedState.redirect || "/main";

      res.clearCookie("csrf_token");

      next();
    } catch (error) {
      console.error("0Auth state error", error);
      return res.redirect("/login?error=state_processing");
    }
  },

  ///////////// PASSPORT AUTHENTICATION///////////////////
  passport.authenticate("google", { session: true }),
  async (req, res) => {
    try {
      // 1. Handle all error cases

      if (!req.user) {
        return res.redirect("/login?error=oauth_error");
      }
      // manual login
      req.login(req.user, (err) => {
        if (err) {
          console.error("session error:", err);
          return res.redirect("/login?error=session_error");
        }
        // success handler

        const redirectUrl = req.session.redirectAfterAuth || "/main";
        delete req.session.redirectAfterAuth;
        return res.redirect(`${process.env.BACKEND_URL}${redirectUrl}`);
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.redirect("/login?error=unexpected_error");
    }
  }
);

export default router;
