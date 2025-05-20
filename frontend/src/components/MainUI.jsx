import { useEffect, useState, useRef } from "react";
import {
  searchRecipes,
  getFavouriteRecipes,
  addToFavourite,
  removeFavouriteRecipe,
} from "../api.js";
import RecipeCard from "./RecipeCard.jsx";
import RecipeModal from "./RecipeModal";
import { useAuth } from "../hook/useAuth.jsx";
import { Navigate } from "react-router-dom";
import HeroImage from "../assets/heropic2.webp";
import { GoSearch } from "react-icons/go";
import { ChevronDown } from "lucide-react";
import Logout from "./Logout.jsx";
import { useSpinner } from "./LoadingContext.jsx";

function MainUI() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(undefined);
  const [selectTab, setSelectTab] = useState("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const pageNumber = useRef(1);
  const { isAuthenticated } = useAuth();
  const [fetch, setFetch] = useState(false);
  const { dispatch } = useSpinner();

  useEffect(() => {
    async function fetchRecipeOnMount() {
      try {
        dispatch({ type: "SET_SPINNER", payload: true });

        const result = await searchRecipes("Burgers", 1);
        dispatch({ type: "SET_SPINNER", payload: false });
        setRecipes(result.results);
        setFetch(true);

        pageNumber.current = 1;
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchRecipeOnMount();
  }, [dispatch]);

  useEffect(() => {
    async function fetchFavouriteRecipe() {
      try {
        const favourite = await getFavouriteRecipes();
        setFavouriteRecipes(favourite.results);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFavouriteRecipe();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  function inputHandler(event) {
    setSearch(event.target.value);
  }

  async function handleViewMore() {
    const nextPage = pageNumber.current + 1;
    try {
      dispatch({ type: "SET_SPINNER", payload: true });

      const nextRecipe = await searchRecipes(search, nextPage);
      setRecipes((prev) => [...prev, ...nextRecipe.results]);
      dispatch({ type: "SET_SPINNER", payload: false });
      pageNumber.current = nextPage;
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    try {
      dispatch({ type: "SET_SPINNER", payload: true });
      const result = await searchRecipes(search, 1);
      setRecipes(result.results);
      dispatch({ type: "SET_SPINNER", payload: false });
      setFetch(true);
      pageNumber.current = 1;
    } catch (error) {
      console.error(error.message);
    }
  }

  // function to add Favourite recipe
  async function addFavourite(recipe) {
    try {
      if (!isAuthenticated) {
        Navigate("/");
      }
      await addToFavourite(recipe);

      setFavouriteRecipes((prev) => {
        const upadatedFavourites = [...prev, recipe];

        localStorage.setItem(
          "favouriteRecipes",
          JSON.stringify(upadatedFavourites)
        );
        return upadatedFavourites;
      });
    } catch (error) {
      console.error(error);
    }
  }
  ////////////DELETE FAVOURITE//////////////////////////
  async function removeFavourite(recipe) {
    try {
      await removeFavouriteRecipe(recipe);

      const upadatedFavourites = favouriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      );

      setFavouriteRecipes(upadatedFavourites);
      localStorage.setItem(
        "favouriteRecipes",
        JSON.stringify(upadatedFavourites)
      );
    } catch (error) {
      console.error(error);
    }
  }

  // JSX
  return (
    <div>
      <div className=" flex flex-col  items-center w-100% min-h-[100dvh] bg-amber-50 ">
        <div
          className=" w-[90%] h-35 mt-5 rounded-2xl box-border  "
          style={{ backgroundImage: `url(${HeroImage})` }}
        >
          <div className="relative w-[100%]  h-[100%] rounded-2xl bg-[rgba(69,69,69,0.53)] flex flex-col  items-end">
            <Logout />
            <div className=" absolute top-1/2 transform -translate-y-1/2  self-center text-center text-amber-50 w-[90%]  text-l flex flex-col items-center leading-4.5 font-extrabold">
              Craving Something Delicious? Discover Recipes That Make You Feel
              at Home.
              <span className=" mt-1.5 rounded-[5px] px-1.5  bg-amber-500 text-[0.6rem] font-medium">
                {" "}
                Explore Recipes
              </span>
            </div>{" "}
          </div>
        </div>

        <div className="mt-2 text-xs flex flex-row w-[90%] cursor-pointer gap-2 ">
          <h1
            className={`${selectTab === "search" ? "border-b-2" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => setSelectTab("search")}
          >
            Recipe Search
          </h1>

          <h1
            className={`${selectTab === "favourite" ? "border-b-2" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => setSelectTab("favourite")}
          >
            Favourite
          </h1>
        </div>

        {selectTab === "search" && (
          <>
            {/* form and submit  */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex  rounded-[6px]  w-[90%] mt-2"
            >
              <input
                type="text"
                onChange={inputHandler}
                value={search}
                placeholder="Enter a search term"
                className="rounded-[5px] focus: w-[90%] h-[40px] bg-white"
                required
              />
              <button
                type="submit"
                className=" flex  justify-center items-center w-[10%]  rounded-[5px] h-[40px] bg-gray-200 transition duration-300 transform hover: scale-110 hover:bg-gray-100 "
              >
                <GoSearch className="w-[50%]" />
              </button>
            </form>

            {/* rendering search recipes */}
            <div className="  w-[90%]  flex flex-col md:flex-row items-center flex-wrap gap-6 justify-center ">
              {recipes.map((recipe) => {
                // if favouriteRecipeId = renderedSearchRecipeId then change text color of heartIcon
                const isFavourite = favouriteRecipes.some(
                  (favRecipe) => recipe.id === favRecipe.id
                );
                return (
                  <RecipeCard
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    image={recipe.image}
                    title={recipe.title}
                    onFavouriteButtonClick={() =>
                      isFavourite
                        ? removeFavourite(recipe)
                        : addFavourite(recipe)
                    }
                    isFavourite={isFavourite}
                  />
                );
              })}
            </div>
            <button
              onClick={handleViewMore}
              className="b gap-1  mt-3 flex rounded-[5px] hover:text-amber-400"
              disabled={!fetch}
            >
              View more
              <ChevronDown className=" mt-1 w-4 animate-bounce" />
            </button>
          </>
        )}

        {/* rendering favourite recipes */}
        {selectTab === "favourite" && (
          <div className="  w-[90%] flex flex-col md:flex-row items-center flex-wrap  gap-3 justify-center ">
            {favouriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                title={recipe.title}
                image={recipe.image}
                onClick={() => setSelectedRecipe(recipe)}
                onFavouriteButtonClick={() => removeFavourite(recipe)}
                isFavourite={true}
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
    </div>
  );
}
export default MainUI;
