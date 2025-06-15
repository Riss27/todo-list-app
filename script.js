const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = input.value.trim();
  if (task !== "") {
    addTask(task);
    input.value = "";
  }
});

function addTask(task) {
  const li = document.createElement("li");
  li.textContent = task;

  const btn = document.createElement("button");
  btn.textContent = "❌";
  btn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(btn);
  list.appendChild(li);
}
