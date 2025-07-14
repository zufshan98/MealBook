

"use strict";

const formOpenBtn = document.querySelector("#form-open"), //get the login button 
  viewProfile = document.querySelector("#profile-btn"), // Get the view profile button 
  logout = document.querySelector(".logout"), // Get the logout button
  formCloseBtn = document.querySelector("#form_close"), // close button on the login form
  user_entry = document.querySelector(".user_entry"),
  formContainer = document.querySelector(".form_container"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelector(".pw_hide"), // closed eye icon for password
  pwShow = document.querySelector(".pw_show"),  // open eye icon for password
  spwShowHide = document.querySelector(".s_pw_hide"), // closed eye icon for password of signup
  spwShow = document.querySelector(".s_pw_show"),  // open eye icon for password of signup
  scpwShowHide = document.querySelector(".sc_pw_hide"), // closed eye icon for password of signup
  scpwShow = document.querySelector(".sc_pw_show"),  // open eye icon for password of signup
  overlay = document.querySelector(".overlay"),
  signup_btn_close = document.querySelector("#signup-btn-close"),
  forgotPw = document.querySelector('.forgot_pw');
  

/*To open the login form */

formOpenBtn.addEventListener("click", () => {
  user_entry.classList.add("show");
  overlay.classList.toggle("active");
  const bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
});

/*To open the profile form */

viewProfile.addEventListener("click", () => {
  window.location.href = "profile.html";
});

/*To close the login form */

formCloseBtn.addEventListener("click", () => {
  user_entry.classList.remove("show");
  overlay.classList.toggle("active");
  const bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
  lformFields.forEach(field => {
    field.value = ''; // Reset the value of each form field to empty
  });
});


signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});


  /*To close the signup form */

signup_btn_close.addEventListener("click", () => {
  user_entry.classList.remove("show");
  overlay.classList.toggle("active");
  const bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
  formFields.forEach(field => {
    field.value = ''; // Reset the value of each form field to empty
  });
});

  /** To toggle the password eye icon */

pwShowHide.addEventListener("click", () => {
  let getPwInput = pwShowHide.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    pwShowHide.classList.add("hidden");
    pwShow.classList.remove("hidden");
  } 
});

pwShow.addEventListener("click", () => {
  let getPwInput = pwShowHide.parentElement.querySelector("input");  
  if (getPwInput.type === "text") {   
    getPwInput.type = "password";
    pwShowHide.classList.remove("hidden");
    pwShow.classList.add("hidden");
  }
});

/* To toggle the password eye icon of signup */

spwShowHide.addEventListener("click", () => {
  let getPwInput = spwShowHide.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    spwShowHide.classList.add("hidden");
    spwShow.classList.remove("hidden");
  } 
});

spwShow.addEventListener("click", () => {
  let getPwInput = spwShowHide.parentElement.querySelector("input");  
  if (getPwInput.type === "text") {   
    getPwInput.type = "password";
    spwShowHide.classList.remove("hidden");
    spwShow.classList.add("hidden");
  }
});

scpwShowHide.addEventListener("click", () => {
  let getPwInput = scpwShowHide.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    scpwShowHide.classList.add("hidden");
    scpwShow.classList.remove("hidden");
  } 
});

scpwShow.addEventListener("click", () => {
  let getPwInput = scpwShowHide.parentElement.querySelector("input");  
  if (getPwInput.type === "text") {   
    getPwInput.type = "password";
    scpwShowHide.classList.remove("hidden");
    scpwShow.classList.add("hidden");
  }
});

  /** FORM VALIDATION */

  /**
   * LOGIN
   */

const form = document.querySelector(".login_form"),
  eField = form.querySelector(".email"),
  eInput = eField.querySelector("input"),
  pField = form.querySelector(".password"),
  pInput = pField.querySelector("input");

  // Get the form fields
const lformFields = [
  eInput,
  pInput,
];

  /* Functions to check form validations */
  
  function checkEmail(){ //checkEmail function
 
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //pattern for validate email
    if(!eInput.value.match(pattern)){ //if pattern not matched then add error and remove valid class
      eField.classList.add("error");
      let errorTxt = eField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (eInput.value != "") ? errorTxt.innerText = "Please enter a valid email address." : errorTxt.innerText = "Email can't be blank.";
    }else{ //if pattern matched then remove error and add valid class
      eField.classList.remove("error");
    }
  }

  function checkPass(){ //checkPass function
   
    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pInput.value.match(passPattern)) {
      pField.classList.add("error"); //adding invalid class if password input value do not match with passPattern
      let errorTxt = pField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (pInput.value != "") ? errorTxt.innerText = "Please enter atleast 8 charatcer with number [0-9], symbols [@$!%*?&], small [a-z] and capital letter [A-Z]." : errorTxt.innerText = "Password can't be blank.";
    }else{ //if pattern matched then remove error and add valid class
      pField.classList.remove("error"); //removing invalid class if password input value matched with passPattern
    }
  }


form.onsubmit = (e)=>{
  e.preventDefault(); //preventing from form submitting
  //if email and password is blank then add shake class in it else call specified function
  if (eInput.value == "") {
    eField.classList.add("error");
  } else{
    checkEmail();
  }
  if (pInput.value == "") {
    pField.classList.add("error");
  } else{
    checkPass();
  }

  eInput.onkeyup = ()=>{checkEmail();} //calling checkEmail function on email input keyup
  pInput.onkeyup = ()=>{checkPass();} //calling checkPassword function on pass input keyup

  //if eField and pField doesn't contains error class that mean user filled details properly
  if(!eField.classList.contains("error") && !pField.classList.contains("error")){
    console.log("form submitted");

    // If no errors, submit the form
    const formData = {
      email: eInput.value,
      password: pInput.value
    };

    // Send the form data to the server using fetch
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    .then(response => response.json())

    .then(data => {
      if (data.success) {
       window.location.href = 'index.html';
       console.log("login successful");
      } else {
        // Process error messages
        if (data.message === 'Invalid email') {
          eField.classList.add("error");
          let errorTxt = eField.querySelector(".error-txt");
          errorTxt.innerText = "Invalid email.";
        } else if (data.message === 'Invalid password') {
            pField.classList.add("error");
            let errorTxt = pField.querySelector(".error-txt");
            errorTxt.innerText = "Invalid password.";
        } else if (data.message === 'User does not exist') {
          pField.classList.add("error");
          let errorTxt = pField.querySelector(".error-txt");
          errorTxt.innerText = "User does not exist. Please sign in first.";
       }
      }
    })

    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while processing your request. Please try again later.');
    });
  }

}; 


/**
 * FORGOT PASSWORD
 */


/** to open forgot password */
forgotPw.addEventListener("click", () => {
  user_entry.classList.remove("show");
  passform.style.display = "block";
});

const emailSubmit = document.querySelector('.email-submit');
const passUpdate = document.querySelector('.pass-update');

const passform = document.querySelector(".pwd-change"),
  emailField = passform.querySelector(".email"),
  emailInput = emailField.querySelector("input"),
  passField = passform.querySelector(".password"),
  passInput = passField.querySelector("input"),
  cpassField = passform.querySelector(".confirmpassword"),
  cpassInput = cpassField.querySelector("input");

// to validate the email of the user
emailSubmit.addEventListener('click', (e) => {

   function checkEmail(){ //checkEmail function
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //pattern passfor validate email
    if(!emailInput.value.match(pattern)){ //if pattern not matched then add error and remove valid class
      emailField.classList.add("error");
      let errorTxt = emailField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (emailInput.value != "") ? errorTxt.innerText = "Please enter a valid email address." : errorTxt.innerText = "Email can't be blank.";
    }else{ //if pattern matched then remove error and add valid class
      emailField.classList.remove("error");
    }
  }

  passform.onsubmit = (e)=>{
    e.preventDefault(); //preventing from form submitting
    //if email and password is blank then add shake class in it else call specified function
    if (emailInput.value == "") {
      emailField.classList.add("error");
    } else{
      checkEmail();
    }
    emailInput.onkeyup = ()=>{checkEmail();} //calling checkEmail function on email input keyup
    
    //if emailField and passField doesn't contains error class that mean user filled details properly
    if(!emailField.classList.contains("error")){
      console.log("email submitted");
  
      // Send the form data to the server using fetch
      fetch('/checkForEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: emailInput.value})
      })
  
      .then(response => response.json())
  
      .then(data => {
        const infoLabel = document.querySelector('.info-label');
        if (data.success === true) { console.log(data);
         emailInput.value = data.email;
         passField.removeAttribute('hidden');
         cpassField.removeAttribute('hidden');
         passUpdate.classList.remove('hidden');
         emailSubmit.classList.add('hidden');
         infoLabel.innerText = "User exists. You can now change your password.";
        } else {
          // Process error messages
          
          infoLabel.innerText = "User doesn't exist. Please signup first.";
          infoLabel.style.color = 'white';
          infoLabel.style.backgroundColor = 'red';
        }
      })
  
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request. Please try again later.');
      });
    }
  
  };
        
});

/** to toggle password eye icon */
const passHide = document.querySelector(".pass_hide"); // closed eye icon for password
const passShow = document.querySelector(".pass_show");

const cpassHide = document.querySelector(".cpass_hide"); // closed eye icon for password
const cpassShow = document.querySelector(".cpass_show"); 


passHide.addEventListener("click", () => {
  let getPwInput = passHide.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    passHide.classList.add("hidden");
    passShow.classList.remove("hidden");
  } 
});

passShow.addEventListener("click", () => {
  let getPwInput = passHide.parentElement.querySelector("input");  
  if (getPwInput.type === "text") {   
    getPwInput.type = "password";
    passHide.classList.remove("hidden");
    passShow.classList.add("hidden");
  }
});

cpassHide.addEventListener("click", () => {
  let getPwInput = cpassHide.parentElement.querySelector("input");
  if (getPwInput.type === "password") {
    getPwInput.type = "text";
    cpassHide.classList.add("hidden");
    cpassShow.classList.remove("hidden");
  } 
});

cpassShow.addEventListener("click", () => {
  let getPwInput = cpassHide.parentElement.querySelector("input");  
  if (getPwInput.type === "text") {   
    getPwInput.type = "password";
    cpassHide.classList.remove("hidden");
    cpassShow.classList.add("hidden");
  }
});

/** to update the password */

passUpdate.addEventListener('click', (e) => {

  function checksPass(){ 
    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passInput.value.match(passPattern)) {
      passField.classList.add("error"); //adding invalid class if password input value do not match with passPattern
      let errorTxt = passField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (passInput.value != "") ? errorTxt.innerText = "Please enter atleast 8 charatcer with number [0-9], symbols [@$!%*?&], small [a-z] and capital letter [A-Z]." : errorTxt.innerText = "Password can't be blank.";
    }else{ //if pattern matched then remove error and add valid class
      passField.classList.remove("error"); //removing invalid class if password input value matched with passPattern
    }
  }

  function checkConfrmPass(){ console.log("Checking", passInput.value, cpassInput.value);
    if (passInput.value !== cpassInput.value || cpassInput.value === "") {
      cpassField.classList.add("error");
      let errorTxt = cpassField.querySelector(".error-txt");
      (cpassInput.value != "") ? errorTxt.innerText = "Password doesn't match." : errorTxt.innerText = "Confirm password can't be blank.";
    }else{
    cpassField.classList.remove("error");
    }
  }
  

 passform.onsubmit = (e)=>{
   e.preventDefault(); //preventing from form submitting
   
   if (passInput.value == "") {
    passField.classList.add("error");
  } else{
    checksPass();
  }
  if (cpassInput.value == "") {
    cpassField.classList.add("error");
  } else{
    checkConfrmPass();
  }
  passInput.onkeyup = ()=>{checksPass();} //calling checkPassword function on pass input keyup
  cpassInput.onkeyup = ()=>{checkConfrmPass();}
   
   //if emailField and passField doesn't contains error class that mean user filled details properly
   if(!passField.classList.contains("error") && !cpassField.classList.contains("error") ){
     console.log("password submitted");
 
     // Send the form data to the server using fetch
     fetch('/updatePassword', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({password: passInput.value, email: emailInput.value})
     })
 
     .then(response => response.json())
 
     .then(data => {
       const infoLabel = document.querySelector('.info-label');
       if (data.success === true) { console.log(data);
        
        passInput.value = "";
        cpassInput.value = "";
        passUpdate.classList.add('hidden', true);
        emailSubmit.classList.remove('hidden', true);
        infoLabel.innerText = "Password updated successfully. Now you can login to your profile.";
        infoLabel.style.backgroundColor = 'var(--primary)';
        infoLabel.style.color = 'white';
       }
     })
 
     .catch(error => {
       console.error('Error:', error);
       alert('An error occurred while processing your request. Please try again later.');
     });
   }
 };      
});

/** to close the forgot password */
const updatePwdClose = document.getElementById('update-pwd-close');
updatePwdClose.addEventListener('click', () => {
  passform.style.display = 'none';
  overlay.classList.toggle("active");
});

/**
   * SIGNUP
   */

const sform = document.querySelector(".signup_form"),
  sfnField = sform.querySelector(".fullname"),
  sfnInput = sfnField.querySelector("input"),
  sunField = sform.querySelector(".username"),
  sunInput = sunField.querySelector("input"),
  seField = sform.querySelector(".email"),
  seInput = seField.querySelector("input"),
  spField = sform.querySelector(".password"),
  spInput = spField.querySelector("input"),
  scpField = sform.querySelector(".cnfrmpassword"),
  scpInput = scpField.querySelector("input"),
  sgField = sform.querySelector(".gender"),
  sgInput = sgField.querySelectorAll('input[name="gender"]');
 
  // Get the form fields
const formFields = [
  sfnInput,
  sunInput,
  seInput,
  spInput,
  scpInput
];


  /* Functions to check form validations */

  function checksEmail(){ //checkEmail function
 
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //pattern for validate email
    if(!seInput.value.match(pattern)){ //if pattern not matched then add error and remove valid class
      seField.classList.add("error");
      let errorTxt = seField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (seInput.value != "") ? errorTxt.innerText = "Please enter a valid email address." : errorTxt.innerText = "Email can't be blank.";
    }else{ //if pattern matched then remove error and add valid class
      seField.classList.remove("error");
    }
  }

  function checksPass(){ 

    const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!spInput.value.match(passPattern)) {
      spField.classList.add("error"); //adding invalid class if password input value do not match with passPattern
      let errorTxt = spField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (spInput.value != "") ? errorTxt.innerText = "Please enter atleast 8 charatcer with number [0-9], symbols [@$!%*?&], small [a-z] and capital letter [A-Z]." : errorTxt.innerText = "Password can't be blank.";
    }else{ //if pattern matched then remove error and add valid class
      spField.classList.remove("error"); //removing invalid class if password input value matched with passPattern
    }
  }

  function checkFullName(){
    const fullnamePattern = /^[a-zA-Z\s-]+$/;
    if (!sfnInput.value.match(fullnamePattern)) {
      sfnField.classList.add("error"); 
      let errorTxt = sfnField.querySelector(".error-txt");
      (sfnInput.value != "") ? errorTxt.innerText = "Please enter letters [A-Z], [a-z] only." : errorTxt.innerText = "Full name can't be blank.";
    }else{ 
      sfnField.classList.remove("error"); 
    }
  }


  function checkUsrName(){
    if (!sunInput.value.match(/^[a-z0-9_\.]+$/)) {
      sunField.classList.add("error"); 
      let errorTxt = sunField.querySelector(".error-txt");
      (sunInput.value != "") ? errorTxt.innerText = "Username can only have: Lowercase letters [a-z], numbers [0-9], dots [.] and underscores [_]." : errorTxt.innerText = "Username can't be blank";
    }else{
    sunField.classList.remove("error");
    }
  }

  function checkConfrmPass(){
    if (spInput.value !== scpInput.value || scpInput.value === "") {
      scpField.classList.add("error");
      let errorTxt = scpField.querySelector(".error-txt");
      (scpInput.value != "") ? errorTxt.innerText = "Password doesn't match." : errorTxt.innerText = "Confirm password can't be blank.";
    }else{
    scpField.classList.remove("error");
    }
  }

  function checkGender() {
    let checked = false;
    sgInput.forEach(input => {
      if (input.checked) {
        checked = true;
      }
    });
    return checked;
  }

sform.onsubmit = (e)=>{
  e.preventDefault(); //preventing from form submitting
  //if email and password is blank 
  if (sfnInput.value == "") {
    sfnField.classList.add("error");
  }else if ((!sfnInput.value.trim().length>2) || (!sfnInput.value.trim().length>20)) {
    sfnField.classList.add("error");
    let errorTxt = sfnField.querySelector(".error-txt");
    (sfnInput.value != "") ? errorTxt.innerText = "Name should be between 2 and 20 letters." : errorTxt.innerText = "Full name can't be blank.";
  }else{
    checkFullName();
  }
  if (sunInput.value == "") {
    sunField.classList.add("error");
  } else{
    checkUsrName();
  }
  if (seInput.value == "") {
    seField.classList.add("error");
  } else{
    checksEmail();
  }
  if (spInput.value == "") {
    spField.classList.add("error");
  } else{
    checksPass();
  }
  if (scpInput.value == "") {
    scpField.classList.add("error");
  } else{
    checkConfrmPass();
  }
  if (!checkGender()) {
    sgField.classList.add("error");
    
  } else {
    sgField.classList.remove("error");
  }

  /* changes the  error text dynamically as the user types the data */

  sfnInput.onkeyup = ()=>{checkFullName();} 
  sunInput.onkeyup = ()=>{checkUsrName();}
  seInput.onkeyup = ()=>{checksEmail();} //calling checkEmail function on email input keyup
  spInput.onkeyup = ()=>{checksPass();} //calling checkPassword function on pass input keyup
  scpInput.onkeyup = ()=>{checkConfrmPass();}
  sgInput.forEach(input => {
    input.addEventListener('change', () => {
      if (checkGender()) {
        sgField.classList.remove("error");
      } else {
        sgField.classList.add("error");
      }
    });
  });
  
  //if eField and pField doesn't contains error class that mean user filled details properly
  if(!sfnField.classList.contains("error") && !sunField.classList.contains("error") && !seField.classList.contains("error") && !spField.classList.contains("error") && !scpField.classList.contains("error") && checkGender()){
    console.log("submitted");

    const formData = {
      fullName: sfnInput.value,
      username: sunInput.value,
      email: seInput.value,
      password: spInput.value,
      confirmPassword: scpInput.value,
      gender: getSelectedGender()
    };

    // Send the form data to the server using fetch
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    .then(response => { 
      //console.log(response);
      if (!response.ok) {
        // If response status is not 400 then throw an error
        if (!response.status === 400) 
        throw new Error('Network response not ok');
      }
      // Handle successful response from the server and parse the response in json format to another .then to process further
      return response.json();
    })

    .then(data => {  
      // Check if the signup was successful or if the user already exists
      if (data.success) {
        user_entry.classList.remove("show");
        showModal();
      } else { 
        // Process error messages
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(message => {
              if (message === 'Username already in use') {
                  sunField.classList.add("error");
                  let errorTxt = sunField.querySelector(".error-txt");
                  errorTxt.innerText = "Username cannot be used. Please choose another username.";
              } else if (message === 'Email already in use') {
                  seField.classList.add("error");
                  let errorTxt = seField.querySelector(".error-txt");
                  errorTxt.innerText = "A user is already registered with this email.";
              }
          });
        }
      }
    })

    .catch(error => {
      console.error('Error:', error); 
      alert('An error occurred while processing your request. Please try again later.'); 
    });


    // Function to get the selected gender
    function getSelectedGender() {
        let selectedGender = '';
        sgInput.forEach(input => {
            if (input.checked) {
                selectedGender = input.value;
            }
        });
        return selectedGender;
    }
  }
       
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
  //user_entry.classList.add("show");
  //formContainer.classList.remove("active");
  window.location.href = 'index.html';
  formFields.forEach(field => {
    field.value = ''; // Reset the value of each form field to empty
  });
  
};

/**
 * HAMBURGER SIDEBAR MENU
 */

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
        document.querySelector('.data h2').innerText = "You're not logged in!";
      
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

/** To logout */

logout.addEventListener('click', () => {
  
  // Send a POST request to the logout endpoint
  fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => { 
    console.log(data); 
    // Check if the logout was successful
    if (data.success === true) {
      window.location.href = 'index.html';
      document.querySelector('.data h2').innerText = "You're not logged in!";
      document.querySelector('.data span').innerText = " ";
      document.querySelector('.profile-pic').src = "./images/no-profile.png";
      viewProfile.style.display = "none";
      logout.style.display = "none";
      formOpenBtn.style.display = "block"; 
      
    } else {
      console.error('Logout failed:', response.statusText);
      // Handle logout failure
    }
  });
 
});

// Call checkAuthentication function when the page loads
window.addEventListener('load', checkAuthentication);






        
  