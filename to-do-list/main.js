const STORAGE_KEY = "todos";
const FILTER_KEY = "filter";

// DOM ELEMENTS
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filters = document.querySelectorAll(".filter");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");

// LOAD FILTER FROM STORAGE
let currentFilter = localStorage.getItem(FILTER_KEY) || "all";

// ----------------------------
// STORAGE HELPERS
// ----------------------------

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, defaultValue) {
    const stored = localStorage.getItem(key);

    return stored ? JSON.parse(stored) : defaultValue;
}

// ----------------------------
// TODO STORAGE FUNCTIONS
// ----------------------------

function loadTodos() {
    return getFromStorage(STORAGE_KEY, []);
}

function saveTodos(todos) {
    saveToStorage(STORAGE_KEY, todos);
}

// ----------------------------
// ADD TODO
// ----------------------------

function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    const todos = loadTodos();

    todos.push(newTodo);

    saveTodos(todos);

    renderTodos();
}

// ----------------------------
// TOGGLE TODO
// ----------------------------

function toggleTodo(id) {
    const todos = loadTodos();

    const todo = todos.find(t => t.id === id);

    if (todo) {
        todo.completed = !todo.completed;

        saveTodos(todos);

        renderTodos();
    }
}

// ----------------------------
// DELETE TODO
// ----------------------------

function deleteTodo(id) {
    let todos = loadTodos();

    todos = todos.filter(t => t.id !== id);

    saveTodos(todos);

    renderTodos();
}

// ----------------------------
// CLEAR COMPLETED
// ----------------------------

function clearCompleted() {
    let todos = loadTodos();

    todos = todos.filter(todo => !todo.completed);

    saveTodos(todos);

    renderTodos();
}

// ----------------------------
// UPDATE ITEMS LEFT
// ----------------------------

function updateItemsLeft(todos) {
    const activeTodos = todos.filter(todo => !todo.completed);

    itemsLeft.textContent =
        `${activeTodos.length} items left`;
}

// ----------------------------
// RENDER TODOS
// ----------------------------

function renderTodos() {
    const todos = loadTodos();

    todoList.innerHTML = "";

    let filteredTodos = todos;

    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");

        if (todo.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${todo.text}</span>

            <div class="task-buttons">
                <button class="complete-btn">
                    ${todo.completed ? "Undo" : "Done"}
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        // COMPLETE BUTTON
        li.querySelector(".complete-btn")
            .addEventListener("click", () => {
                toggleTodo(todo.id);
            });

        // DELETE BUTTON
        li.querySelector(".delete-btn")
            .addEventListener("click", () => {
                deleteTodo(todo.id);
            });

        todoList.appendChild(li);
    });

    updateItemsLeft(todos);

    // UPDATE ACTIVE FILTER BUTTON
    filters.forEach(button => {
        button.classList.remove("active");

        if (button.dataset.filter === currentFilter) {
            button.classList.add("active");
        }
    });
}

// ----------------------------
// FORM SUBMIT
// ----------------------------

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = input.value.trim();

    if (text === "") return;

    addTodo(text);

    input.value = "";
});

// ----------------------------
// FILTER BUTTONS
// ----------------------------

filters.forEach(button => {
    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        // SAVE FILTER PREFERENCE
        localStorage.setItem(FILTER_KEY, currentFilter);

        renderTodos();
    });
});

// ----------------------------
// CLEAR COMPLETED BUTTON
// ----------------------------

clearCompletedBtn.addEventListener("click", () => {
    clearCompleted();
});

// ----------------------------
// INITIALIZE APP
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {
    renderTodos();
});