document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const methodSelect = document.getElementById("method");
  const urlInput = document.getElementById("url");
  const sendBtn = document.getElementById("send");
  const responseElement = document.getElementById("response");
  const responseHeadersElement = document.getElementById("response-headers");
  const statusElement = document.getElementById("status");
  const responseTimeElement = document.getElementById("response-time");
  const loadingElement = document.getElementById("loading");
  const copyResponseBtn = document.getElementById("copy-response");
  const rawBodyToggle = document.getElementById("raw-body-toggle");
  const formBody = document.getElementById("form-body");
  const rawBody = document.getElementById("raw-body");
  const jsonBody = document.getElementById("json-body");
  const formatJsonBtn = document.getElementById("format-json");
  const clearBodyBtn = document.getElementById("clear-body");
  const endpointDocs = document.getElementById("endpoint-docs");
  const documentationTab = document.getElementById("documentation-tab");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const saveRequestBtn = document.getElementById("saveRequestBtn");
  const loadRequestBtn = document.getElementById("loadRequestBtn");
  const savedRequestsModal = new bootstrap.Modal(
    document.getElementById("savedRequestsModal"),
  );
  const saveRequestModal = new bootstrap.Modal(
    document.getElementById("saveRequestModal"),
  );
  const savedRequestsList = document.getElementById("savedRequestsList");
  const noRequestsMessage = document.getElementById("noRequestsMessage");
  const requestNameInput = document.getElementById("requestName");
  const requestDescriptionInput = document.getElementById("requestDescription");
  const confirmSaveRequestBtn = document.getElementById("confirmSaveRequest");
  const clearAllRequestsBtn = document.getElementById("clearAllRequests");
  const savedRequestsSearch = document.getElementById("savedRequestsSearch");
  const clearSearchBtn = document.getElementById("clearSearch");

  // State
  let savedRequests = JSON.parse(localStorage.getItem("savedRequests") || "[]");
  let currentRequestId = null;

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Toggle between form and raw body
  rawBodyToggle.addEventListener("change", function () {
    if (this.checked) {
      formBody.classList.add("d-none");
      rawBody.classList.remove("d-none");
    } else {
      formBody.classList.remove("d-none");
      rawBody.classList.add("d-none");
    }
  });

  // Format JSON in raw body
  formatJsonBtn.addEventListener("click", function () {
    try {
      const json = JSON.parse(jsonBody.value);
      jsonBody.value = JSON.stringify(json, null, 4);
      showToast("JSON با موفقیت فرمت شد", "success");
    } catch (e) {
      showToast("خطا در فرمت JSON", "danger");
      console.error(e);
    }
  });

  // Clear body
  clearBodyBtn.addEventListener("click", function () {
    if (rawBodyToggle.checked) {
      jsonBody.value = "";
    } else {
      document.querySelectorAll(".form-field").forEach((field, index) => {
        if (index > 0) field.remove();
      });
      document.querySelectorAll(".form-key, .form-value").forEach((input) => {
        input.value = "";
      });
    }
  });

  // Copy response to clipboard
  copyResponseBtn.addEventListener("click", function () {
    const responseText = responseElement.textContent;
    navigator.clipboard
      .writeText(responseText)
      .then(() => {
        showToast("پاسخ با موفقیت کپی شد", "success");
      })
      .catch((err) => {
        console.error("خطا در کپی کردن پاسخ:", err);
        showToast("خطا در کپی کردن پاسخ", "danger");
      });
  });

  // Add parameter row
  document.getElementById("add-param").addEventListener("click", function () {
    addNewRow(
      "params-container",
      "param-row",
      "param-key",
      "param-value",
      "remove-param",
    );
  });

  // Add header row
  document.getElementById("add-header").addEventListener("click", function () {
    addNewRow(
      "headers-container",
      "header-row",
      "header-key",
      "header-value",
      "remove-header",
    );
  });

  // Add form field row
  document
    .getElementById("add-form-field")
    .addEventListener("click", function () {
      addNewRow(
        "form-fields",
        "form-field",
        "form-key",
        "form-value",
        "remove-form-field",
      );
    });

  // Remove row event delegation
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-param")) {
      e.target.closest(".param-row").remove();
    } else if (e.target.classList.contains("remove-header")) {
      e.target.closest(".header-row").remove();
    } else if (e.target.classList.contains("remove-form-field")) {
      const fields = document.querySelectorAll(".form-field");
      if (fields.length > 1) {
        e.target.closest(".form-field").remove();
      }
    }
  });

  // Send request
  sendBtn.addEventListener("click", sendRequest);

  // Handle Enter key in URL input
  urlInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendRequest();
    }
  });

  // Function to send API request
  async function sendRequest() {
    const method = methodSelect.value;
    let url = urlInput.value.trim();

    if (!url) {
      showToast("لطفا آدرس API را وارد کنید", "warning");
      return;
    }

    // Add protocol if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
      urlInput.value = url;
    }

    // Get parameters
    const params = {};
    document.querySelectorAll(".param-row").forEach((row) => {
      const key = row.querySelector(".param-key").value.trim();
      const value = row.querySelector(".param-value").value.trim();
      if (key) params[key] = value;
    });

    // Add parameters to URL
    const urlObj = new URL(url);
    Object.keys(params).forEach((key) => {
      urlObj.searchParams.append(key, params[key]);
    });

    // Get headers
    const headers = {};
    document.querySelectorAll(".header-row").forEach((row) => {
      const key = row.querySelector(".header-key").value.trim();
      const value = row.querySelector(".header-value").value.trim();
      if (key) headers[key] = value;
    });

    // Set default Content-Type if not set
    if (["POST", "PUT", "PATCH"].includes(method) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Get request body
    let body = null;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (rawBodyToggle.checked) {
        // Raw JSON body
        try {
          body = jsonBody.value ? JSON.parse(jsonBody.value) : {};
          body = JSON.stringify(body, null, 2);
        } catch (e) {
          showToast("خطا در تجزیه JSON", "danger");
          console.error("JSON Parse Error:", e);
          return;
        }
      } else {
        // Form data
        const formData = {};
        document.querySelectorAll(".form-field").forEach((row) => {
          const key = row.querySelector(".form-key").value.trim();
          const value = row.querySelector(".form-value").value.trim();
          if (key) formData[key] = value;
        });
        body = JSON.stringify(formData, null, 2);
      }
    }

    // Update UI
    statusElement.textContent = "در حال ارسال...";
    statusElement.className = "badge bg-primary";
    loadingElement.classList.remove("d-none");
    responseElement.textContent = "در حال ارسال درخواست...";

    // Record start time
    const startTime = performance.now();

    try {
      const response = await fetch(urlObj.toString(), {
        method,
        headers,
        body: method === "GET" || method === "HEAD" ? null : body,
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });

      // Calculate response time
      const endTime = performance.now();
      const responseTime = (endTime - startTime).toFixed(2);
      responseTimeElement.textContent = `زمان پاسخ: ${responseTime} میلی‌ثانیه`;

      // Process response
      const responseHeaders = [];
      response.headers.forEach((value, key) => {
        responseHeaders.push(`${key}: ${value}`);
      });

      let responseData;
      try {
        responseData = await response.json();
        responseElement.textContent = JSON.stringify(responseData, null, 4);
      } catch (e) {
        const text = await response.text();
        responseElement.textContent = text || "(بدون محتوا)";
      }

      responseHeadersElement.textContent =
        responseHeaders.join("\n") || "(بدون هدر)";

      // Update status
      statusElement.textContent = response.statusText || "اتمام";
      statusElement.className = `badge bg-${response.ok ? "success" : "danger"}`;

      // Generate documentation
      generateDocumentation({
        method,
        url: urlObj.origin + urlObj.pathname,
        params: Object.keys(params).length > 0 ? params : null,
        headers: Object.keys(headers).length > 0 ? headers : null,
        body: body ? JSON.parse(body) : null,
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: responseData,
        },
      });

      // Show documentation tab
      const tab = new bootstrap.Tab(
        document.getElementById("documentation-tab"),
      );
      tab.show();
    } catch (error) {
      console.error("Error:", error);
      responseElement.textContent = `خطا در ارسال درخواست: ${error.message}`;
      statusElement.textContent = "خطا";
      statusElement.className = "badge bg-danger";
    } finally {
      loadingElement.classList.add("d-none");
    }
  }

  // Helper function to add new row
  function addNewRow(
    containerId,
    rowClass,
    keyClass,
    valueClass,
    removeBtnClass,
  ) {
    const container = document.getElementById(containerId);
    const newRow = document.createElement("div");
    newRow.className = `row g-2 mb-2 ${rowClass}`;
    newRow.innerHTML = `
            <div class="col-md-5">
                <input type="text" class="form-control ${keyClass}" placeholder="کلید">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control ${valueClass}" placeholder="مقدار">
            </div>
            <div class="col-md-2">
                <button class="btn btn-sm btn-danger w-100 ${removeBtnClass}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    container.appendChild(newRow);
  }

  // Show toast notification
  function showToast(message, type = "info") {
    const toastContainer = document.createElement("div");
    toastContainer.className = `toast-container position-fixed bottom-0 end-0 p-3`;

    const toast = document.createElement("div");
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.role = "alert";
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toastContainer.remove();
      }, 300);
    }, 3000);
  }

  // Generate API documentation
  function generateDocumentation(data) {
    const { method, url, params, headers, body, response } = data;

    let docHTML = `
            <div class="endpoint">
                <div class="d-flex align-items-center mb-2">
                    <h6 class="mb-0 me-2">${method} <code>${url}</code></h6>
                    <span class="method ${method.toLowerCase()}">${method}</span>
                </div>
                
                ${
                  params
                    ? `
                <div class="mt-3">
                    <h6>پارامترها</h6>
                    <table class="params-table">
                        <thead>
                            <tr>
                                <th>نام</th>
                                <th>مقدار</th>
                                <th>نوع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(params)
                              .map(
                                ([key, value]) => `
                                <tr>
                                    <td><code>${key}</code></td>
                                    <td>${value || "-"}</td>
                                    <td>${typeof value}</td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
                `
                    : ""
                }
                
                ${
                  headers
                    ? `
                <div class="mt-3">
                    <h6>هد‌های درخواست</h6>
                    <table class="params-table">
                        <thead>
                            <tr>
                                <th>کلید</th>
                                <th>مقدار</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(headers)
                              .map(
                                ([key, value]) => `
                                <tr>
                                    <td><code>${key}</code></td>
                                    <td>${value}</td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
                `
                    : ""
                }
                
                ${
                  body
                    ? `
                <div class="mt-3">
                    <h6>بدنه درخواست</h6>
                    <pre class="bg-light p-3 rounded">${JSON.stringify(body, null, 4)}</pre>
                </div>
                `
                    : ""
                }
                
                <div class="mt-3">
                    <h6>پاسخ</h6>
                    <p>وضعیت: <span class="badge bg-${response.status >= 200 && response.status < 300 ? "success" : "danger"}">
                        ${response.status} ${response.statusText}
                    </span></p>
                    
                    ${
                      response.data
                        ? `
                    <div class="mt-2">
                        <h6>داده‌های پاسخ:</h6>
                        <pre class=" p-3 rounded">${JSON.stringify(response.data, null, 4)}</pre>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;

    endpointDocs.innerHTML = docHTML;
  }

  // Initialize with a sample API
  document.querySelector(".param-key").value = "userId";
  document.querySelector(".param-value").value = "1";

  // Add sample headers
  const headerRow = document.querySelector(".header-row");
  headerRow.querySelector(".header-key").value = "Authorization";
  headerRow.querySelector(".header-value").value = "Bearer your_token_here";

  // Add sample form data
  const formRow = document.querySelector(".form-field");
  formRow.querySelector(".form-key").value = "title";
  formRow.querySelector(".form-value").value = "عنوان نمونه";

  // Add another form field
  addNewRow(
    "form-fields",
    "form-field",
    "form-key",
    "form-value",
    "remove-form-field",
  );
  const secondFormRow = document.querySelectorAll(".form-field")[1];
  secondFormRow.querySelector(".form-key").value = "body";
  secondFormRow.querySelector(".form-value").value =
    "متن نمونه برای بدنه درخواست";

  // Initialize dark mode
  initDarkMode();

  // Event Listeners
  darkModeToggle.addEventListener("click", toggleDarkMode);
  saveRequestBtn.addEventListener("click", showSaveRequestModal);
  loadRequestBtn.addEventListener("click", showSavedRequests);
  confirmSaveRequestBtn.addEventListener("click", saveRequest);
  clearAllRequestsBtn.addEventListener("click", clearAllRequests);
  savedRequestsSearch.addEventListener("input", filterSavedRequests);
  clearSearchBtn.addEventListener("click", () => {
    savedRequestsSearch.value = "";
    filterSavedRequests();
  });

  // Load saved requests if any
  if (savedRequests.length > 0) {
    updateNoRequestsMessage();
  }

  // Dark Mode Functions
  function initDarkMode() {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
      document.body.classList.remove("dark-mode");
      darkModeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
    }
  }

  function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
    darkModeToggle.innerHTML = isDarkMode
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
  }

  // Save/Load Request Functions
  function showSaveRequestModal() {
    requestNameInput.value = "";
    requestDescriptionInput.value = "";
    currentRequestId = null;
    saveRequestModal.show();
  }

  function saveRequest() {
    const name = requestNameInput.value.trim();
    if (!name) {
      showToast("لطفا یک نام برای درخواست وارد کنید", "warning");
      return;
    }

    const request = {
      id: currentRequestId || Date.now().toString(),
      name,
      description: requestDescriptionInput.value.trim(),
      method: methodSelect.value,
      url: urlInput.value,
      params: getFormData("params-container", "param-key", "param-value"),
      headers: getFormData("headers-container", "header-key", "header-value"),
      body: rawBodyToggle.checked
        ? jsonBody.value
        : getFormData("form-fields", "form-key", "form-value"),
      isRawBody: rawBodyToggle.checked,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentRequestId) {
      // Update existing request
      const index = savedRequests.findIndex((r) => r.id === currentRequestId);
      if (index !== -1) {
        savedRequests[index] = request;
      }
    } else {
      // Add new request
      savedRequests.unshift(request);
    }

    saveRequestsToStorage();
    saveRequestModal.hide();
    showToast(
      `درخواست با موفقیت ${currentRequestId ? "به‌روزرسانی" : "ذخیره"} شد`,
      "success",
    );
  }

  function getFormData(containerId, keyClass, valueClass) {
    const data = {};
    const container = document.getElementById(containerId);
    container.querySelectorAll(`.${keyClass}`).forEach((input, index) => {
      const key = input.value.trim();
      const value = container
        .querySelectorAll(`.${valueClass}`)
        [index].value.trim();
      if (key) {
        data[key] = value;
      }
    });
    return Object.keys(data).length > 0 ? data : null;
  }

  function showSavedRequests() {
    renderSavedRequests();
    savedRequestsModal.show();
  }

  function renderSavedRequests(requests = savedRequests) {
    savedRequestsList.innerHTML = "";

    if (requests.length === 0) {
      noRequestsMessage.style.display = "block";
      return;
    }

    noRequestsMessage.style.display = "none";

    requests.forEach((request) => {
      const item = document.createElement("div");
      item.className = "saved-request-item";
      item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="saved-request-method ${request.method.toLowerCase()}">${request.method}</span>
                        <span class="saved-request-name">${request.name}</span>
                        <small class="text-muted d-block mt-1">${new Date(request.updatedAt).toLocaleString("fa-IR")}</small>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary load-request" data-id="${request.id}">
                            <i class="bi bi-arrow-left"></i> بارگذاری
                        </button>
                        <button class="btn btn-outline-danger delete-request" data-id="${request.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <span class="saved-request-url" title="${request.url}">${request.url}</span>
                ${request.description ? `<p class="text-muted mt-2 mb-0 small">${request.description}</p>` : ""}
            `;

      savedRequestsList.appendChild(item);
    });

    // Add event listeners to the new buttons
    document.querySelectorAll(".load-request").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        loadRequest(e.target.closest(".load-request").dataset.id);
      });
    });

    document.querySelectorAll(".delete-request").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteRequest(e.target.closest(".delete-request").dataset.id);
      });
    });
  }

  function loadRequest(id) {
    const request = savedRequests.find((r) => r.id === id);
    if (!request) return;

    // Set method and URL
    methodSelect.value = request.method;
    urlInput.value = request.url;

    // Set params
    const paramsContainer = document.getElementById("params-container");
    paramsContainer.innerHTML = "";
    if (request.params) {
      Object.entries(request.params).forEach(([key, value]) => {
        addNewRow(
          "params-container",
          "param-row",
          "param-key",
          "param-value",
          "remove-param",
        );
        const rows = paramsContainer.querySelectorAll(".param-row");
        const lastRow = rows[rows.length - 1];
        lastRow.querySelector(".param-key").value = key;
        lastRow.querySelector(".param-value").value = value;
      });
    } else {
      addNewRow(
        "params-container",
        "param-row",
        "param-key",
        "param-value",
        "remove-param",
      );
    }

    // Set headers
    const headersContainer = document.getElementById("headers-container");
    headersContainer.innerHTML = "";
    if (request.headers) {
      Object.entries(request.headers).forEach(([key, value]) => {
        addNewRow(
          "headers-container",
          "header-row",
          "header-key",
          "header-value",
          "remove-header",
        );
        const rows = headersContainer.querySelectorAll(".header-row");
        const lastRow = rows[rows.length - 1];
        lastRow.querySelector(".header-key").value = key;
        lastRow.querySelector(".header-value").value = value;
      });
    } else {
      addNewRow(
        "headers-container",
        "header-row",
        "header-key",
        "header-value",
        "remove-header",
      );
    }

    // Set body
    if (request.isRawBody) {
      rawBodyToggle.checked = true;
      formBody.classList.add("d-none");
      rawBody.classList.remove("d-none");
      jsonBody.value =
        typeof request.body === "string"
          ? request.body
          : JSON.stringify(request.body, null, 2);
    } else {
      rawBodyToggle.checked = false;
      formBody.classList.remove("d-none");
      rawBody.classList.add("d-none");

      const formFieldsContainer = document.getElementById("form-fields");
      formFieldsContainer.innerHTML = "";

      if (request.body && Object.keys(request.body).length > 0) {
        Object.entries(request.body).forEach(([key, value]) => {
          addNewRow(
            "form-fields",
            "form-field",
            "form-key",
            "form-value",
            "remove-form-field",
          );
          const rows = formFieldsContainer.querySelectorAll(".form-field");
          const lastRow = rows[rows.length - 1];
          lastRow.querySelector(".form-key").value = key;
          lastRow.querySelector(".form-value").value = value;
        });
      } else {
        addNewRow(
          "form-fields",
          "form-field",
          "form-key",
          "form-value",
          "remove-form-field",
        );
      }
    }

    savedRequestsModal.hide();
    showToast("درخواست با موفقیت بارگذاری شد", "success");
  }

  function deleteRequest(id) {
    if (!confirm("آیا از حذف این درخواست اطمینان دارید؟")) return;

    savedRequests = savedRequests.filter((r) => r.id !== id);
    saveRequestsToStorage();
    renderSavedRequests();
    showToast("درخواست با موفقیت حذف شد", "success");
  }

  function clearAllRequests() {
    if (
      savedRequests.length === 0 ||
      !confirm("آیا از حذف تمام درخواست‌های ذخیره شده اطمینان دارید؟")
    )
      return;

    savedRequests = [];
    saveRequestsToStorage();
    renderSavedRequests();
    showToast("تمامی درخواست‌های ذخیره شده حذف شدند", "success");
  }

  function filterSavedRequests() {
    const searchTerm = savedRequestsSearch.value.toLowerCase();
    if (!searchTerm) {
      renderSavedRequests(savedRequests);
      return;
    }

    const filtered = savedRequests.filter(
      (request) =>
        request.name.toLowerCase().includes(searchTerm) ||
        request.url.toLowerCase().includes(searchTerm) ||
        (request.description &&
          request.description.toLowerCase().includes(searchTerm)) ||
        request.method.toLowerCase().includes(searchTerm),
    );

    renderSavedRequests(filtered);
  }

  function saveRequestsToStorage() {
    localStorage.setItem("savedRequests", JSON.stringify(savedRequests));
    updateNoRequestsMessage();
  }

  function updateNoRequestsMessage() {
    noRequestsMessage.style.display =
      savedRequests.length === 0 ? "block" : "none";
  }
});
