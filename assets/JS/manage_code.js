// State management
let snippets = JSON.parse(localStorage.getItem("snippets")) || [];
let isEditing = false;
let currentSnippetId = null;

// Initialize the app
function init() {
  setupEventListeners();
  renderSnippets();
  updateEmptyState();
}

// Event listeners setup
function setupEventListeners() {
  // Modal buttons
  document
    .getElementById("addSnippetBtn")
    .addEventListener("click", () => openModal());
  document
    .getElementById("addFirstSnippetBtn")
    .addEventListener("click", () => openModal());
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);

  // Form submission
  document
    .getElementById("snippetForm")
    .addEventListener("submit", handleSubmit);

  // Search and filter
  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);
  document
    .getElementById("languageFilter")
    .addEventListener("change", handleSearch);

  // Close modal when clicking outside
  document.getElementById("snippetModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

// Save snippets to localStorage
function saveSnippets() {
  localStorage.setItem("snippets", JSON.stringify(snippets));
  updateEmptyState();
}

// Update empty state visibility
function updateEmptyState(snippetsToCheck = snippets) {
  const isEmpty = !snippetsToCheck || snippetsToCheck.length === 0;
  const searchActive =
    document.getElementById("searchInput").value ||
    document.getElementById("languageFilter").value;
  const emptyState = document.getElementById("emptyState");

  if (isEmpty) {
    emptyState.classList.remove("hidden");
    emptyState.querySelector("h3").textContent = searchActive
      ? "نتیجه‌ای یافت نشد"
      : "قطعه‌کدی یافت نشد";
    emptyState.querySelector("p").textContent = searchActive
      ? "لطفاً عبارت جستجو یا فیلتر را تغییر دهید."
      : "برای شروع، اولین قطعه‌کد خود را اضافه کنید.";
    document.getElementById("snippetsList").classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    document.getElementById("snippetsList").classList.remove("hidden");
  }
}

// Open modal for adding/editing
function openModal(snippet = null) {
  const modal = document.getElementById("snippetModal");
  const form = document.getElementById("snippetForm");

  if (snippet) {
    // Edit mode
    isEditing = true;
    currentSnippetId = snippet.id;
    document.getElementById("modalTitle").textContent = "ویرایش قطعه‌کد";

    // Fill form with snippet data
    form.snippetId.value = snippet.id;
    form.snippetTitle.value = snippet.title;
    form.snippetLanguage.value = snippet.language;
    form.snippetCode.value = snippet.code;
    form.snippetDescription.value = snippet.description || "";
    form.snippetTags.value = snippet.tags ? snippet.tags.join(", ") : "";
  } else {
    // Add mode
    isEditing = false;
    currentSnippetId = null;
    document.getElementById("modalTitle").textContent = "افزودن قطعه‌کد جدید";
    form.reset();
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  form.snippetTitle.focus();
}

// Close modal
function closeModal() {
  const modal = document.getElementById("snippetModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.getElementById("snippetForm").reset();
  isEditing = false;
  currentSnippetId = null;
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const snippetData = {
    id: isEditing ? currentSnippetId : Date.now().toString(),
    title: form.snippetTitle.value.trim(),
    language: form.snippetLanguage.value,
    code: form.snippetCode.value,
    description: form.snippetDescription.value.trim(),
    tags: form.snippetTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    createdAt: isEditing
      ? snippets.find((s) => s.id === currentSnippetId).createdAt
      : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isEditing) {
    const index = snippets.findIndex((s) => s.id === currentSnippetId);
    if (index !== -1) snippets[index] = { ...snippets[index], ...snippetData };
  } else {
    snippets.unshift(snippetData);
  }

  saveSnippets();
  renderSnippets();
  closeModal();
}

// Delete a snippet
function deleteSnippet(id) {
  if (confirm("آیا از حذف این قطعه‌کد اطمینان دارید؟")) {
    snippets = snippets.filter((snippet) => snippet.id !== id);
    saveSnippets();
    renderSnippets();
  }
}

// Handle search and filter functionality
function handleSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const languageFilter = document.getElementById("languageFilter").value;

  const filteredSnippets = snippets.filter((snippet) => {
    // Check search term in title, description, code, and tags
    const searchMatches =
      snippet.title.toLowerCase().includes(searchTerm) ||
      (snippet.description &&
        snippet.description.toLowerCase().includes(searchTerm)) ||
      snippet.code.toLowerCase().includes(searchTerm) ||
      (snippet.tags &&
        snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm)));

    // Check language filter
    const languageMatches =
      !languageFilter || snippet.language === languageFilter;

    return searchMatches && languageMatches;
  });

  renderSnippets(filteredSnippets);
  updateEmptyState(filteredSnippets);
}

// Copy code to clipboard with feedback
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show feedback
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm transition-opacity duration-300";
      toast.textContent = "کد با موفقیت کپی شد!";
      document.body.appendChild(toast);

      // Remove toast after 2 seconds
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

// Get display name for programming languages
function getLanguageName(lang) {
  const languages = {
    javascript: "JavaScript",
    python: "Python",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    bash: "Bash",
    json: "JSON",
    other: "سایر",
  };
  return languages[lang] || lang;
}

// Get language icon class
function getLanguageIcon(lang) {
  const icons = {
    javascript: "text-yellow-400",
    python: "text-blue-400",
    html: "text-orange-500",
    css: "text-blue-500",
    sql: "text-gray-600",
    bash: "text-gray-800",
    json: "text-yellow-600",
    other: "text-gray-400",
  };
  return icons[lang] || "text-gray-400";
}

// Format date to Persian locale
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fa-IR", options);
}

// Render snippets list
function renderSnippets(snippetsToRender = snippets) {
  const snippetsList = document.getElementById("snippetsList");

  if (!snippetsToRender || snippetsToRender.length === 0) {
    updateEmptyState();
    return;
  }

  const snippetElements = snippetsToRender
    .map((snippet) => {
      const languageIcon = getLanguageIcon(snippet.language);
      const languageName = getLanguageName(snippet.language);
      const updatedAt = formatDate(snippet.updatedAt);

      return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden snippet-card hover:shadow-lg transition-shadow duration-200">
                <div class="p-5">
                    <div class="flex justify-between items-start gap-2">
                        <h3 class="text-lg font-medium text-gray-900 truncate flex-1">${snippet.title}</h3>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${languageName}
                        </span>
                    </div>
                    
                    ${
                      snippet.description
                        ? `
                        <p class="mt-2 text-gray-600 text-sm line-clamp-2">
                            ${snippet.description}
                        </p>
                    `
                        : ""
                    }
                    
                    <div class="mt-3 relative group/code">
                        <button onclick="copyToClipboard(\`${snippet.code.replace(/`/g, "\\`")}\`)" 
                                class="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/code:opacity-100 transition-opacity">
                            کپی سریع
                        </button>
                        <pre class="bg-gray-50 p-3 rounded text-sm overflow-x-auto text-gray-800 font-mono text-xs">
                            <code>${snippet.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
                        </pre>
                    </div>
                    
                    ${
                      snippet.tags && snippet.tags.length > 0
                        ? `
                        <div class="mt-3 flex flex-wrap gap-1">
                            ${snippet.tags
                              .map(
                                (tag) => `
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    ${tag}
                                </span>
                            `,
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>آخرین ویرایش: ${updatedAt}</span>
                        <div class="flex gap-2">
                            <button onclick="openModal(${JSON.stringify(snippet).replace(/"/g, "&quot;")})" class="text-blue-600 hover:text-blue-800">
                                ویرایش
                            </button>
                            <button onclick="deleteSnippet('${snippet.id}')" class="text-red-600 hover:text-red-800">
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  snippetsList.innerHTML = snippetElements;
  updateEmptyState();
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", init);
