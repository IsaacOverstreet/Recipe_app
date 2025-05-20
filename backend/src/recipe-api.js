import axios from "axios";
import env from "dotenv";

env.config();

// const apiKey = process.env.API_KEY
const headers = {
  "x-api-key": process.env.API_KEY,
};

export async function searchRecipes(searchTerm, page) {
  if (!headers["x-api-key"]) {
    throw new Error("invalid apiKey");
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

  const params = {
    query: searchTerm,
    number: "10",
    offset: page * 10,
  };

  try {
    const response = await axios.get(url, {
      params: params,
      headers: headers,
    });

    const result = response.data;

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecipeSummary(recipeId) {
  if (!headers["x-api-key"]) {
    throw new Error("invalid apiKey");
  }
  const url = new URL(
    `https://api.spoonacular.com/recipes/${recipeId}/summary`
  );

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getFavouriteRecipesById(ids) {
  if (!headers["x-api-key"]) {
    throw new Error("invalid apiKey");
  }
  const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
  const params = {
    ids: ids.join(","),
  };

  try {
    const searchResponse = await axios.get(url, {
      params: params,
      headers: headers,
    });

    const response = searchResponse.data;

    return { results: response };
  } catch (error) {
    console.error(error.response.data);
  }
}
