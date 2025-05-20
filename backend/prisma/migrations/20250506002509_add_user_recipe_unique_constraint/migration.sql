/*
  Warnings:

  - A unique constraint covering the columns `[userId,recipeId]` on the table `FavouriteRecipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavouriteRecipe_userId_recipeId_key" ON "FavouriteRecipe"("userId", "recipeId");
