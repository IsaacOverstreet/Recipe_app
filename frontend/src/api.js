/* eslint-disable no-unused-vars */
import axios from "axios";

export async function searchRecipes(query, page) {
  const baseUrl = new URL("http://localhost:3000/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", query);
  baseUrl.searchParams.append("page", page);

  try {
    const response = await axios.get(baseUrl.href, {
      withCredentials: true, // Include cookies (session data)
    });

    if (!response.data) {
      throw new Error(`HTTP error Status:${response.status}`);
    }
    const result = response.data;

    return result;
  } catch (error) {
    console.error("error fetching data", error.message);
  }
}

export async function getRecipeSummary(recipeId) {
  const url = new URL(`http://localhost:3000/api/recipes/${recipeId}/summary`);

  const response = await axios.get(url.href, {
    withCredentials: true, // Include cookies (session data)
  });

  if (!response.data) {
    throw new Error(`HTTP error status: ${response.status}`);
  }
  return response.data;
}

export async function getFavouriteRecipes() {
  const url = new URL("http://localhost:3000/api/recipes/favourite");
  const response = await axios.get(url.href, {
    withCredentials: true, // Include cookies (session data)
  });

  if (!response.data) {
    throw new Error(`HTTPS status error: ${response.status}`);
  }
  return response.data;
}

export async function addToFavourite(recipe) {
  const url = new URL("http://localhost:3000/api/recipes/favourite");
  const body = {
    recipeId: recipe.id,
  };

  const response = await axios.post(url, body, {
    withCredentials: true, // Include cookies (session data)
  });

  if (!response.data) {
    throw new Error(`HTTPS status error: ${response.status}`);
  }
}

export async function removeFavouriteRecipe(recipe) {
  const url = new URL("http://localhost:3000/api/recipes/favourite");
  const body = { recipeId: recipe.id };

  const response = await axios.delete(url, {
    data: body,
    withCredentials: true,
  });

  if (response.status !== 204) {
    throw new Error(`HTTPS status error: ${response.status}`);
  }
}
