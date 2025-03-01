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
        console.log("reci", recipe);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRecipeSummary();
  }, [recipeId]);

  if (!summaryRecipe) {
    return <></>;
  }

  return (
    <div>
      <div className="fixed bg-[rgb(0,0,0,0.7)] top-0 left-0 border-solid w-[100%] h-[100%] z-1 "></div>
      <div className=" border-solid  fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-2 shadow-md">
        <div className="bg-[white]  rounded-[5px] p-[2em] max-w-[500px]">
          <div className=" flex flex-row item-center space-between">
            <h2>{summaryRecipe.title}</h2>
            <span
              className="close-btn m-[30px] cursor-pointer"
              onClick={onClose}
            >
              &times;
            </span>
          </div>
          <p
            className="pt-[10px]"
            dangerouslySetInnerHTML={{ __html: summaryRecipe.summary }}
          ></p>
        </div>
      </div>
    </div>
  );
};
export default RecipeModal;
