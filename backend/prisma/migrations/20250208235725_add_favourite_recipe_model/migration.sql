-- CreateTable
CREATE TABLE "FavouriteRecipe" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "FavouriteRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteRecipe_recipeId_key" ON "FavouriteRecipe"("recipeId");
