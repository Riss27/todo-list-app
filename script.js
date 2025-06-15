const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");
const exportBtn = document.getElementById("export-btn");
const importFile = document.getElementById("import-file");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchKeyword = "";
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", (e) => {
  searchKeyword = e.target.value.toLowerCase();
  renderTasks();
});

// Export tasks ke file JSON
exportBtn.addEventListener("click", () => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my-tasks.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import dari file JSON
importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    if (!event.target.result) {
      alert("File is empty!");
      return;
    }

    try {
      const importedTasks = JSON.parse(event.target.result);
      if (Array.isArray(importedTasks)) {
        // Tambahkan createdAt jika belum ada
        importedTasks.forEach(task => {
          if (!task.createdAt) {
            task.createdAt = new Date().toISOString();
          }
        });
        tasks = importedTasks;
        saveTasks();
        renderTasks();
        alert("Tasks imported successfully!");
      } else {
        alert("Invalid file format!");
      }
    } catch (error) {
      alert("Failed to read file.");
    }
  };
  reader.readAsText(file);
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderTasks() {
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
  const matchesFilter =
    currentFilter === "completed"
      ? task.completed
      : currentFilter === "pending"
      ? !task.completed
      : true;

  const matchesSearch = task.text.toLowerCase().includes(searchKeyword);

  return matchesFilter && matchesSearch;
});

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-start";

    const span = document.createElement("span");
    const textDiv = document.createElement("div");

    if (task.completed) {
      textDiv.innerHTML = `✅ <s>${task.text}</s>`;
    } else {
      textDiv.textContent = task.text;
    }

    const dateSmall = document.createElement("small");
    dateSmall.className = "text-muted d-block";
    dateSmall.textContent = formatDate(task.createdAt);

    span.appendChild(textDiv);
    span.appendChild(dateSmall);

    span.addEventListener("click", () => {
      const originalIndex = tasks.indexOf(task);
      tasks[originalIndex].completed = !tasks[originalIndex].completed;
      saveTasks();
      renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-secondary me-1";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        const originalIndex = tasks.indexOf(task);
        tasks[originalIndex].text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", () => {
      const originalIndex = tasks.indexOf(task);
      tasks.splice(originalIndex, 1);
      saveTasks();
      renderTasks();
    });

    const btnGroup = document.createElement("div");
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnGroup);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText) {
    tasks.push({
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    });
    saveTasks();
    renderTasks();
    input.value = "";
  }
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

document.getElementById("filter-group").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    currentFilter = e.target.dataset.filter;

    document.querySelectorAll("#filter-group button").forEach(btn => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    renderTasks();
  }
});

renderTasks();
