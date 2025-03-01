/* eslint-disable no-unused-vars */
import axios from "axios";

export async function searchRecipes(query, page) {
  const baseUrl = new URL("http://localhost:3000/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", query);
  baseUrl.searchParams.append("page", page);
  console.log("baseurl", baseUrl.href);
  try {
    const response = await axios.get(baseUrl.href);

    console.log("responseGotten", response.data);
    if (!response.data) {
      throw new Error(`HTTP error Status:${response.status}`);
    }
    const result = response.data;
    console.log("json", result);
    return result;
  } catch (error) {
    console.error("error fetching data", error.message);
  }
}

export async function getRecipeSummary(recipeId) {
  const url = new URL(`http://localhost:3000/api/recipes/${recipeId}/summary`);

  const response = await axios.get(url.href);
  console.log("res", response);
  if (!response.data) {
    throw new Error(`HTTP error status: ${response.status}`);
  }
  return response.data;
}

export async function getFavouriteRecipes() {
  const url = new URL("http://localhost:3000/api/recipes/favourite");
  const response = await axios.get(url.href);
  console.log("rexxx", response);
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

  console.log("body", body);
  const response = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.data) {
    throw new Error(`HTTPS status error: ${response.status}`);
  }
  console.log("res", response.data);
}
