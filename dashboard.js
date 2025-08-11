document.addEventListener("DOMContentLoaded", () => {
  // ========== Constants ==========
  const BASE_URL = "https://web-production-1de00.up.railway.app";
  const storedUsername = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("jwt_token");

  const greeting = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");

  // ========== Functions ==========

  function preventBackNavigation() {
    window.history.forward();
  }

  function redirectIfNotLoggedIn() {
    if (!storedUsername || !token) {
      window.location.href = "login.html";
    }
  }

  function setGreeting() {
    if (storedUsername && greeting) {
      greeting.textContent = `Hello, ${storedUsername}!`;
    }
  }

  function setProfileImages() {
    document.querySelectorAll('[id="profile-pic"]').forEach((img) => {
      img.src = `${BASE_URL}/user/profile-image/${userId}`;
      img.onerror = () => {
        img.src =
          "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/person.svg";
      };
    });
  }

  function renderTodos(todos) {
    const listConfigs = [
      { id: "todo-list", editable: false },
      { id: "todo-list-edit", editable: true },
      { id: "todo-list-delete", editable: false },
    ];

    listConfigs.forEach(({ id, editable }) => {
      const list = document.getElementById(id);
      todos.forEach((todo) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${todo.id}</td>
          <td>${todo.userId}</td>
          <td ${editable ? 'contenteditable="true"' : ""}>${todo.title}</td>
          <td ${editable ? 'contenteditable="true"' : ""}>${
          todo.completed ? "Yes" : "No"
        }</td>
        `;
        list.appendChild(row);
      });
    });
  }

  async function fetchTodos() {
    try {
      const res = await fetch(`${BASE_URL}/api/v2/read/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      renderTodos(data.data || []);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  }

  async function logout() {
    try {
      const res = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId) }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.clear();
        alert("Logged out successfully!");
        window.location.href = "index.html";
      } else {
        alert(result.message || "Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout.");
    }
  }

  async function fetchLoginHistory() {
    try {
      const res = await fetch(`${BASE_URL}/user/audit/${userId}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const auditList = document.getElementById("history-list");

      const browserLogos = {
        Chrome: "icons/chrome.png",
        Firefox: "icons/firefox.png",
        Edge: "icons/edge.png",
        Safari: "icons/safari.png",
        Opera: "icons/opera.png",
        Brave: "icons/brave.png",
        default: "icons/default.png",
      };

      data.slice(0, 10).forEach((audit) => {
        const logoPath = browserLogos[audit.browser] || browserLogos.default;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${audit.timestamp}</td>
          <td>
            <img src="${logoPath}" width="20" style="vertical-align: middle; margin-right: 5px;">${audit.browser}
          </td>
        `;
        auditList.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching audit:", err);
    }
  }

  function setupSearch(inputId, listId) {
    document.getElementById(inputId).addEventListener("keyup", (e) => {
      const filter = e.target.value.toLowerCase();
      const rows = document.getElementById(listId).getElementsByTagName("tr");
      for (let row of rows) {
        const cells = row.getElementsByTagName("td");
        let match = Array.from(cells).some((cell) =>
          cell.textContent.toLowerCase().includes(filter)
        );
        row.style.display = match ? "" : "none";
      }
    });
  }

  // ========== Init ==========

  setTimeout(preventBackNavigation, 0);
  window.onunload = () => null;

  redirectIfNotLoggedIn();
  setGreeting();
  setProfileImages();
  fetchTodos();
  fetchLoginHistory();

  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  setupSearch("searchInput", "todo-list");
  setupSearch("editSearchInput", "todo-list-edit");
  setupSearch("deleteSearchInput", "todo-list-delete");

  setupCreateTodoHandler();
  setupEditTodoHandler();
  setupDeleteTodoHandler();
});
