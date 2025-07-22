// FIRESTORE INITIALIZATION
const db = firebase.firestore();
firebase.firestore().settings({ timestampsInSnapshots: true });

// SIGN UP FUNCTION
function signUp() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const username = document.getElementById('username').value.trim();
  const errorP = document.getElementById('error');

  // Clear previous error
  errorP.style.display = "none";
  errorP.textContent = "";

  // Basic validation
  if (!email || !password || !username) {
    showError("Please fill out all fields.");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters.");
    return;
  }

  // Firebase Auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res => {
      const userId = res.user.uid;

      // Store additional user data in Firestore
      return db.collection("Users").doc(userId).set({
        email: email,
        name: username,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        localStorage.setItem("userId", userId);
        showSuccess("Account has been created successfully!");

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1000);
      });
    })
    .catch(error => {
      showError(error.message);
      console.error("Sign-up error:", error);
    });
}

// Utility: Show Error
function showError(message) {
  const errorP = document.getElementById("error");
  errorP.style.display = "block";
  errorP.style.color = "red";
  errorP.textContent = message;
}

// Utility: Show Success
function showSuccess(message) {
  const errorP = document.getElementById("error");
  errorP.style.display = "block";
  errorP.style.color = "green";
  errorP.textContent = message;
}
