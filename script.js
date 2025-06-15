const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");

// Load tasks on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Handle form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = input.value.trim();
  if (task !== "") {
    addTask(task);
    saveTask(task);
    input.value = "";
  }
});

// Add task to the UI
function addTask(task, completed = false) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";

  const span = document.createElement("span");
  span.textContent = task;
  if (completed) span.classList.add("completed");

  // Toggle complete on click
  span.addEventListener("click", () => {
    span.classList.toggle("completed");
    updateLocalStorage();
  });

  // Delete button
  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.className = "btn btn-sm btn-outline-danger ms-2";
  btn.addEventListener("click", () => {
    li.remove();
    updateLocalStorage();
  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}

// Save new task
function saveTask(task) {
  const tasks = getTasks();
  tasks.push({ text: task, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach((t) => addTask(t.text, t.completed));
}

// Get tasks from localStorage
function getTasks() {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}

// Update localStorage after edits
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#todo-list li").forEach((li) => {
    const text = li.querySelector("span").textContent;
    const completed = li.querySelector("span").classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear all
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    list.innerHTML = "";
    localStorage.removeItem("tasks");
  }
});
