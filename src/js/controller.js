import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2
// 91bede3d-a657-4b90-8789-ce7031225741

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async () => {
  try {
    // this cuts out the hash from the hash url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1) Rendering Spinner
    recipeView.renderSpinner();

    // 2) Updating results view to mark selected search result
    // It will also work with render
    resultsView.update(model.getSearchResultsPage());

    // 3) Updating the bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 4) Loading recipe
    await model.loadRecipe(id);

    // 5) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    // 1) Rendering Spinner
    resultsView.renderSpinner();

    // 2) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 3) Load search results
    await model.loadSearchResults(query);

    model.state.search.page = 1;

    // 4) Render results
    resultsView.render(model.getSearchResultsPage());

    // 5) Render initial pagination buttons
    paginationView.render(model.state.search);

    // 6) Add event listener to pagination buttons
    paginationView.addHandlerClick(() => {});
  } catch (err) {
    console.log(err);
    // recipeView.renderError();
  }
};

const controlPagination = goToPage => {
  // 1) Render new Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  // 1) Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.removeBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks2 = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    // render the spinner
    addRecipeView.renderSpinner();

    // Upload the recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // rendering the new recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL without reloading
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close the form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

// This runs as soon as the program starts
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks2);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
