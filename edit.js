function setupEditTodoHandler() {
  const BASE_URL = "https://web-production-1de00.up.railway.app";
  const userId = localStorage.getItem("user_id");
  document.getElementById("editTodoBtn").addEventListener("click", async () => {
    const rows = document.querySelectorAll("#todo-list-edit tr");
    const updates = [];

    for (const row of rows) {
      const id = row.children[0].textContent.trim();
      const userId = row.children[1].textContent.trim();
      const title = row.children[2].textContent.trim();
      const completedText = row.children[3].textContent.trim().toLowerCase();
      const completed =
        completedText === "yes" ? true : completedText === "no" ? false : null;

      if (!id || !userId || !title || completed === null) {
        alert("Please ensure all fields are filled correctly.");
        return;
      }

      updates.push({
        id,
        userId: parseInt(userId),
        title,
        completed,
      });
    }

    try {
      const results = await Promise.all(
        updates.map((todo) =>
          fetch(`${BASE_URL}/api/v2/update/${todo.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify({
              userId: todo.userId,
              title: todo.title,
              completed: todo.completed,
            }),
          })
        )
      );

      const allOk = results.every((res) => res.ok);
      if (allOk) {
        alert("Todos updated successfully!");
        document.getElementById("editModal").style.display = "none";
        window.location.reload();
      } else {
        alert("Some todos failed to update.");
      }
    } catch (err) {
      console.error("Edit error:", err);
      alert("An error occurred while updating todos.");
    }
  });

  // ======= Image Edit Handler =======
  const profilePic = document.querySelector(".profile-img");
  const imageInput = document.getElementById("imageInput");

  profilePic.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      profilePic.src = e.target.result;
    };

    if (file) reader.readAsDataURL(file);
  });

  document
    .getElementById("editImageForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const file = imageInput.files[0];

      if (!file) {
        alert("Please select an image.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const apiUrl = `${BASE_URL}/user/profile-image/update/${userId}`;

      try {
        const response = await fetch(apiUrl, {
          method: "PATCH",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert("Profile image updated!");

          const newImageUrl = `${BASE_URL}/image_uploads/${data.filename}`;
          document.getElementById("profile-pic").src = newImageUrl;
          window.location.reload();
        } else {
          alert(`Error: ${data.message || "Failed to update"}`);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        alert("An error occurred while uploading the image.");
      }
    });

  document.getElementById("imageInput").addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      document.querySelector(".profile-img").src = e.target.result;
    };

    if (file) reader.readAsDataURL(file);
  });
}
