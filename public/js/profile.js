"use strict";

function checkPhone(){
  if (!spnInput.value.match(/^\d{10}$/)) {
    spnField.classList.add("error"); 
    let errorTxt = spnField.querySelector(".error-txt");
    (spnInput.value != "") ? errorTxt.innerText = "Please enter 10 digit mobile number." : errorTxt.innerText = "Phone number can't be blank.";
  }else{
  spnField.classList.remove("error");
  }
}

// Get the button and file input element
const uploadBtn = document.querySelector('.btn-upload');
const imageUpload = document.getElementById('image-upload');

// Add event listener to the button
uploadBtn.addEventListener('click', function() {
  // Add event listener to the file input element
  imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    console.log(file);
    if (!file) {
      console.error('No file selected');
      return;
    }
    // Create a FormData object to append file contents
    const formData = new FormData();
    formData.append('image', file);

    // Send the FormData (file) object to the server using fetch
    fetch('/upload-image', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => { console.log(data);
      // Log the path or URL of the uploaded image
      console.log('Uploaded image path:', data.imagePath);
      // Update the user image on the page
      const userImage = document.getElementById('user-image');
      userImage.src = data.imagePath;
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
  });
});

// Function to populate HTML fields with user data
const populateUserData = (userData) => {
    const fullNameField = document.querySelector('.fullname input');
    const usernameField = document.querySelector('.username input');
    const emailField = document.querySelector('.email input');
    const addressField = document.querySelector('.address input');
    const phoneNumberField = document.querySelector('.phone input');
    const genderField = document.querySelector('.gender input');
    const userImage = document.getElementById('user-image');
    
    usernameField.value = userData.username;
    fullNameField.value = userData.fullname;
    emailField.value = userData.email;
    addressField.value = userData.address || '';
    phoneNumberField.value = userData.mobile_no || '';
    genderField.value = userData.gender;
    userImage.src = userData.profile_pic || './images/no-profile.png';
};


// Function to handle form submission and update user data
const updateUserProfile = (event) => {
  event.preventDefault();

  // Collect updated user data from form fields
  const updatedData = {
    fullName: document.querySelector('.fullname input').value,
    address: document.querySelector('.address input').value,
    phoneNumber: document.querySelector('.phone input').value, 
    // Add imagePath field to include the uploaded image path
    imagePath: document.getElementById('user-image').src,
  };
  console.log(JSON.stringify(updatedData));
  
  // Send updated data to server to be saved
  fetch('/updateProfile', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(data => {
    // If data is successfully updated, display a success message
    console.log('Profile updated successfully:', data);
    showModal();
  })
  .catch(error => {
    console.error('Error updating profile:', error);
  });
};

// Fetch user data when the page loads
window.addEventListener('load', () => {
  fetch('/profile')
    .then(response => response.json())
    .then(data => { console.log(data);
      document.querySelector('.logo-text .usrname').innerText = data.username;
      document.querySelector('.logo-text .usremail').innerText = data.email;
      document.getElementById('side-image').src = data.profile_pic;
      document.getElementById('side-image-circle').src = data.profile_pic;
      // Populate HTML fields with user data
      populateUserData(data);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  
  // Add event listener for form submission
  const updateInfo = document.getElementById('update-form');
  updateInfo.addEventListener('submit', updateUserProfile);
});


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
  window.location.reload();
};

const sideImageBtn = document.getElementById('side-image-btn');  
const userSidebar = document.querySelector('.user-sidebar');
const overlay = document.querySelector('.overlay');
const sidebarBtnclose = document.querySelector('.user-sidebar-close');

window.addEventListener("scroll", e => {
  sideImageBtn.classList[window.scrollY >= 100? "add" : "remove"]("active");
});

sideImageBtn.addEventListener("click", () => {
  userSidebar.classList.add("active");
  overlay.classList.add("active");
  const bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
});

sidebarBtnclose.addEventListener("click", () => {
  userSidebar.classList.remove("active");
  overlay.classList.remove("active");
  const bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = bodyOverflow === "hidden" ? "visible" : "hidden";
});