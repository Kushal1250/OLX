function login() {
  // Get user input
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorP = document.getElementById("error");

  // Firebase Authentication
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((res) => {
      console.log(res);

      // Successful login
      if (res.operationType === "signIn") {
        errorP.style.display = "block";
        errorP.style.color = "green";
        errorP.innerHTML = "Login Successful";

        // Save user ID to localStorage and redirect
        localStorage.setItem("userId", res.user.uid);
        window.location.href = "../index.html";
      }
    })
    .catch((error) => {
      // Handle Errors
      const errorMessage = error.message;
      console.log(errorMessage);

      errorP.style.display = "block";
      errorP.style.color = "red";
      errorP.innerHTML = errorMessage;
    });
}
