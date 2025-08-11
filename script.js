document.addEventListener("DOMContentLoaded", () => {
  // Prevent back navigation
  function preventBackNavigation() {
    window.history.forward();
  }
  setTimeout(preventBackNavigation, 0);
  window.onunload = function () {
    null;
  };

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const response = await fetch("https://web-production-1de00.up.railway.app/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": navigator.userAgent,
          },
          body: JSON.stringify({ username, password }),
        });

        const resultText = await response.text();
        console.log("Response text:", resultText);

        try {
          const result = JSON.parse(resultText);

          if (response.ok) {
            console.log("Login success:", result);
            localStorage.setItem("username", result.username);
            localStorage.setItem("password", result.password);
            localStorage.setItem("jwt_token", result.jwt_token);
            localStorage.setItem("user_id", result.user_id);
            alert("Login successful!");
            window.location.href = "index.html";
          } else {
            document.getElementById("error").textContent =
              result.message || "Login failed.";
          }
        } catch (parseError) {
          document.getElementById("error").textContent =
            "Invalid response from server.";
          console.error("Error parsing response:", parseError);
        }
      } catch (err) {
        document.getElementById("error").textContent = "Something went wrong.";
        console.error("Error response:", err);
      }
    });
  }
});
