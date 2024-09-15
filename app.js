// Select the form, input fields, and task list
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener for form submission
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTask();
});

// Add a new task
function addTask() {
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();

    if (title === '') return;  // Don't allow empty titles

    // Create task object
    const task = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false
    };

    // Add task to the list and localStorage
    saveTask(task);
    displayTask(task);

    // Clear form fields
    taskTitleInput.value = '';
    taskDescInput.value = '';
}

// Display a task in the task list
function displayTask(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'complete' : '';
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        <div>
            <strong>${task.title}</strong>
            <p>${task.description}</p>
        </div>
        <div>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Remove</button>
        </div>
    `;
    
    // Add event listeners for complete and delete buttons
    li.querySelector('.complete-btn').addEventListener('click', function() {
        toggleComplete(task.id);
    });
    li.querySelector('.delete-btn').addEventListener('click', function() {
        deleteTask(task.id);
    });

    // Add the task to the task list in the DOM
    taskList.appendChild(li);
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(displayTask);
}

// Get tasks from localStorage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Save a task to localStorage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle task completion status
function toggleComplete(id) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex >= 0) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshTaskList();
    }
}

// Delete a task
function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

// Refresh the task list in the DOM
function refreshTaskList() {
    taskList.innerHTML = '';
    loadTasks();
}
