document.addEventListener("DOMContentLoaded", () => {
    // Modal functionalities
  function toggleModal(triggerId, modalId, show = true) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    if (trigger && modal) {
      trigger.addEventListener("click", () => {
        modal.style.display = show ? "block" : "none";
      });
    }
  }

  // Toggle visibility on hover
  const account = document.getElementById("account");
  const accountOption = document.getElementById("account-option");
  if (account && accountOption) {
    account.addEventListener("mouseover", () => {
      accountOption.style.display = "flex";
    });

    accountOption.addEventListener("mouseleave", () => {
      accountOption.style.display = "none";
    });
  }

  // Modal triggers
  toggleModal("changeProfile", "imgModal", true);
  toggleModal("closeImgModal", "imgModal", false);

  toggleModal("logHistory", "modal", true);
  toggleModal("closeModal", "modal", false);

  toggleModal("create", "createModal", true);
  toggleModal("closeCreateModal", "createModal", false);

  toggleModal("edit", "editModal", true);
  toggleModal("closeEditModal", "editModal", false);

  toggleModal("delete", "deleteModal", true);
  toggleModal("closeDeleteModal", "deleteModal", false);

  window.addEventListener("click", (event) => {
    const createModal = document.getElementById("createModal");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    const modal = document.getElementById("modal");
    const imgModal = document.getElementById("imgModal");
    if (
      event.target === createModal ||
      event.target === editModal ||
      event.target === deleteModal ||
      event.target === modal ||
      event.target === imgModal
    ) {
      createModal.style.display = "none";
      editModal.style.display = "none";
      deleteModal.style.display = "none";
      modal.style.display = "none";
      imgModal.style.display = "none";
    }
  });

  document.getElementById("search").addEventListener("click", (e) => {
    e.stopPropagation();
    const searchInput = document.getElementById("searchInput");

    if (searchInput.style.display === "block") {
      searchInput.style.display = "none";
    } else {
      searchInput.style.display = "block";
      searchInput.focus();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      document.getElementById("searchInput").style.display = "none";
      document.getElementById("modal").style.display = "none";
      document.getElementById("createModal").style.display = "none";
      document.getElementById("editModal").style.display = "none";
      document.getElementById("deleteModal").style.display = "none";
    }
  });

  window.addEventListener("click", (event) => {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("search");
    if (
      searchInput.style.display === "block" &&
      event.target !== searchInput &&
      event.target !== searchBtn
    ) {
      searchInput.style.display = "none";
    }
  });

});