// --------------------
// TASK MANAGER
// --------------------
let currentFilter = "all";
const taskProgress = document.getElementById("taskProgress");
const progressText = document.getElementById("progressText");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("studyhubTasks")) || [];


// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem("studyhubTasks", JSON.stringify(tasks));
}


// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    filteredTasks.forEach((task) => {

        const originalIndex = tasks.indexOf(task);

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div>
                <button onclick="completeTask(${originalIndex})">✓</button>
                <button onclick="deleteTask(${originalIndex})">🗑</button>
            </div>
        `;

        taskList.appendChild(li);
    });


    taskCount.textContent =
        `${tasks.filter(task => task.completed).length} / ${tasks.length}`;

    updateProgress();
}


// Add task
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// Delete task
function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();
}


// Complete / uncomplete task
function completeTask(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();

    renderTasks();
}


// Button click
addTaskButton.addEventListener("click", addTask);


// Enter key
taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Display saved tasks when page loads
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });

});

const clearCompletedButton =
    document.getElementById("clearCompleted");

clearCompletedButton.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});
// --------------------
// POMODORO TIMER
// --------------------

const timerDisplay = document.getElementById("timer");
const startTimerButton = document.getElementById("startTimer");
const resetTimerButton = document.getElementById("resetTimer");

let timeLeft = 25 * 60;
let timer = null;


function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function startTimer() {

    // Prevent multiple timers running at once
    if (timer !== null) {
        return;
    }

    timer = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;

            studyTime += 25;

            localStorage.setItem("studyhubStudyTime", studyTime);

            studyTimeDisplay.textContent = studyTime;

            alert("Pomodoro complete! 🎉");
        }

    }, 1000);
}


function resetTimer() {

    clearInterval(timer);

    timer = null;
    timeLeft = 25 * 60;

    updateTimerDisplay();
}


startTimerButton.addEventListener("click", startTimer);

resetTimerButton.addEventListener("click", resetTimer);

updateTimerDisplay();

// --------------------
// STUDY TIME
// --------------------

const studyTimeDisplay = document.getElementById("studyTime");

let studyTime = Number(localStorage.getItem("studyhubStudyTime")) || 0;

studyTimeDisplay.textContent = studyTime;

// --------------------
// QUICK NOTES
// --------------------

const notes = document.getElementById("notes");

// Load saved notes when the page opens
const savedNotes = localStorage.getItem("studyhubNotes");

if (savedNotes) {
    notes.value = savedNotes;
}

// Save notes whenever the user types
notes.addEventListener("input", () => {
    localStorage.setItem("studyhubNotes", notes.value);
});

// --------------------
// INITIALIZE APP
// --------------------

document.addEventListener("DOMContentLoaded", () => {
    currentFilter = "all";

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.remove("active");
    });

    document
        .querySelector('[data-filter="all"]')
        .classList.add("active");

    renderTasks();
});
