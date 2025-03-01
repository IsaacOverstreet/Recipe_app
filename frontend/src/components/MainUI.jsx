import { useEffect, useState, useRef } from "react";
import { searchRecipes, getFavouriteRecipes, addToFavourite } from "../api.js";
import RecipeCard from "./RecipeCard.jsx";
import RecipeModal from "./RecipeModal";

function MainUI() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(undefined);
  const [selectTab, setSelectTab] = useState("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const pageNumber = useRef(1);

  useEffect(() => {
    async function fetchFavouriteRecipe() {
      try {
        const favourite = await getFavouriteRecipes();
        setFavouriteRecipes(favourite.results);
        console.log("fav", favourite.results);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFavouriteRecipe();
  }, []);

  function inputHandler(event) {
    setSearch(event.target.value);
  }

  async function handleViewMore() {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipe = await searchRecipes(search, nextPage);
      setRecipes((prev) => [...prev, ...nextRecipe.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    try {
      const result = await searchRecipes(search, 1);
      setRecipes(result.results);
      pageNumber.current = 1;
    } catch (error) {
      console.error(error.message);
    }
  }

  // function to add Favourite recipe
  async function addFavourite(recipe) {
    try {
      await addToFavourite(recipe);

      setFavouriteRecipes((prev) => [...prev, recipe]);
      localStorage.setItem((prev) => [...prev, recipe]);
      console.log("fav2", favouriteRecipes);
    } catch (error) {
      console.log(error);
    }
  }

  // if favouriteRecipeId = renderedSearchRecipeId then change text color of heartIcon
  function isFavourite(recipeId) {
    return favouriteRecipes.some((recipe) => recipe.id == recipeId);
  }

  // JSX
  return (
    <div>
      <div className="flex gap-2 cursor-pointer">
        <h1 onClick={() => setSelectTab("search")}>search</h1>
        <h1 onClick={() => setSelectTab("favourite")}>favourite</h1>
      </div>

      {selectTab === "search" && (
        <>
          {/* form and submit  */}
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              onChange={inputHandler}
              value={search}
              placeholder="Enter a search term"
              className="border border-solid rounded-[5px] focus: "
              required
            />
            <button
              type="submit"
              className=" border border-solid rounded-[5px]"
            >
              submit
            </button>
          </form>

          {/* rendering search recipes */}
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              image={recipe.image}
              title={recipe.title}
              onFavouriteButtonClick={() => addFavourite(recipe)}
              isFavourite={() => isFavourite(recipe.id)}
            />
          ))}
          <button
            onClick={handleViewMore}
            className="border border-solid rounded-[5px]"
          >
            View more
          </button>
        </>
      )}

      {/* rendering favourite recipes */}
      {selectTab === "favourite" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              image={recipe.image}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={() => undefined}
            />
          ))}
        </div>
      )}

      {/* rendering recipe modal */}
      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
}
export default MainUI;
