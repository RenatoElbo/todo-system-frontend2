function setupDeleteTodoHandler() {
  document.getElementById("deleteTodoBtn").addEventListener("click", async () => {
    const rows = document.querySelectorAll("#todo-list-delete tr");
    const idsToDelete = [];

    for (const row of rows) {
      if (row.style.display === "none") continue;
      const id = row.children[0].textContent.trim();
      if (id) idsToDelete.push(id);
    }

    if (idsToDelete.length === 0) {
      alert("Please select at least one todo to delete.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete the selected todos?");
    if (!confirmDelete) return;

    try {
      const results = await Promise.all(
        idsToDelete.map((todoId) =>
          fetch(`https://web-production-1de00.up.railway.app/api/v2/delete-table/${todoId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify({
              userId: localStorage.getItem("user_id"),
            }),
          })
        )
      );

      const allOk = results.every((res) => res.ok);
      if (allOk) {
        alert("Todos deleted successfully!");
        document.getElementById("deleteModal").style.display = "none";
        window.location.reload();
      } else {
        alert("Some todos failed to delete.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting todos.");
    }
  });
}
