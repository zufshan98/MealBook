"use strict";

/** Import */

import { getTime } from "./module.js";
import { fetchData } from "./api.js";


const overlay = document.querySelector(".overlay");

/** function to clear the meal plan cells whenever the date range is updated  */
function clearMealPlanCells() {
    const table = document.querySelector('.meal-plan-table');
    const cells = table.querySelectorAll('.meal');
    cells.forEach(cell => {
        cell.innerHTML = ''; // Clear the content of each cell
    });
}

/** Function to update the cell Id */
function updateCellId () {
    const table = document.querySelector('.meal-plan-table');
    const headers = table.querySelectorAll('thead th'); // Header cells with days
    const rows = table.querySelectorAll('tbody tr'); // Meal rows
    //console.log("Rows",rows);
    rows.forEach(row => {
        const mealType = row.querySelector('.meal-time').textContent.trim().toLowerCase(); // Get the meal type
        const cells = row.querySelectorAll('.meal');
        //console.log(mealType);
        //console.log(cells);
        cells.forEach((cell, index) => { 
            //console.log(cell);
            const dayHeader = headers[index + 1]; // Skip the first header cell which is empty
            const date = dayHeader.dataset.date; // Assume you have the date stored in a data attribute
            //console.log("date of header", date);
            // Split the date string to extract 'YYYY-MM-DD'
            const dateParts = date.split(' ');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[3]}`;
            //console.log("DATE",date);
            if (formattedDate) {
                cell.id = `${mealType}-${formattedDate}`; // Assign ID to the cell
                console.log("ID OF CELL", cell.id);
            }
        });
    });

    // Call displaySavedRecipes function 
    fetch('/getDates', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => { 
        const mealplans = data.mealplan; 
        mealplans.forEach(mealplan => {
            const mealDate = mealplan.date;
            console.log("MEALDATE", mealDate);
            displaySavedRecipes(mealDate);
        });
    })
    .catch(err => { console.log(err); });
}


/** Function to fetch and display the current date range */
function getDate() {
    // to fetch dates and time
    const datePickerElement = document.getElementById("date-picker");
    const prevWeekButton = document.getElementById("prev-week");
    const nextWeekButton = document.getElementById("next-week");
  
    let currentDate = new Date(); 
  
    function updateDateRange() {
        clearMealPlanCells(); // clear the meal plan cells
        const startOfWeek = new Date(currentDate); 
        // Adjust to start from Monday, and handle Sunday (getDay() returns 0 for Sunday)
        if (currentDate.getDay() === 0) {
            startOfWeek.setDate(currentDate.getDate() - 6);
        } else {
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        }
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
  
        datePickerElement.value = `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
       
        // Update table headers with dates and names of the days
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayElements = [
          document.getElementById('monday'),
          document.getElementById('tuesday'),
          document.getElementById('wednesday'),
          document.getElementById('thursday'),
          document.getElementById('friday'),
          document.getElementById('saturday'),
          document.getElementById('sunday')
        ];
  
        let currentDay = new Date(startOfWeek); 

        const today = new Date(); 
        today.setHours(0, 0, 0, 0); // Normalize today's date for comparison
    
        for (let i = 0; i < 7; i++) {
            dayElements[i].innerText = `${currentDay.getDate()}/${currentDay.getMonth() + 1} ${days[currentDay.getDay()]}`;
            //console.log(dayElements[i].innerText);
            // Set data-date attribute with ISO date string
            dayElements[i].dataset.date = currentDay;
            // Remove any existing highlight class
            dayElements[i].classList.remove('highlight');
            // Normalize currentDay to midnight
            currentDay.setHours(0, 0, 0, 0);
            // Add highlight class if it matches today's date
            if (currentDay.getTime() === today.getTime()) {
                dayElements[i].classList.add('highlight');
            }

            currentDay.setDate(currentDay.getDate() + 1);
        }
    }
  
    prevWeekButton.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateDateRange();
        // update the cell id
        updateCellId();
        displaySavedRecipes(datePickerElement.value);
    });
  
    nextWeekButton.addEventListener("click", () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateDateRange();
        // update the cell id
        updateCellId();
        displaySavedRecipes(datePickerElement.value);
    });
  
    const fp = flatpickr(datePickerElement, {
        onChange: function (selectedDates) {
            if (selectedDates.length > 0) {
                currentDate = selectedDates[0];
                updateDateRange();
                // update the cell id
                updateCellId();
                displaySavedRecipes(datePickerElement.value);
            }
        }
    });
  
    datePickerElement.addEventListener("click", () => {
        fp.open();
    });
  
    updateDateRange();
} 

/** Function to open popup-box when double-clicked in the meal cell */
function openPopUpBox() {
    // Double-click event listener for meal cells
    const mealCells = document.querySelectorAll('.meal');
    mealCells.forEach(cell => { 
        cell.addEventListener('dblclick', async () => {
            overlay.classList.add("active");
            
            const mealTime =cell.parentElement.querySelector('.meal-time'); console.log(mealTime);
            // Gets the double-clicked cell's meal name and the panel related to it            const mealTime = cell.parentElement.querySelector('.meal-time');
            console.log("MEAL TIME:", mealTime.textContent.toLowerCase());
            console.log("PANEL NAME:", mealTime.getAttribute("aria-controls"));
            
             // Search submit when pressed "Enter" key
            /*const searchField = document.querySelector("search-field");
            searchField.addEventListener("keydown", e => {
                if (e.key === "Enter") $searchBtn.click();
            })*/
            
            // Create and display the box
            const mealBox = document.querySelector('.meal-box');
            mealBox.style.display = 'block';

            const savedRecipesBtn = document.getElementById("tab-6");
            const tabPanels = document.querySelectorAll("[data-tab-panel]"); 

            const dropdownButton = document.getElementById('dropdown-button');
            const mealSelect = document.getElementById('meal-select');
            const selectedMeal = document.getElementById('selected-meal');
            const options = document.querySelectorAll('.meal-option');
            const dropdownContainer = document.querySelector('.dropdown-container');

            // to get the text or name of the selected meal being displayed 
            var selectedMealText = selectedMeal.textContent.toLowerCase(); 
            console.log("selected-meal",selectedMealText);
            // For the selected item to highlight
            dropdownContainer.classList.add("selected");

            // To open the dropdown menu
            dropdownButton.addEventListener('click', () => {
            dropdownButton.setAttribute('hidden', false);
            mealSelect.classList.add('visible');
            });

            //To close the dropdown menu
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown-container')) {
                    dropdownButton.setAttribute('hidden', true);
                    mealSelect.classList.remove('visible');
                }
            });

            //function to handle the panel accordingly
            function updateTabPanel(panelId, mealType) { 
                tabPanels.forEach(panel => { 
                    if (panel.id === panelId) { console.log("panelId:", panelId);
                        panel.removeAttribute("hidden");
                        addTabContent(panel, mealType);
                    } else {
                        panel.setAttribute("hidden", "true");
                    }
                });
            }

            // when clicked on button displaying the selected meal option
            selectedMeal.addEventListener("click", () => {
                //to update the selected meal text
                selectedMealText = selectedMeal.textContent.toLowerCase();
                console.log("selected-meal:", selectedMealText);
                // to connect the text of selected meal and the meal name in the dropdoen menu
                options.forEach((option) => { console.log(option);
                    const mealOptionText = option.textContent.toLowerCase(); // to get the name of the meal selected from dropdown

                    if(mealOptionText === selectedMealText) {
                        console.log("mealOptionText:", mealOptionText);
                        console.log("selectedMealText:", selectedMealText);
                        console.log("mealOptionText === selectedMealText:", mealOptionText === selectedMealText);
                        updateTabPanel(option.getAttribute("aria-controls"), selectedMealText); // to get the panel of the selected meal
                    }
                });
                dropdownContainer.classList.add("selected");
                savedRecipesBtn.classList.remove("selected");   
            });

            // To select the meal from the dropdown
            options.forEach(option => {
                option.addEventListener('click', () => {
                    
                    selectedMeal.textContent = option.textContent; // to display the meal selected from dropdown
                    selectedMealText = option.textContent.toLowerCase(); // update the selected meal text
                    console.log("selectedMealText:", selectedMealText);

                    updateTabPanel(option.getAttribute("aria-controls"), selectedMealText);
                    console.log(option.getAttribute("aria-controls"));

                    dropdownButton.setAttribute('aria-expanded', false);
                    mealSelect.classList.remove('visible');
                    dropdownContainer.classList.add("selected");
                });
            });

            savedRecipesBtn.addEventListener("click", () => {
                updateTabPanel(savedRecipesBtn.getAttribute("aria-controls"));
                savedRecipesBtn.classList.add("selected");
                dropdownContainer.classList.remove("selected");
            });

            // Show the double clicked cell's panel by default when the popup box opens
            updateTabPanel(mealTime.getAttribute("aria-controls"), mealTime.textContent.toLowerCase());
            selectedMeal.textContent = mealTime.textContent;

            // Close the meal box on click outside
            document.getElementById('close-popup').addEventListener('click', closeMealBox);
            function closeMealBox(event) {  
                savedRecipesBtn.classList.remove('selected');
                selectedMeal.textContent = "Breakfast";
                mealBox.style.display = 'none';
                overlay.classList.remove("active");
                document.removeEventListener('click', closeMealBox);
                
            }

            // function to add recipes to the cells
            function addRecipetoCell(element, recipeId) { console.log(recipeId);

                ACCESS_POINT = `${ROOT}/${recipeId}`;
                    console.log(ACCESS_POINT);
                    // Fetch recipe details using the saved recipe ID
                    fetchData(cardQueries, function (data) { 
                        console.log(data);
                        // Loop through the fetched data and handle each recipe
                        
                        const {
                            recipe: {
                                label: title,
                                calories = 0,
                                uri
                            }
                        } = data;
                        
                        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
                        ACCESS_POINT = ROOT; console.log(ACCESS_POINT);
                        
                        const addedMealCard = document.createElement("div");
                        addedMealCard.classList.add("card", "added-meal");

                        addedMealCard.innerHTML = `
                            <div class="card-body">
                                <h3 class=" meal-title title-small">
                                    <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
                                </h3>
                                <div class="meta-wrapper">
                                    <div class="meta-item">
                                        <span class="material-symbols-outlined" style="font-size: 15px;">local_fire_department</span>
                                        <span class="label-small" style="font-size: 13px;">${Math.floor(calories)} kcal</span>
                                    </div>
                                </div>
                            </div>

                            <div class="delete-recipe" onClick="removeMealCard(this, '${recipeId}')">
                                <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                            </div>
                        `;
                        cell.appendChild(addedMealCard);  
                        
                        function removeMealCardFromCell(element, recipeId) {
                            console.log(recipeId);
                            console.log(addedMealCard);
                            const card = element.closest('.added-meal');
                            if (card) {
                                card.remove();
                            }
                        }
                        // to remove the meal card from the cell when clicking on delete
                        window.removeMealCard = function(element, recipeId) { 
                            console.log(element);
                            removeMealCardFromCell(element, recipeId);
                        }
                    });

                element.classList.toggle('added');
                element.classList.toggle('removed');
            }

            window.addRecipe = function (element, recipeId) {
                console.log(element, recipeId);
               addRecipetoCell(element, recipeId);   
            }   
        });
    });
}

/** 
 * Fetching data from API to populate the meal options 
 * */

const ROOT = "https://api.edamam.com/api/recipes/v2";

    const /** {Array} */ cardQueries = [
        ["field", "uri"],
        ["field", "label"],
        ["field", "calories"],
        ["field", "image"],
        ["field", "ingredients"],
        ["field", "ingredientLines"],
    ];

/** Skeleton card */

const /** {String} */ skeletonCard = `
    <div class="card skeleton-card">

        <div class="skeleton card-banners">

            <div class="card-body">
                <div class="skeleton card-title"></div>

                <div class="skeleton card-text"></div>
            </div>
        </div>
        <div class="card-body">
                <div class="skeleton card-title"></div>

                <div class="skeleton card-text"></div>
            </div>
    </div>
`;
const addTabContent = (panel, mealType) => { console.log("meal-type:", mealType); 

    if (panel.id === 'panel-6') {
        /** for saved recipes panel */ 
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
            
            const mealList = document.createElement("div");
            mealList.classList.add("meal-list");

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
                                calories = 0,
                                uri
                            }
                        } = data;
                        
                        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
                        ACCESS_POINT = ROOT; console.log(ACCESS_POINT);
                        
                        const card = document.createElement("div");
                        card.classList.add("card");
                        card.style.animationDelay = `${100 * index}ms`;

                        card.innerHTML = `
                            <figure class="card-media img-holder">
                                <img src="${image}" width="60" height="60" loading="lazy" alt="${title}" class="img-cover">
                            </figure>

                            <div class="card-body">
                                <h3 class="title-small">
                                    <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
                                </h3>

                                <div class="meta-wrapper">
                                    <div class="meta-item">
                                        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                        <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>

                                        <span class="material-symbols-outlined">local_fire_department</span>
                                        <span class="label-medium">${Math.floor(calories)} calories</span>
                                    </div>
                                </div>
                            </div>

                            <div class="add-recipe" onclick="addRecipe(this, '${recipeId}')">
                                <span class="material-symbols-outlined add_box">add_box</span>
                                <span class="material-symbols-outlined check_box hidden">check_box</span>
                                <span class="label-medium add_text">Add</span>
                                <span class="label-medium done_text hidden">Done</span>
                            </div>
                        `;

                        mealList.appendChild(card);   
                    });
                });
            } else {
                panel.innerHTML += `<p class="body-large">You haven't saved any recipes yet!</p>`
            }

            // Append the meal list after all promises are resolved
            panel.appendChild(mealList);
        })
        .catch(error => console.error('Error fetching saved recipe IDs:', error));
    }

    else {
        /** for dropdown menu options */
        const mealList = document.querySelector(".meal-list");
        mealList.innerHTML = skeletonCard.repeat(20); 

        const loadRecipe = document.createElement("div");
        loadRecipe.classList.add("load-recipe");

        // Initialize nextPageUrl to an empty string
        let /** {String} */ nextPageUrl = "";

        panel.innerHTML = "";
        panel.appendChild(mealList);
        // Function to render recipes from data
        const renderRecipe = data => {
            data.hits.map((item, index) => {
                // Destructure relevant data from each item
                const {
                    recipe: {
                        image,
                        label: title,
                        totalTime: cookingTime,
                        calories = 0,
                        uri
                    }
                } = item;

                const /** {String} */ recipeId = uri.slice(uri.lastIndexOf("_") + 1);

                // Create a new card element for the recipe
                const card = document.createElement("li");
                card.classList.add("card");
                card.style.animationDelay = `${100 * index}ms`;

                card.innerHTML = `
                    <figure class="card-media img-holder">
                        <img src="${image}" width="75" height="60" loading="lazy" alt="${title}" class="img-cover">
                    </figure>

                    <div class="card-body">
                        <h3 class="title-small" style="font-size: 15px; line-height: 20px;">
                            <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
                        </h3>

                        <div class="meta-wrapper">
                            <div class="meta-item">
                                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                <span class="label-medium" style="font-size: 13px">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>

                                <span class="material-symbols-outlined">local_fire_department</span>
                                <span class="label-medium" style="font-size: 13px">${Math.floor(calories)} calories</span>
                            </div>
                        </div>
                    </div>

                    <div class="add-recipe" onclick="addRecipe(this, '${recipeId}')">
                        <span class="material-symbols-outlined add_box">add_box</span>
                        <span class="material-symbols-outlined check_box hidden">check_box</span>
                        <span class="label-medium add_text">Add</span>
                        <span class="label-medium done_text hidden">Done</span>
                    </div>
                `;
                // Append the new card to the grid list  
                mealList.appendChild(card);
            });   
            // Append the loadRecipe element to the mealList
            mealList.appendChild(loadRecipe);
            console.log(mealList);
        }

        // Variable to keep track if a request has been made before
        let /** {Boolean} */ requestedBefore = true;

        // Fetch data using the provided or default queries
        fetchData([['mealType', mealType], ...cardQueries], function (data) { 
            console.log(data);
            console.log(mealType);

            const { _links: { next } } = data;
            nextPageUrl = next?.href;
            // set requestedBefore to false
            requestedBefore = false;
            // Clear skeleton cards
            mealList.innerHTML = "";

            if (data.hits.length) {
                renderRecipe(data); // Render the recipes if there are any hits
            } else {
                loadRecipe.innerHTML = `<p class="body-medium info-text">No recipe found</p>`;
            }
        });

        // Define constants for container width and maximum number of cards
        const CONTAINER_MAX_WIDTH = 1200;
        const CONTAINER_MAX_CARD = 6;

        // Add an event listener for the scroll event
        mealList.addEventListener("scroll", async e => { 
            if(loadRecipe.getBoundingClientRect().top < window.innerHeight && !requestedBefore && nextPageUrl) {
                // Show loading skeleton cards while fetching new data
                loadRecipe.innerHTML = skeletonCard.repeat(Math.round((loadRecipe.clientWidth / (CONTAINER_MAX_WIDTH)) * CONTAINER_MAX_CARD));
                
                requestedBefore = true;
                console.log("Fetching next set of recipes...");
                
                // Fetch the next page of data
                const /** {Promise} */ response = await fetch(nextPageUrl);
                const /** {Object} */ data = await response.json();
    
                const { _links: { next } } = data;
                nextPageUrl = next?.href;
    
                renderRecipe(data); // Render the new recipes
                loadRecipe.innerHTML = "";
                requestedBefore = false;
    
                if (!nextPageUrl) {
                    loadRecipe.innerHTML = `<p class="body-medium info-text">No more recipes</p>`;
                }  
            }
        });
    }
}


/** to save the meal plan  */

const saveMealPlan = document.querySelector(".save-mealplan");
saveMealPlan.addEventListener("click", () => {
    const table = document.querySelector('.meal-plan-table');
    const headers = table.querySelectorAll('thead th'); // Header cells with days
    const rows = table.querySelectorAll('tbody tr'); // Meal rows

    rows.forEach(row => {
        const mealType = row.querySelector('.meal-time').textContent.trim(); // Get the meal type
        const cells = row.querySelectorAll('.meal');

        cells.forEach((cell, index) => { 
            const dayHeader = headers[index + 1]; // Skip the first header cell which is empty
            const date = dayHeader.dataset.date.substring(0, 15).trim(); // Get the date from the header
            console.log("after split",date);
            const recipeCards = cell.querySelectorAll('.card');

            recipeCards.forEach(card => {
                const recipeLink = card.querySelector('.card-link');
                const recipeId = new URLSearchParams(recipeLink.href.split('?')[1]).get('recipe');

                // Check if the recipe is already saved for the date
                fetch('./checkRecipeExists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ date, mealType, recipeId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.exists) {
                        console.log('Recipe already saved for this date:', result);
                    } else {
                        // If the recipe is not already saved, proceed to save it
                        const mealPlanData = {
                            date,
                            mealType,
                            recipeId
                        };

                        // Send data to the server to save the meal plan
                        fetch('./saveMealPlans', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(mealPlanData)
                        })
                        .then(response => response.json())
                        .then(result => {
                            if (result.error) {
                                console.error('Error saving meal plan:', result.error);
                            } else {
                                showModal()
                                overlay.classList.add("active");
                                console.log('Meal saved successfully');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error checking if recipe exists:', error);
                });
            });
        });
    });   
});

/** to edit meal plan */
const editMealPlan = document.querySelector(".edit-mealplan");
editMealPlan.addEventListener("click", () => {
    const table = document.querySelector('.meal-plan-table');
    const headers = table.querySelectorAll('thead th'); // Header cells with days
    const rows = table.querySelectorAll('tbody tr'); // Meal rows
    //console.log("Rows",rows);
    rows.forEach(row => {
        const mealType = row.querySelector('.meal-time').textContent.trim().toLowerCase(); // Get the meal type
        const cells = row.querySelectorAll('.meal');
        //console.log(mealType);
        //console.log(cells);
        cells.forEach((cell, index) => { 
            //console.log(cell);
            const dayHeader = headers[index + 1]; // Skip the first header cell which is empty
            const date = dayHeader.dataset.date; // Assume you have the date stored in a data attribute
            //console.log("date of header", date);
            // Split the date string to extract 'YYYY-MM-DD'
            const dateParts = date.split(' ');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[3]}`;
            //console.log("DATE",date);
            if (formattedDate) {
                cell.id = `${mealType}-${formattedDate}`; // Assign ID to the cell
                console.log("ID OF CELL", cell.id);
            }
        });
    });

    // Call displaySavedRecipes function 
    fetch('/getDates', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => { 
        const mealplans = data.mealplan; 
        mealplans.forEach(mealplan => {
            const mealDate = mealplan.date;
            console.log("MEALDATE", mealDate);
            displaySavedRecipes(mealDate);
        });
    })
    .catch(err => { console.log(err); });

    // Function to fetch and display saved recipes for the specified date
    function displaySavedRecipes(date) {
        // Clear existing recipes before displaying new ones
        clearMealPlanCells();
        // Fetch meal plan data for the specified date from the database
        fetch('./getRecipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: date })
        })
        .then(response => response.json())
        .then(data => { 
            const mealRecipes = data.mealPlanRecipes; console.log("meal recipe fetched from database", mealRecipes);
            // Populate table cells with fetched recipe data
            mealRecipes.forEach(mealRecipe => { console.log(mealRecipe);
            const mealType = mealRecipe.meal_type.toLowerCase();
            const recipeId = mealRecipe.recipe_id;
            const date = mealRecipe.date;
            // Split the date string to extract 'YYYY-MM-DD'
            const dateParts = date.split(' ');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[3]}`;
            console.log(mealType,recipeId,formattedDate);
    
            // Get the cell corresponding to the meal type and date
            const cell = document.getElementById(`${mealType}-${formattedDate}`);
            console.log(cell);
    
            // Display the recipe in the corresponding cell
            if (cell) {

                ACCESS_POINT = `${ROOT}/${recipeId}`;
                console.log(ACCESS_POINT);
                // Fetch recipe details using the saved recipe ID
                fetchData(cardQueries, function (data) { 
                    console.log(data);
                    // Loop through the fetched data and handle each recipe
                    
                    const {
                        recipe: {
                            label: title,
                            calories = 0,
                            uri
                        }
                    } = data;
                    
                    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
                    ACCESS_POINT = ROOT; console.log(ACCESS_POINT);
                    
                    const addedMealCard = document.createElement("div");
                    addedMealCard.classList.add("card", "added-meal");

                    addedMealCard.innerHTML = `
                        <div class="card-body">
                            <h3 class=" meal-title title-small">
                                <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
                            </h3>
                            <div class="meta-wrapper">
                                <div class="meta-item">
                                    <span class="material-symbols-outlined" style="font-size: 15px;">local_fire_department</span>
                                    <span class="label-small" style="font-size: 13px;">${Math.floor(calories)} kcal</span>
                                </div>
                            </div>
                        </div>
                        <div class="delete-recipe" onClick="removeMealCard(this, '${recipeId}')">
                            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                        </div>
                    `;
                    cell.appendChild(addedMealCard);  

                    function removeMealCardFromCell(element, recipeId) {
                        console.log(recipeId);
                        console.log(addedMealCard);
                        const card = element.closest('.added-meal');
                        if (card) {
                            card.remove();
                        }
                        deleteMeal(recipeId);
                    }
                    
                    // to remove the meal card from the database 
                    function deleteMeal(recipeId) {
                        fetch('./deleteMeal', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ recipeId: recipeId })
                        })
                        .then(response => response.json())
                        .then(result => {
                            if (result.error) {
                                console.error('Error deleting meal:', result.error);
                            } else {
                                console.log('Meal deleted successfully');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    }

                    // to remove the meal card from the cell when clicking on delete
                    window.removeMealCard = function(element, recipeId) { 
                        console.log(element);
                        removeMealCardFromCell(element, recipeId);
                    }
                });
            }
            });
        })
        .catch(err => { console.log(err);});
    }
});


// Function to fetch and display saved recipes for the specified date
function displaySavedRecipes(date) {
    // Clear existing recipes before displaying new ones
    clearMealPlanCells();
    // Fetch meal plan data for the specified date from the database
    fetch('./getRecipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: date })
    })
    .then(response => response.json())
    .then(data => { 
      const mealRecipes = data.mealPlanRecipes; console.log("meal recipe fetched from database", mealRecipes);
      // Populate table cells with fetched recipe data
      mealRecipes.forEach(mealRecipe => { console.log(mealRecipe);
        const mealType = mealRecipe.meal_type.toLowerCase();
        const recipeId = mealRecipe.recipe_id;
        const date = mealRecipe.date;
        // Split the date string to extract 'YYYY-MM-DD'
        const dateParts = date.split(' ');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[3]}`;
        console.log(mealType,recipeId,formattedDate);
  
        // Get the cell corresponding to the meal type and date
        const cell = document.getElementById(`${mealType}-${formattedDate}`);
        console.log(cell);
  
        // Display the recipe in the corresponding cell
        if (cell) {
          //cell.innerText = recipeName;
          // to add saved recipes to the cells when the window loads

            ACCESS_POINT = `${ROOT}/${recipeId}`;
            console.log(ACCESS_POINT);
            // Fetch recipe details using the saved recipe ID
            fetchData(cardQueries, function (data) { 
                console.log(data);
                // Loop through the fetched data and handle each recipe
                
                const {
                    recipe: {
                        label: title,
                        calories = 0,
                        uri
                    }
                } = data;
                
                const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
                ACCESS_POINT = ROOT; console.log(ACCESS_POINT);
                
                const addedMealCard = document.createElement("div");
                addedMealCard.classList.add("card", "added-meal");

                addedMealCard.innerHTML = `
                    <div class="card-body">
                        <h3 class=" meal-title title-small">
                            <a href="./detail.html?recipe=${recipeId}" class="card-link">${title ?? "Untitled"}</a>
                        </h3>
                        <div class="meta-wrapper">
                            <div class="meta-item">
                                <span class="material-symbols-outlined" style="font-size: 15px;">local_fire_department</span>
                                <span class="label-small" style="font-size: 13px;">${Math.floor(calories)} kcal</span>
                            </div>
                        </div>
                    </div>
                `;
                cell.appendChild(addedMealCard);  
            });
        }
      });
    })
    .catch(err => { console.log(err);});
  }

/** Main eventlistener */
document.addEventListener("DOMContentLoaded", () => {

    getDate();

    updateCellId();

    openPopUpBox();
});

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
        const mealPlan = document.querySelector(".meal-plan");
        mealPlan.classList.add('hidden');
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
        //viewProfile.style.display = "block";
        //logout.style.display = "block";
        //formOpenBtn.style.display = "none";
        
        } else {
        // User is not authenticated, show the login button
        //viewProfile.style.display = "none";
        //logout.style.display = "none";
        //formOpenBtn.style.display = "block"; 
        
        }
    }
    })
    .catch(error => {
    console.error('Error:', error);
    // Handle error
    });
  };
  

  /**
   * POP_UP MODAL BOX
   */

// Get the modal
const modal = document.getElementById("myModal");

// Get the close button element inside the modal
const closeModal = modal.querySelector(".continue-btn");

// Function to show the modal
function showModal() {
  modal.style.display = "block";
}

// Function to close the modal when the close button is clicked
closeModal.onclick = function () {
  modal.style.display = "none";
  overlay.classList.remove("active");
  window.location.href = 'mealplan.html';
};
  
/** To generate shopping list and print */

document.addEventListener('DOMContentLoaded', () => {
    const printButton = document.getElementById('print');

    printButton.addEventListener('click', () => {
        const shoppingList = document.querySelector('.shoppinglist');
        const originalContent = document.body.innerHTML;

        // Hide other content
        document.body.innerHTML = shoppingList.outerHTML;
        const titleWrapper = document.querySelector('.title-wrapper');
        titleWrapper.style.display = "none";
        printButton.textContent = "";

        // Print the shopping list
        window.print();

        // Restore original content
        document.body.innerHTML = originalContent;

        // Reattach the event listeners
        attachEventListeners();
    });

    function attachEventListeners() {
        // to generate the shopping list
        const shoppingList = document.querySelector('.shopping-list');

        shoppingList.addEventListener('click', () => {
            const listContainer = document.querySelector('.shoppinglist');
            listContainer.style.display = "block";
            overlay.classList.add("active");

            const bodyOverflow = document.body.style.overflow;
            document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";

            console.log("Shopping list clicked");
            const table = document.querySelector('.meal-plan-table');
            const headers = table.querySelectorAll('thead th'); // Header cells with days
            console.log(headers);

            // Convert headers NodeList to an array and skip the first header cell
            Array.from(headers).slice(1).forEach((header, index) => { 
                // Get the date from the data-date attribute and format it
                const date = header.dataset.date.substring(0, 15).trim(); // Assume you have the date stored in a data attribute
                console.log(date);
                fetch('/getMealPlanId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ date: date })
                })
                .then(response => response.json())
                .then(data => {  console.log(data);
                    if(data.success === true) {
                        const recipeIds = data.results;
                        recipeIds.forEach((recipeId, index) => { 
                            const recipeid = recipeId.recipe_id;
                            console.log(recipeid);

                            ACCESS_POINT = `${ROOT}/${recipeid}`;
                            fetchData(cardQueries, function (data) { 
                                console.log(data);
                                // Loop through the fetched data and handle each recipe

                                const {
                                    ingredients = [],
                                    ingredientLines = [],
                                    uri
                                } = data.recipe;
                                console.log(data.recipe);

                                ACCESS_POINT = ROOT; console.log(ACCESS_POINT);

                                const shoppingList = document.querySelector('.shoppinglist');
                                console.log(shoppingList);

                                const ingredientlist = document.createElement("div");
                                ingredientlist.classList.add("ingredientlist-container");
                                console.log(ingredientlist);
                                shoppingList.appendChild(ingredientlist);
                                console.log(shoppingList);
                                let /** {String} */ ingredientItems = "";
                                ingredientLines.map(ingredient => {console.log(ingredient);
                                    ingredientItems += `
                                        <div class="ingrd-item">${ingredient}</div>
                                    `;
                                    console.log(ingredientItems);

                                    ingredientlist.innerHTML = `
                                        ${ingredientItems ? `<div class="body-large ingr-list">${ingredientItems}</div>` : ""}   
                                    `;
                                    shoppingList.appendChild(ingredientlist);
                                    console.log(shoppingList);

                                });
                            });
                        });
                    }
                })
                .catch(err => { console.log(err);});
            });
        });
    }

    // Attach event listeners initially
    attachEventListeners();
});


/** to close the shopping list */

const closeList = document.querySelector('#list_close');

closeList.addEventListener('click', () => {

    const listContainer = document.querySelector('.shoppinglist');
    listContainer.style.display = "none";
    overlay.classList.remove("active");

    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = bodyOverflow === "hidden"? "visible" : "hidden";

    console.log("Shopping list clicked");
});




  // Call checkAuthentication function when the page loads
  window.addEventListener('load', checkAuthentication);
  
