/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getRecipeSummary } from "../api.js";

const RecipeModal = ({ recipeId, onClose }) => {
  const [summaryRecipe, setSummaryRecipe] = useState();

  useEffect(() => {
    async function fetchRecipeSummary() {
      try {
        const recipe = await getRecipeSummary(recipeId);
        setSummaryRecipe(recipe);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRecipeSummary();
  }, [recipeId]);

  if (!summaryRecipe) {
    return <></>;
  }

  return (
    <div>
      <div className="fixed bg-[rgb(0,0,0,0.7)] top-0 left-0  w-[100%] h-[100%] z-1 "></div>
      <div className="  w-[90%] flex justify-center fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-2 shadow-md">
        <div className="bg-[white]  rounded-[5px] p-[1em]  max-w-[500px]">
          <div className=" flex relative  justify-between  item-center mb-2 ">
            <h2 className="font-extrabold  border-b-2 break-words whitespace-normal flex">
              {summaryRecipe.title}
            </h2>
            <span
              className="close-btn cursor-pointer  absolute top-0 text-center right-0 bg-amber-500 hover:bg-amber-200  text-white w-[10%] rounded "
              onClick={onClose}
            >
              &times;
            </span>
          </div>
          <p
            className=" text-sm  md:text-lg"
            dangerouslySetInnerHTML={{ __html: summaryRecipe.summary }}
          ></p>
        </div>
      </div>
    </div>
  );
};
export default RecipeModal;
