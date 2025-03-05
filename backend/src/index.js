import express from "express";
import prisma, { PrismaClient } from "@prisma/client";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import {
  searchRecipes,
  getRecipeSummary,
  getFavouriteRecipesById,
} from "./recipe-api.js";
import router from "./routeAuth.js";
import session from "express-session";
import passport from "passport";

const port = 3000;
const app = express();
const prismaClient = new PrismaClient();
env.config();
app.use(
  session({
    secret: process.env.YOUR_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 5 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();
app.use("/recipes/auth", router);

app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  console.log(searchTerm);
  const page = req.query.page || "1";
  console.log(page);
  const result = await searchRecipes(searchTerm, page);
  console.log("result", result);
  return res.json(result);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const result = await getRecipeSummary(recipeId);
  return res.json(result);
});

app.post("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;
  try {
    const favouriteRecipe = await prismaClient.favouriteRecipe.create({
      data: {
        recipeId: recipeId,
      },
    });
    return res.status(201).json(favouriteRecipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "opps, something went wrong" });
  }
});

app.get("/api/recipes/favourite", async (req, res) => {
  try {
    const recipes = await prismaClient.favouriteRecipe.findMany();
    console.log("find", recipes);
    const recipesIds = recipes.map((recipe) => recipe.recipeId);

    console.log(recipesIds);

    const favourites = await getFavouriteRecipesById(recipesIds);
    return res.json(favourites);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;
  try {
    await prismaClient.favouriteRecipe.delete({
      where: {
        recipeId: recipeId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "opps, something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
