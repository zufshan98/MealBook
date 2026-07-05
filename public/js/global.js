"use strict";

import { fetchData } from "./api.js";

/**
 * Hamburger menu
 */

document.addEventListener("DOMContentLoaded", function() {
    const menu = document.getElementById("menu");
    const bars = document.querySelectorAll(".bar");
    const sidebar = document.getElementById("sidebar");
    const form_close = document.getElementById("#form_close");
    const save_recipe = document.getElementById("save_recipe_button");

    menu.addEventListener("click", function() {
        bars.forEach(bar => bar.classList.toggle("cross"));
        sidebar.classList.toggle("show"); // Toggle the visibility of the navigation menu
    });

    // Close the navigation menu when clicking outside of it
    document.addEventListener("click", function(event) {
        if ((!menu.contains(event.target) && !sidebar.contains(event.target)) && event.target.classList.contains("form_close")) {
            sidebar.classList.remove("show");
            bars.forEach(bar => bar.classList.remove("cross"));
        }
    });
});

/**
 * Add event on multiple elements
 * @param {NodeList} $elements NodeList
 * @param {String} eventType Event type string
 * @param {Function} callback Callback function
 */

window.addEventOnElements = ($elements, eventType, callback) => {
    for (const $element of $elements) {
        $element.addEventListener(eventType, callback);
    }
}

export const /** {Array} */ cardQueries = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"],
];

/** Skeleton card */
export const /** {String} */ $skeletonCard = `
    <div class="card skeleton-card">
        <div class="skeleton card-banner">
            <div class="card-body">
                <div class="skeleton card-title"></div>
                <div class="skeleton card-text"></div>
            </div>
        </div>
    </div>
`;

// function to fetch saved recipes from the backend
function fetchSavedRecipes(element, recipeId) { console.log(recipeId);
    fetch('/checkSavedRecipes', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({recipeId: recipeId})
    })
    .then(response => {
        if (response.status === 500) {
            throw new Error('Network error: ' + response.status);
        }
        return response.json();
    })
    .then(data => { console.log(data);

        // Handle the response data (e.g., display saved recipes on the UI)
        ACCESS_POINT = `${ROOT}/${recipeId}`;
        console.log(ACCESS_POINT);
        if (data.message === 'Recipe not found') {
            
            fetchData(cardQueries, function (data) { console.log(data);

                // to send recipes to the backend to save in the database
                fetch('/saveRecipeId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipeId: recipeId})
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network error: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle successful response from backend (if needed)
                    console.log("Recipe saved successfully");
                });
                element.classList.toggle("saved");
                element.classList.toggle("removed");
                showNotification("Added to Recipe book");
            }); 
            ACCESS_POINT = ROOT;
        } else {
            if (data.message === 'Recipe found') {
                // to delete recipes from the database
                    
                fetch('/deleteRecipeId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipeId: data.recipeId})
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network error: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle successful response from backend (if needed)
                    console.log("Recipe removed successfully");
                });
                element.classList.toggle("saved");
                element.classList.toggle("removed");
                showNotification("Removed from Recipe book");
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error
    });
}

const /** {String} */ ROOT = "https://api.edamam.com/api/recipes/v2";
window.saveRecipe = function (element, recipeId) {
     console.log(recipeId);
    fetchSavedRecipes(element, recipeId); /*window.localStorage.getItem(`mealbook-recipe${recipeId}`);*/  
}

const /** {NodeElement} */ $snackbarContainer = document.createElement("div");

$snackbarContainer.classList.add("snackbar-container");
document.body.appendChild($snackbarContainer);

function showNotification(message) {
    const /** {NodeElement} */ $snackbar =document.createElement("div");
    $snackbar.classList.add("snackbar");
    $snackbar.innerHTML = `<p class="body-medium">${message}</p>`;
    $snackbarContainer.appendChild($snackbar);
    $snackbar.addEventListener("animationend", e => $snackbarContainer.removeChild($snackbar));   
}




