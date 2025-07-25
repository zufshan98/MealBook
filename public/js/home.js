"use strict";

/** Import */
import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

/** 
 * Home page Search
*/
const /** {NodeElement} */ $searchField = document.querySelector("[data-search-field]");
const /** {NodeElement} */ $searchBtn = document.querySelector("[data-search-btn]");
$searchBtn.addEventListener("click", function () { 
    var searchedMeal = $searchField.value; 
    if ($searchField.value) window.location = `/recipes.html?q=${searchedMeal}`;
});

/**
 * Search submit when pressed "Enter" key
 */
$searchField.addEventListener("keydown", e => { if (e.key === "Enter") $searchBtn.click(); })

/**
 * Tab panel navigation
 */
const /**{NodeList} */ $tabBtns = document.querySelectorAll("[data-tab-btn]");
const /**{NodeList} */ $tabPanels = document.querySelectorAll("[data-tab-panel]");
let /** NodeElement */ [$lastActiveTabPanel] = $tabPanels;
let /** NodeElement */ [$lastActiveTabBtn] = $tabBtns;

addEventOnElements($tabBtns, "click", function () {
    $lastActiveTabPanel.setAttribute("hidden", "");
    $lastActiveTabBtn.setAttribute("aria-selected", false);
    $lastActiveTabBtn.setAttribute("tabindex", -1);
    const /** {NodeElement} */ $currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
    $currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", 0);
    $lastActiveTabPanel = $currentTabPanel;
    $lastActiveTabBtn = this;
    addTabContent(this, $currentTabPanel) 
});

/**
 * Navigate Tab with arrow key
 */
addEventOnElements($tabBtns, "keydown", function (e) {
    const /** {NodeElement} */ $nextElement = this.nextElementSibling;
    const /** {NodeElement} */ $previousElement = this.previousElementSibling;

    if (e.key === "ArrowRight" && $nextElement) {
        this.setAttribute("tabindex", -1);
        $nextElement.setAttribute("tabindex", 0);
        $nextElement.focus();
    } else if (e.key === "ArrowLeft" && $previousElement) {
        this.setAttribute("tabindex", -1);
        $previousElement.setAttribute("tabindex", 0);
        $previousElement.focus();
    } else if (e.key === "Tab") {
        this.setAttribute("tabindex", -1);
        $lastActiveTabBtn.setAttribute("tabindex", 0);
    }
});

/** 
 * WORK WITH API
 * fetch data for tab content
 */
const addTabContent = ($currentTabBtn, $currentTabPanel) => { 
    console.log($currentTabPanel);
    console.log($currentTabBtn);
    const $gridList = document.createElement("div");
    $gridList.classList.add("grid-list");

    fetchData([['mealType', $currentTabBtn.textContent.trim().toLowerCase()], ...cardQueries], function (data) { 
        console.log ($currentTabBtn.textContent.trim().toLowerCase());
        $currentTabPanel.innerHTML = "";

        const promises = [];

        for (let i = 0; i < Math.min(data.hits.length, 12); i++) {
            console.log("Creating card for index", i); // Log index for debugging
            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingTime,
                    uri
                }
            } = data.hits[i];

            const recipeId = uri.slice(uri.lastIndexOf("_") + 1);

            // Send request to check if recipe is saved
            const promise = fetch('/checkSavedRecipes', {
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
                const isSaved = data.success; console.log(isSaved)
                const $card = document.createElement("div");
                $card.classList.add("card");
                $card.style.animationDelay = `${100 * i}ms`;

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

                            <button class="icon-btn has-state ${isSaved ? "saved" : "removed"}" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
                                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                            </button>
                        </div>
                    </div>
                `;
                console.log($card);
                $gridList.appendChild($card);
                console.log($gridList);
            })
            .catch(error => {
                console.error('Error checking saved recipe:', error);
            });
            promises.push(promise);
        }
        
        Promise.all(promises).then(() => {
            // Append $gridList to $currentTabPanel after all cards are created
            $currentTabPanel.appendChild($gridList);
            console.log($currentTabPanel);
            $currentTabPanel.innerHTML += `
                <a href="./recipes.html?mealType=${$currentTabBtn.textContent.trim().toLowerCase()}" class="btn btn-secondary label-large has-state">Show more</a>
            `;
        });
    });
}

addTabContent($lastActiveTabBtn, $lastActiveTabPanel);

/** Fetch data for slider card */

let /** {Array} */ cuisineType = ["Asian", "French"];
const /** {NodeList} */ $sliderSections = document.querySelectorAll("[data-slider-section]");

for (const [index, $sliderSection] of $sliderSections.entries()) {
    $sliderSection.innerHTML = `
        <div class="container">
            <h2 class="section-title headline-small" id="slider-label-1"> Latest ${cuisineType[index]} Recipes</h2>

            <div class="slider">
                <ul class="slider-wrapper" data-slider-wrapper>
                    ${`<li class="slider-item">${$skeletonCard}</li>`.repeat(10)}
                </ul>
            </div>   
        </div>
    `;
    const /** {NodeElement} */ $sliderWrapper = $sliderSection.querySelector("[data-slider-wrapper]");
    fetchData([...cardQueries, ["cuisineType", cuisineType[index]]], function (data) {

        $sliderWrapper.innerHTML= "";
        const promises = [];

        data.hits.map(item => {
            const {
                recipe: {
                    image,
                    label: title,
                    totalTime: cookingTime,
                    uri
                }
            } = item;

            const /** {String} */ recipeId = uri.slice(uri.lastIndexOf("_") + 1);     
            // Send request to check if recipe is saved
            const promise = fetch('/checkSavedRecipes', {
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
                const isSaved = data.success; console.log(isSaved)
                const /** {NodeElement} */ $sliderItem = document.createElement("li");
                $sliderItem.classList.add("slider-item");

                $sliderItem.innerHTML = `
                    <div class="card">
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
                    </div>
                `;
                $sliderWrapper.appendChild($sliderItem);
            })
            .catch(error => {
                console.error('Error checking saved recipe:', error);
            });
            promises.push(promise);
        })

        Promise.all(promises).then(() => {
            $sliderWrapper.innerHTML += `
                <li class="slider-item" data-slider-item>
                    <a href="./recipes.html?cuisineType=${cuisineType[index].toLowerCase()}" class="load-more-card has-state">
                        <span class="label-large">Show more</span>
                        <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
                    </a>
                </li>
            `;
        });
    });       
}

