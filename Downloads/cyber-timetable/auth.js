import app from "./firebase-config.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const auth = getAuth(app);

window.login = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      status.innerText = "✅ Login successful!";
      setTimeout(() => window.location.href = "dashboard.html", 1500);
    })
    .catch((error) => {
      status.innerText = "❌ " + error.message;
    });
}