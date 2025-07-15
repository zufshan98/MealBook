const express = require("express"); //requires the Express module
const con = require("./database");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express(); //creates an express app
const secretKey = "recipes";

/* Setting up middleware */

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cookieParser());


/**
 * Defining routes
 */

// To serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Route to handle signup form submission
app.post("/signup", (req, res) => {
  // retrieve all form data from request body
  const { fullName, username, email, password, gender } = req.body;

  // Check if the user already exists
  const existingUser ="SELECT * FROM login_details WHERE username = ? OR email = ?";

  con.query(existingUser, [username, email], (err, rows) => {

    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Error querying database" });
    }

    // Initialize error messages array
    let errorMessages = [];
    // Check if a user with the same username or email already exists
    if (rows.length > 0) {
      
      if (rows.some((row) => row.username === username)) {
        errorMessages.push("Username already in use");
      }
      if (rows.some((row) => row.email === email)) {
        errorMessages.push("Email already in use");
      }
      return res.json({ success: false, messages: errorMessages });
    }

    // If neither username nor email is already in use, proceed with inserting the new user
    const sql = "INSERT INTO login_details(username, fullname, password, email, gender, user_type) VALUES (?,?,?,?,?,?)";
    const user_type = "user";

    con.query(sql, [username, fullName, password, email, gender, user_type], (err, result) => {

        if (err) {
          console.error("Error inserting data into database:", err);
          res.status(500).json({success: false, message: "Error inserting data into database",});
          return;
        }
        console.log("Signup successful");

        // Get the user_id generated during signup
        const user_id = result.insertId;

        // Insert user_id of login_details into user_id of user_profile table
        const insertProfileSql = "INSERT INTO user_profile(user_id) VALUES (?)";
        con.query(insertProfileSql, [user_id], (err, profileResult) => {
          if (err) {
            console.error("Error inserting data into user_profile table:", err);
            return res.status(500).json({ success: false, message: "Error inserting data into database" });
          }

          console.log("User profile created successfully");
        });

        // generating JWT token
        const userid = result.insertId;
        const token = jwt.sign(
          { email: email, username: username, user_id: userid },
          secretKey,
          { expiresIn: "5d" }
        );
        // Set the token as a cookie in the response
        res.cookie("token", token, { 
            maxAge: 43200000, 
            httpOnly: true }
        ); // Cookie expires in 12 hour

        return res.json({ success: true});
    });
  });
});

// Handle POST request for user login
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  // Query the database to verify user credentials
  const checkUserLogin =
    "SELECT * FROM login_details WHERE email = ? OR password = ?";

  con.query(checkUserLogin, [email, password], (err, rows) => {

    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Error querying database" });
    }

    // Check if a user with the same username or email already exists
    if (rows.length > 0) {
      const user = rows[0];

      if (!rows.some((row) => row.email === email)) {
        return res.json({ success: false, message: "Invalid email" });
      } 
      else if (!rows.some((row) => row.password === password)) {
        return res.json({ success: false, message: "Invalid password" });
      } 
      else {
        // generating JWT token
        const token = jwt.sign(
          { email: email, username: user.username, user_id: user.user_id },
          secretKey,
          { expiresIn: "5d" }
        );
        // Set the token as a cookie in the response
        res.cookie("token", token, { 
            maxAge: 43200000, 
            httpOnly: true }
        ); // Cookie expires in 12 hour

        return res.json({ success: true, token: token });
      }
    } 

    else {
      return res.json({ success: false, message: "User does not exist" });
    }
  });
});

// Middleware to validate JWT token
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["token"];
  //console.log(accessToken);
  if (accessToken === undefined) {
    return res.json({ success: false, message: "User not Authenticated!" });
  } else {
    try {
      console.log(accessToken);
      const validToken = jwt.verify(accessToken, secretKey);
      if (validToken) {
        req.authenticated = true; 
        req.user = validToken; // Attach decoded user information to the request object
        return next();
      }
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }  
};


// API endpoint to check authentication status
app.get('/auth', validateToken, (req, res) => { console.log(res.status);
  const { username, email, user_id } = req.user;
  // returns user info from database based on user_id
  //const userImage = getUserData(user_id); 
  console.log(req.authenticated, username, email, user_id);
  return res.json({ authenticated: true, username, email, user_id});
});


// Logout route to clear the token cookie
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  return res.json({ success: true, message: "User logged out successfully" });
});


// Route to fetch user data
app.get('/profile', validateToken, (req, res) => {
  const user_id = req.user.user_id; // Assuming user ID is stored in req.user.id
  console.log(user_id);
  //Function to fetch the user information using user_id
  // SQL query to fetch user information including image based on user ID
  const getInfo = "SELECT ld.*, up.* FROM login_details ld INNER JOIN user_profile up ON ld.user_id = up.user_id WHERE ld.user_id = ?";

  try {
    // Execute the SQL query
    con.query(getInfo, [user_id], (err, result) => {
      if (err) {
        // If an error occurs during the database query, send an error response
        console.error('Database error:', err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (result.length > 0) { console.log(result);
        // If user information is found
        const userInfo = result[0];
        // Send the user information back to the client
        res.json(userInfo);
      } 
      else {
        // If user information is not found, send an error response
        res.status(404).json({ error: "User not found" });
      }
    });

  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update user profile
app.post('/updateProfile', validateToken, (req, res) => {
  const { user_id } = req.user;
  const { fullName, address, phoneNumber, imagePath } = req.body;

  // SQL query to update user profile including the image path based on user ID
  const query = "UPDATE login_details AS ld JOIN user_profile AS ud ON ld.user_id = ud.user_id SET ld.fullname = ?, ud.address = ?, ud.mobile_no = ?, ud.profile_pic = ? WHERE ld.user_id = ?";

  // Execute the SQL query
  con.query(query, [fullName, address, phoneNumber, imagePath, user_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // If user profile is successfully updated
    console.log("User profile updated successfully");
    res.json({ success: true });
  });
});


// Set up Multer to handle file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images/uploads'); // Destination directory for uploaded files
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ storage: storage });

// Define a route to handle image uploads
app.post('/upload-image', upload.single('image'), (req, res) => { console.log(req.file);
  // Validate file type (ensure it's an image)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed.' });
  }
   console.log(req.file.filename);
  // Send the path or URL of the uploaded image back to the client
  res.json({ imagePath: `/images/uploads/${req.file.filename}` });
});

// Endpoint to save recipe to database
app.post('/saveRecipeId', validateToken, (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.user.user_id; // Assuming you have user authentication middleware

  const query = `INSERT INTO saved_recipes (user_id, recipe_id) VALUES (${userId}, '${recipeId}')`;
  
  con.query(query, (err, result) => {
      if (err) {
          console.error('Error saving recipe to database:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }
      console.log('Recipe saved to database');
      res.status(200).json({ success: true });
  });
});

// Endpoint to delete saved recipes from database
app.post('/deleteRecipeId', validateToken, (req, res) => {
  const recipe_Id = req.body.recipeId;
  const userId = req.user.user_id; // Assuming you have user authentication middleware

  const query = "DELETE FROM saved_recipes WHERE recipe_id = ?";
  
  con.query(query, [recipe_Id], (err, result) => {
      if (err) {
          console.error('Error deleting recipe from database:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }
      console.log('Recipe deleted from database');
      res.status(200).json({ success: true });
  });
});

app.post('/checkSavedRecipes', validateToken, (req, res) => {
  const userId = req.user.user_id; // Assuming you have user authentication middleware
  const auth = req.authenticated; 
  const recipe_Id = req.body.recipeId; console.log(recipe_Id); console.log(userId); 
  const query = "SELECT * FROM saved_recipes WHERE recipe_id = ?";
  
  
  con.query(query, [recipe_Id], (err, results) => {
      if (err) {
          console.error('Error fetching saved recipes from database:', err);
          res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length > 0) { console.log(results);
        const recipeId = results[0];
        // If recipe is saved send it back to the client
        console.log('Saved recipes fetched from database');
        res.status(200).json({ success: true, message: "Recipe found", recipeId: recipeId.recipe_id, auth: auth });
      } 
      else {
        // If recipe is not found, send an error response
        console.log('Recipe not found in database');
        res.json({ success: false, recipeId: recipe_Id, message: "Recipe not found", auth: auth });
      }
  });
});

app.post('/fetchSavedRecipeIds', validateToken, (req, res) => {
  const userId = req.user.user_id; // Assuming you have user authentication middleware
  
  const query = "SELECT recipe_id FROM saved_recipes WHERE user_id = ?";
  
  con.query(query, [userId], (err, results) => {  
      if (err) {
          console.error('Error fetching saved recipe IDs from database:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (results.length > 0) { console.log(results);
        const recipeId = results;
        // If recipe is saved send it back to the client
        console.log('Saved recipe IDs fetched from database');
        res.status(200).json({ success: true, savedRecipes: recipeId});
      } 
      else {
        // If recipe is not found, send an error response
        console.log('User have not saved any recipes');
        res.status(200).json({ success: false });
      }
  });
});

// Endpoint to check if a recipe exists for a given date
app.post('/checkRecipeExists', (req, res) => {
  const { date, mealType, recipeId } = req.body;

  // Check if the recipe exists for the given date
  const sql = 'SELECT * FROM meal_plan_recipes WHERE date = ? AND MEAL_TYPE = ? AND recipe_id = ?';
  con.query(sql, [date, mealType, recipeId], (err, results) => {
      if (err) {
          console.error('Error checking recipe:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      // Return whether the recipe exists or not
      res.json({ exists: results.length > 0 });
    });
});

// Endpoint to save meal plans
app.post('/saveMealPlans', validateToken, (req, res) => {
  const userId = req.user.user_id; // Assuming you have user authentication middleware
  const { date, mealType, recipeId } = req.body;
  console.log("DATE FROM THE FRONTEND", date);
  
  const sql = 'INSERT INTO meal_plan_recipes (user_id, date, meal_type, recipe_id) VALUES (?, ?, ?, ?)';
  con.query(sql, [userId, date, mealType, recipeId], (err, mealPlanResult) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      console.log("successfull", mealPlanResult);
      return 
  });
  // query to fetch the inserted date

  const mealPlanDate = "SELECT date FROM meal_plan_recipes WHERE date = ?";
      
  con.query(mealPlanDate, [date], (err, results) => {  
    if (err) {
      console.error('Error fetching saved recipe IDs from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) { console.log(results);
      const mealDate = results[0].date;

      // If recipe is saved send it back to the client
      console.log('Date fetched from database', mealDate);
      
      const mealPlanSql = "INSERT INTO meal_plan (`date`) VALUES (?)";
     
      con.query(mealPlanSql, [date], (err, recipeResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          console.log("successfull date saved");
          res.status(200).json({ success: true });
      });
    } 
    else {
      // If recipe is not found, send an error response
      console.log('User have not saved any date');
      res.status(200).json({ success: false });
    }
  });
});

// to get the dates stored in the database
app.get('/getDates', validateToken, (req, res) => {
  const userId = req.user.user_id;
  console.log("getDates");
  const mealPlanDate = "SELECT * FROM meal_plan"; 
  //const mealPlanDate = "SELECT mp.*, mps.* FROM meal_plan mp INNER JOIN meal_plan_recipes mps ON mp.date = mps.date";    
  con.query(mealPlanDate, (err, results) => {  
    if (err) {
      console.error('Error fetching saved dates from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) { console.log(results)

      res.json ( {mealplan: results});
    } 
    else {
      // If recipe is not found, send an error response
      console.log('User have not saved any date');
      res.status(200).json({ success: false });
    }
  });
});

// to get the recipes saved on a given date stored in the database
app.post('/getRecipes', validateToken, (req, res) => {
  const userId = req.user.user_id;
  const date = req.body.date;

  const mealRecipe = "SELECT * FROM meal_plan_recipes WHERE date =?";    
  con.query(mealRecipe, [date], (err, results) => {  
    if (err) {
      console.error('Error fetching saved dates from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) { console.log(results)

      res.json ( {mealPlanRecipes: results});
    } 
    else {
      // If recipe is not found, send an error response
      console.log('User have not saved any date');
      res.status(200).json({ success: false });
    }
  });
});

// to delete the recipe from database
app.post('/deleteMeal', validateToken, (req, res) => {
  const recipe_Id = req.body.recipeId;
  const userId = req.user.user_id; // Assuming you have user authentication middleware

  const query = "DELETE FROM meal_plan_recipes WHERE recipe_id = ?";
  
  con.query(query, [recipe_Id], (err, result) => {
      if (err) {
          console.error('Error deleting recipe from database:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }
      console.log('Recipe deleted from database');
      res.status(200).json({ success: true });
  });
});

// to get the meal plan id for shopping list
app.post('/getMealPlanId',(req, res) => {
  const date = req.body.date;

  const sql = "SELECT mp.*, mpr.* FROM meal_plan mp INNER JOIN meal_plan_recipes mpr ON mp.date = mpr.date WHERE mp.date = ?";
  con.query(sql, [date], (err, results) => {
    if (err) {
      console.error('Error fetching saved recipe IDs from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) { console.log(results);
     res.status(200).json({ success: true, results});
    }
    else {
      // If recipe is not found, send an error response
      console.log('User have not saved any date');
      res.status(200).json({ success: false });
    }

  });




}); 
// Handle POST request for forgot password login
app.post("/checkForEmail", (req, res) => {

  const email = req.body.email;

  // Query the database to verify user credentials
  const sql ="SELECT email FROM login_details WHERE email = ?";

  con.query(sql, [email], (err, rows) => {

    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Error querying database" });
    }

    // Check if a user with the same email already exists
    if (rows.length > 0) { console.log (rows);
      return res.json({ success: true, message: "User exists", email: email  });
    } 
    else {
      return res.json({ success: false, message: "User does not exist" });
    }
    
  });
});

// Handle POST request for forgot password login
app.post("/updatePassword", (req, res) => {

  const password = req.body.password;
  const email = req.body.email;
  console.log(password, email);
  // Query the database to verify user credentials
  const sql ="UPDATE login_details SET password = ? WHERE email =?";

  con.query(sql, [password, email], (err, rows) => {
  console.log(rows);
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Error querying database" });
    }
    else {
      return res.json({ success: true, message: "Password updated successfully" });
    }
    
  });
});


// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

