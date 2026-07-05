# 🍽️ MealBook

MealBook is a full-stack recipe and meal planning web application that helps users discover recipes, organize weekly meal plans, save their favorite recipes, and automatically generate shopping lists. It provides a seamless cooking experience through an intuitive and responsive interface.

---

## 🚀 Live Demo

🌐 https://your-mealbook-url.vercel.app

---

## ✨ Features

- 🔐 User Authentication (Sign Up & Login)
- 🍳 Search recipes using the Edamam API
- 🔍 Filter recipes by meal type, cuisine, dish type, and preparation time
- ❤️ Save and manage favorite recipes
- 📅 Interactive weekly meal planner
- 🛒 Automatically generated shopping list
- 👤 User profile management
- 📖 Detailed recipe pages with ingredients and instructions
- 📱 Fully responsive design
- 🎨 Light and Dark theme support

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Node.js
- Express.js

### Database

- MySQL

### APIs

- Edamam Recipe API

### Authentication

- JWT (JSON Web Token)

---

## 📂 Project Structure

```text
MealBook/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── detail.js
│   │   ├── global.js
│   │   ├── home.js
│   │   ├── mealplan.js
│   │   ├── module.js
│   │   ├── profile.js
│   │   ├── recipes.js
│   │   ├── saved_recipes.js
│   │   ├── signup.js
│   │   └── theme.js
│   │
│   ├── detail.html
│   ├── favicon.svg
│   ├── index.html
│   ├── mealplan.html
│   ├── profile.html
│   ├── recipes.html
│   └── saved-recipes.html
│
├── database.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 📖 Pages

### 🏠 Home

- Browse featured recipes
- Search recipes
- Filter recipes

### 🍲 Recipes

- View recipe results
- Apply multiple filters
- Save favorite recipes

### 📄 Recipe Details

- Ingredients
- Cooking instructions
- Nutrition information

### 📅 Meal Planner

- Plan meals for the week
- Add recipes to specific days
- Generate shopping list automatically

### ❤️ Saved Recipes

- View all bookmarked recipes
- Remove saved recipes

### 👤 Profile

- User information
- Account management

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/MealBook.git
```

### Navigate into the project

```bash
cd MealBook
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
EDAMAM_APP_ID=your_app_id
EDAMAM_APP_KEY=your_app_key
JWT_SECRET=your_secret_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mealbook
```

### Start the server

```bash
node server.js
```

The application will be available at:

```
http://localhost:3000
```

---

## 🌟 Highlights

- Full-stack web application
- JWT-based user authentication
- RESTful API architecture
- Dynamic recipe search and filtering
- Weekly meal planning
- Automatic shopping list generation
- MySQL database integration
- Responsive user interface
- Light and Dark mode support

---

## 📌 Future Improvements

- AI-powered meal recommendations
- Nutrition tracking dashboard
- Meal plan sharing
- Grocery price comparison
- Recipe rating and reviews
- Calendar synchronization

---

## 👩‍💻 Author

**Zufshan Naaz**

- 🌐 Portfolio: https://your-portfolio-url.vercel.app
- 💼 LinkedIn: https://www.linkedin.com/in/zufshan-naaz-89312818b/
- 💻 GitHub: https://github.com/zufshan98

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
