const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all"; // <- PINDAHKAN KE SINI

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const span = document.createElement("span");
    if (task.completed) {
      span.classList.add("completed");
      span.innerHTML = `✅ <s>${task.text}</s>`;
    } else {
      span.textContent = task.text;
    }

    span.addEventListener("click", () => {
      const originalIndex = tasks.indexOf(task);
      tasks[originalIndex].completed = !tasks[originalIndex].completed;
      saveTasks();
      renderTasks();
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

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
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

// PANGGIL SETELAH currentFilter DIDEFINISIKAN
renderTasks();
