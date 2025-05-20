import express from "express";
import {
  searchRecipes,
  getRecipeSummary,
  getFavouriteRecipesById,
} from "../recipe-api.js";

import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
const router = express.Router();

router.get("/search", async (req, res) => {
  const searchTerm = req.query.searchTerm;

  const page = req.query.page || "1";

  const result = await searchRecipes(searchTerm, page);

  return res.json(result);
});

router.get("/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const result = await getRecipeSummary(recipeId);
  return res.json(result);
});

router.post("/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.user.id;
  try {
    const favouriteRecipe = await prismaClient.favouriteRecipe.create({
      data: {
        recipeId: recipeId,
        userId: userId,
      },
      select: {
        id: true,
        recipeId: true,
      },
    });

    return res.status(201).json(favouriteRecipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "opps, something went wrong" });
  }
});

router.get("/favourite", async (req, res) => {
  try {
    const recipes = await prismaClient.favouriteRecipe.findMany({
      where: { userId: req.user.id },
    });

    const recipesIds = recipes.map((recipe) => recipe.recipeId);

    const favourites = await getFavouriteRecipesById(recipesIds);
    return res.json(favourites);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.user.id;

  try {
    await prismaClient.favouriteRecipe.delete({
      where: {
        user_recipe_unique: {
          userId: userId,
          recipeId: recipeId,
        },
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "opps, something went wrong" });
  }
});

//session service
router.get("/session-validator", (req, res) => {
  if (req.isAuthenticated()) {
    return res
      .status(200)
      .json({ message: "session on", user: req.user, authenticated: true });
  }

  res.status(401).json({ message: "session expired" });
});

export default router;
