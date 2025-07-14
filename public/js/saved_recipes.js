"use strict";

/** Import */

import { getTime } from "./module.js";
import { fetchData } from "./api.js";

const ROOT = "https://api.edamam.com/api/recipes/v2";


const /** {Array} */ cardQueries = [
    ["field", "uri"],
    ["field", "label"],
    ["field", "image"],
    ["field", "totalTime"],
];

// Make a POST request to the server to fetch saved recipe IDs
fetch('/fetchSavedRecipeIds', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({}) // No body needed since user ID is sent via token
})
.then(response => response.json())
.then(data => { console.log(data);
    const $savedRecipeContainer = document.querySelector("[data-saved-recipe-container]");
    $savedRecipeContainer.innerHTML = `<h2 class="headline-small section-title">All Saved Recipes</h2>`;
    const $gridList = document.createElement("div");
    $gridList.classList.add("grid-list");

    if(data.success === true) {  
        const savedRecipes = data.savedRecipes;
        console.log(savedRecipes); 
        savedRecipes.forEach((savedRecipe, index) => { 
            console.log(savedRecipe);
            ACCESS_POINT = `${ROOT}/${savedRecipe.recipe_id}`;
            console.log(ACCESS_POINT);
            // Fetch recipe details using the saved recipe ID
            fetchData(cardQueries, function (data) { 
                console.log(data);
                 // Loop through the fetched data and handle each recipe
                
                        const {
                            recipe: {
                                image,
                                label: title,
                                totalTime: cookingTime,
                                uri
                            }
                        } = data;
                        
                        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
                        ACCESS_POINT = ROOT; console.log(ACCESS_POINT);
                        // Send request to check if recipe is saved
                        fetch('/checkSavedRecipes', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ recipeId: recipeId })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const isSaved = data.success;
                            const $card = document.createElement("div");
                            $card.classList.add("card");
                            $card.style.animationDelay = `${100 * index}ms`;

                            $card.innerHTML = `
                                <figure class="card-media img-holder">
                                    <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
                                </figure>
                                <div class="card-body">
                                    <h3 class="title-small">
                                        <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
                                    </h3>
                                    <div class="meta-wrapper">
                                        <div class="meta-item">
                                            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                            <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>
                                        </div>
                                        <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" aria-label="Add to saved recipes" onclick="saveRecipe (this, '${recipeId}')">
                                            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                                        </button>
                                    </div>
                                </div>
                            `;

                            $gridList.appendChild($card);
                        })
                        .catch(error => {
                            console.error('Error checking saved recipe:', error);
                        });
                        
                
            });
        });
    } else {
        $savedRecipeContainer.innerHTML += `<p class="body-large">You haven't saved any recipes yet!</p>`
    }

    // Append the grid list after all promises are resolved
    $savedRecipeContainer.appendChild($gridList);
})
.catch(error => console.error('Error fetching saved recipe IDs:', error));


// Function to check authentication status
const checkAuthentication = () => {
    fetch('/auth', {
        method: 'GET',
       
    })
    
    .then(response => { 
    console.log(response);
    if (!response.ok) {
        // If response status is not 400 then throw an error
        throw new Error('Network error: ' + response.status);
    }
    return response.json();
    }) 
    .then(data => {
    if (data.success === false) { console.log(data);
        const savedRecipeContainer = document.querySelector(".saved-recipe-page");
        savedRecipeContainer.classList.add('hidden');
        const userEntry = document.querySelector(".user_entry");
        userEntry.classList.add('show'); 
    
    } else { console.log(data);
        if (data.authenticated) { 
        // User is authenticated
        const { username, email, user_id } = data; // Extract user information
        // Update HTML elements with user information
        document.querySelector('.data h2').innerText = username;
        document.querySelector('.data span').innerText = email;
        // Update the image element with the fetched user image
        fetch('/profile')
            .then(response => response.json())
            .then(data => { 
            document.querySelector('.profile-pic').src = data.profile_pic;
            });
        // Show the profile button and logout button
        viewProfile.style.display = "block";
        logout.style.display = "block";
        formOpenBtn.style.display = "none";
        
        } else {
        // User is not authenticated, show the login button
        viewProfile.style.display = "none";
        logout.style.display = "none";
        formOpenBtn.style.display = "block"; 
        
        }
    }
    })
    .catch(error => {
    console.error('Error:', error);
    // Handle error
    });
  };
  
  // Call checkAuthentication function when the page loads
  window.addEventListener('load', checkAuthentication);
  