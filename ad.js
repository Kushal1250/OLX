// ================== FIRESTORE INIT ==================
var db = firebase.firestore();
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);
// ====================================================
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });


// ===================== Loader =======================
const loader = document.getElementById("loader");

function hideLoader() {
  loader.style.display = "none";
}

function showLoader() {
  loader.style.display = "block";
}
// ====================================================


// =================== User Check =====================
const userId = localStorage.getItem("userId");
const WelcomeName = document.getElementById("welcomeName");

if (!userId) {
  alert("Please Login First");
  window.location.href = "../Login/login.html";
}
// ====================================================


// ============= Fetch and Display User ================
const docRef = db.collection("Users").doc(userId);

docRef.get()
  .then((doc) => {
    if (doc.exists) {
      const name = doc.data().name;
      WelcomeName.style.display = "block";
      WelcomeName.innerHTML = "Welcome : " + name.toUpperCase();
      console.log("Document data:", doc.data());
    } else {
      console.log("No such document!");
    }
  })
  .catch((error) => {
    console.log("Error getting document:", error);
  });
// ====================================================


// ================ Submit Ad Handler =================
function submitAd() {
  // Collect form values
 const AdTitle = document.getElementById("adTitle").value;
  const Category = document.getElementById("Category").value;
  const AdDescription = document.getElementById("AdDescription").value;
  const Image = document.getElementById("UploadImage").files[0];
  const Name = document.getElementById("Name").value;
  const number = document.getElementById("Number").value;
  const city = document.getElementById("city").value;
  const price = document.getElementById("price").value;
  const error = document.getElementById("error");
  const userId = localStorage.getItem("userId");

  if (!AdTitle || !Category || !AdDescription || !Image || !Name || !number || !city || !price) {
    error.style.display = "block";
    error.innerHTML = "Please fill all fields";
    return;
  }

  // File upload
  const file = Image.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    const img = reader.result;

    // Add ad to Firestore
    db.collection("Ads").add({
      AdTitle,
      Category,
      AdDescription,
      Name,
      number,
      city,
      img,
      userId,
      price
    })
    .then((docRef) => {
     showLoader();

    setTimeout(() => {
     hideLoader(); // Stop loading after small delay or right before redirect
     error.style.color = "green";
    error.style.display = "block";
    error.innerHTML = "Your Ad Has Been Posted";
    window.location.href = "../My account/account.html";
}, 1000); // 1 second

    })
    .catch(function(error) {
    hideLoader(); // Important
    console.error("Error adding document: ", error);
    error.style.display = "block";
    error.style.color = "red";
    error.innerHTML = "Failed to post ad. Try again!";
});

  };

  reader.readAsDataURL(file);
}
// ====================================================


// =================== Logout =========================
function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}
// ====================================================
window.onload = function() {
  var userId = localStorage.getItem("userId");
  var WelcomeName = document.getElementById("welcomeName");

  if (!userId) {
    alert("Please Login First");
    window.location.href = "../Login/login.html";
  } else {
    db.collection("Users").doc(userId).get()
      .then((doc) => {
        if (doc.exists) {
          WelcomeName.style.display = "block";
          WelcomeName.innerHTML = "Welcome: " + doc.data().name.toUpperCase();
        }
      })
      .catch((error) => console.error("Error:", error));
  }
};

window.onload = function () {
  hideLoader(); // ensures loader doesn't show on startup
};
// REMOVE this duplicate!
function submitAd() {
    console.log("Submit button clicked"); // test visibility

    // your existing logic
}

db.collection("Ads").get().then((snapshot) => {
  snapshot.forEach((doc) => {
    const ad = doc.data();
    const adCard = `
      <div class="col-md-3 mb-3">
        <div class="card">
          <img src="${ad.img}" class="card-img-top" style="height:200px; object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">${ad.AdTitle}</h5>
            <p><i class="fa fa-map-marker"></i> Location: ${ad.city}</p>
            <h5 class="text-warning">Rs ${ad.price}</h5>
            <div class="d-flex justify-content-between">
              <button class="btn btn-primary">BUY</button>
              <button class="btn btn-danger"><i class="fa fa-heart-o"></i> Add To Favorite</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById("adList").innerHTML += adCard;
  });
});
