let currentFilter = "All"; // Default filter

// Function to switch between forms
function switchForm(form) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'none';

    document.getElementById(`${form}-form`).style.display = 'block';
}

// Handle Login (for now, just demo purposes)
function handleLogin(event) {
    event.preventDefault();
    
    // Simulate login success (you can add real authentication here)
    alert('Logged in successfully!');
    
    // Show the task manager after login
    document.getElementById('task-manager').style.display = 'block';
    document.querySelector('.auth-forms').style.display = 'none'; // Hide login/signup forms
}

// Handle Sign Up (for now, just demo purposes)
function handleSignUp(event) {
    event.preventDefault();
    alert('Account created successfully! Now login.');
    switchForm('login'); // Switches to login form after sign-up
}

// Handle Forgot Password (for now, just demo purposes)
function handleForgotPassword(event) {
    event.preventDefault();
    alert('Password reset link sent to your email!');
    switchForm('login');
}

// Select the form, input fields, and task list
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');
const taskDateInput = document.getElementById('task-date');  // Assuming this is the date input
const taskPriorityInput = document.getElementById('task-priority');  // Select priority
const taskCategoryInput = document.getElementById('task-category');  // Select category

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {loadTasks(); setupFilters();});

// Add event listener for form submission
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTask();
});

// Add a new task
function addTask() {
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const taskDate = taskDateInput.value; 
    const taskPriority = taskPriorityInput.value; 
    const taskCategory = taskCategoryInput.value; 

    if (title === '') return;  // 

    // Create task object
    const task = {
        id: Date.now(),
        title: title,
        description: description,
        date: taskDate,             
        priority: taskPriority,    
        category: taskCategory,
        completed: false
    };

    // Add task to the list and localStorage
    saveTask(task);

    // to sort the priority
    filterTasks(currentFilter)

    // displayTask(task);

    // Clear form fields
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskDateInput.value = '';
    taskPriorityInput.value = '';    
    taskCategoryInput.value = ''; 


    // Ensuring that placeholder category is displayed
    taskCategoryInput.options[0].selected = true;
}

// Display a task in the task list
function displayTask(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'complete' : '';
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        <div>
            <strong>${task.title} (${task.category})</strong>
            <p>${task.description}</p>
            <p><em>Due Date: ${task.date}</em></p>
            <p><em>Priority: ${task.priority}</em></p>
            <p><em>Category: ${task.category}</em></p>
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
// Load tasks from localStorage and sort by priority
function loadTasks() {
    const tasks = getTasks();

    // Sort tasks based on priority: High > Medium > Low
    tasks.sort((a, b) => {
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };

        const aPriority = a.priority.charAt(0).toUpperCase() + a.priority.slice(1).toLowerCase();
        const bPriority = b.priority.charAt(0).toUpperCase() + b.priority.slice(1).toLowerCase();

        return priorityOrder[bPriority] - priorityOrder[aPriority]; 
    });

    // Clear the task list before adding sorted tasks
    taskList.innerHTML = '';

    // Display each task
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

// Displaying tasks based on tags
function filterTasks(filter) {
    const tasks = getTasks();

    const filteredTasks = tasks.filter(task => {
        if (filter.toLowerCase() === "all") return true; // Show all if 'All' is selected
        return task.category.toLowerCase() === filter.toLowerCase();
    });

    // sort by priority
    filteredTasks.sort((a, b) => {
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };

        const aPriority = a.priority.charAt(0).toUpperCase() + a.priority.slice(1).toLowerCase();
        const bPriority = b.priority.charAt(0).toUpperCase() + b.priority.slice(1).toLowerCase();

        return priorityOrder[bPriority] - priorityOrder[aPriority]; 
    });


    // Clear task list before showing filtered tasks
    taskList.innerHTML = '';

    // Display filtered tasks
    filteredTasks.forEach(displayTask);
}


function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener("click", function(){
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update the current filter
            currentFilter = filter;

            // Filter tasks
            filterTasks(currentFilter);
        });
    });
}
