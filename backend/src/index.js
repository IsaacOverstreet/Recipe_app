import express from "express";
import cookieParser from "cookie-parser";

import pg from "pg";
import env from "dotenv";
import authRoute from "./route/routeAuth.js";
import mainUIroute from "./route/mainUIroute.js";
import session from "express-session";
import passport from "./passportConfig.js";
import isAuthenticated from "./middleWare/authMiddleware.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;
const app = express();
app.use(cookieParser());

env.config();
app.use(
  session({
    secret: process.env.YOUR_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 1,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use("/api", authRoute);
app.use("/api/recipes", isAuthenticated, mainUIroute);

app.use((err, req, res, next) => {
  console.error("error", err);
  res.status(500).json({ message: "server error", error: err.message });
});

// Serve React in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/", "index.html"));
  });
}
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

// Clean up Prisma on shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
