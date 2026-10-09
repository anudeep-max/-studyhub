// --------------------
// SHARED DATE / STORAGE HELPERS
// --------------------
const STORAGE_KEYS = {
    tasks: "studyhubTasks",
    notes: "studyhubNotes",
    studyTimeLegacy: "studyhubStudyTime",
    studyStats: "studyhubStudyStats",
    timerState: "studyhubTimerState",
    dailyGoal: "studyhubDailyGoalMinutes"
};

function localDateKey(date = new Date()) {
    // Use local calendar dates so the streak follows the user's own timezone.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function dateFromKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function shiftDateKey(key, amount) {
    const date = dateFromKey(key);
    date.setDate(date.getDate() + amount);
    return localDateKey(date);
}

function formatDuration(totalSeconds) {
    // Keep seconds visible so study-time stats visibly update every second.
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) return `${hours} hr ${minutes} min ${remainingSeconds} sec`;
    if (minutes > 0) return `${minutes} min ${remainingSeconds} sec`;
    return `${remainingSeconds} sec`;
}

function readJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.warn(`Could not read ${key} from localStorage.`, error);
        return fallback;
    }
}

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

let tasks = readJSON(STORAGE_KEYS.tasks, []);
if (!Array.isArray(tasks)) tasks = [];

function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function updateProgress() {
    const completedCount = tasks.filter(task => task.completed).length;
    const percentage = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
    taskProgress.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% completed`;
}

function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => {
            if (currentFilter === "active") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true;
        });

    filteredTasks.forEach(({ task, index }) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const label = document.createElement("span");
        label.textContent = task.text;
        li.appendChild(label);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.textContent = task.completed ? "↶" : "✓";
        completeButton.setAttribute("aria-label", task.completed ? "Mark task active" : "Complete task");
        completeButton.addEventListener("click", () => completeTask(index));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "🗑";
        deleteButton.setAttribute("aria-label", "Delete task");
        deleteButton.addEventListener("click", () => deleteTask(index));

        actions.append(completeButton, deleteButton);
        li.appendChild(actions);
        taskList.appendChild(li);
    });

    taskCount.textContent = `${tasks.filter(task => task.completed).length} / ${tasks.length}`;
    updateProgress();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
    taskInput.focus();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function completeTask(index) {
    if (!tasks[index]) return;
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        renderTasks();
    });
});

document.getElementById("clearCompleted").addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// --------------------
// STUDY STATS, DAILY GOAL, STREAK AND HISTORY
// --------------------
const studyTimeDisplay = document.getElementById("studyTime");
const todayStudyTimeDisplay = document.getElementById("todayStudyTime");
const dayStreakDisplay = document.getElementById("dayStreak");
const longestStreakDisplay = document.getElementById("longestStreak");
const dailyGoalInput = document.getElementById("dailyGoalInput");
const dailyGoalProgress = document.getElementById("dailyGoalProgress");
const dailyGoalStatus = document.getElementById("dailyGoalStatus");
const goalMessage = document.getElementById("goalMessage");
const studyHistory = document.getElementById("studyHistory");
const goalProgressTrack = document.querySelector(".goal-progress");

const legacyStudyMinutes = Math.max(0, Number(localStorage.getItem(STORAGE_KEYS.studyTimeLegacy)) || 0);
let studyStats = readJSON(STORAGE_KEYS.studyStats, null);
if (!studyStats || typeof studyStats !== "object" || !studyStats.dailySeconds) {
    // Preserve the old all-time total without falsely assigning it to today's history.
    studyStats = {
        totalSeconds: Math.round(legacyStudyMinutes * 60),
        dailySeconds: {},
        completedPomodoroDates: []
    };
}
if (!Number.isFinite(studyStats.totalSeconds) || studyStats.totalSeconds < 0) studyStats.totalSeconds = 0;
if (!studyStats.dailySeconds || typeof studyStats.dailySeconds !== "object") studyStats.dailySeconds = {};
if (!Array.isArray(studyStats.completedPomodoroDates)) studyStats.completedPomodoroDates = [];

let dailyGoalMinutes = Number(localStorage.getItem(STORAGE_KEYS.dailyGoal)) || 120;
dailyGoalMinutes = Math.min(1440, Math.max(1, Math.round(dailyGoalMinutes)));
dailyGoalInput.value = String(dailyGoalMinutes);

function saveStudyStats() {
    localStorage.setItem(STORAGE_KEYS.studyStats, JSON.stringify(studyStats));
    // Keep the original key updated for compatibility with any older UI code.
    localStorage.setItem(STORAGE_KEYS.studyTimeLegacy, String(Math.floor(studyStats.totalSeconds / 60)));
}

function getTodaySeconds() {
    return Math.max(0, Number(studyStats.dailySeconds[localDateKey()]) || 0);
}

function getStreakInfo() {
    const completedDates = [...new Set(studyStats.completedPomodoroDates)].sort();
    if (!completedDates.length) return { current: 0, longest: 0 };

    let longest = 1;
    let run = 1;
    for (let i = 1; i < completedDates.length; i++) {
        if (shiftDateKey(completedDates[i - 1], 1) === completedDates[i]) {
            run += 1;
            longest = Math.max(longest, run);
        } else {
            run = 1;
        }
    }

    const today = localDateKey();
    const yesterday = shiftDateKey(today, -1);
    let current = 0;
    let cursor = completedDates.includes(today) ? today : (completedDates.includes(yesterday) ? yesterday : null);
    while (cursor && completedDates.includes(cursor)) {
        current += 1;
        cursor = shiftDateKey(cursor, -1);
    }
    return { current, longest };
}

function renderStudyHistory() {
    studyHistory.innerHTML = "";
    const today = localDateKey();
    const entries = [];
    for (let offset = 6; offset >= 0; offset--) {
        const key = shiftDateKey(today, -offset);
        const seconds = Math.max(0, Number(studyStats.dailySeconds[key]) || 0);
        entries.push({ key, seconds });
    }
    const maxSeconds = Math.max(1, ...entries.map(entry => entry.seconds));

    entries.forEach(({ key, seconds }) => {
        const row = document.createElement("div");
        row.className = "history-row";

        const dateLabel = document.createElement("span");
        const date = dateFromKey(key);
        dateLabel.className = "history-date";
        dateLabel.textContent = key === today ? "Today" : date.toLocaleDateString(undefined, { weekday: "short" });

        const track = document.createElement("div");
        track.className = "history-bar-track";
        track.setAttribute("aria-label", `${key}: ${formatDuration(seconds)}`);
        const bar = document.createElement("div");
        bar.className = "history-bar";
        bar.style.width = `${seconds ? Math.max(2, (seconds / maxSeconds) * 100) : 0}%`;
        track.appendChild(bar);

        const value = document.createElement("span");
        value.className = "history-value";
        value.textContent = formatDuration(seconds);

        row.append(dateLabel, track, value);
        studyHistory.appendChild(row);
    });
}

function renderStudyStats() {
    studyTimeDisplay.textContent = formatDuration(studyStats.totalSeconds);
    todayStudyTimeDisplay.textContent = formatDuration(getTodaySeconds());

    const streak = getStreakInfo();
    dayStreakDisplay.textContent = String(streak.current);
    longestStreakDisplay.textContent = `Longest streak: ${streak.longest} ${streak.longest === 1 ? "day" : "days"}`;

    const goalSeconds = dailyGoalMinutes * 60;
    const todaySeconds = getTodaySeconds();
    const percentage = Math.min(100, Math.floor((todaySeconds / goalSeconds) * 100));
    dailyGoalProgress.style.width = `${percentage}%`;
    goalProgressTrack.setAttribute("aria-valuenow", String(percentage));
    dailyGoalStatus.textContent = `${percentage}% of your ${dailyGoalMinutes}-minute goal`;
    goalMessage.textContent = todaySeconds >= goalSeconds
        ? "Daily goal reached — amazing work! 🎉"
        : `${formatDuration(goalSeconds - todaySeconds)} left to reach today's goal. Keep going!`;

    renderStudyHistory();
}

document.getElementById("saveDailyGoal").addEventListener("click", () => {
    const value = Number(dailyGoalInput.value);
    if (!Number.isFinite(value) || value < 1 || value > 1440) {
        goalMessage.textContent = "Choose a daily goal between 1 and 1440 minutes.";
        dailyGoalInput.value = String(dailyGoalMinutes);
        return;
    }
    dailyGoalMinutes = Math.round(value);
    localStorage.setItem(STORAGE_KEYS.dailyGoal, String(dailyGoalMinutes));
    dailyGoalInput.value = String(dailyGoalMinutes);
    renderStudyStats();
});

// --------------------
// POMODORO TIMER
// --------------------
const timerDisplay = document.getElementById("timer");
const startTimerButton = document.getElementById("startTimer");
const resetTimerButton = document.getElementById("resetTimer");
const DEFAULT_SESSION_SECONDS = 25 * 60;

const savedTimerState = readJSON(STORAGE_KEYS.timerState, {});
let timeLeft = Number.isInteger(savedTimerState.timeLeft) && savedTimerState.timeLeft >= 0
    ? Math.min(savedTimerState.timeLeft, DEFAULT_SESSION_SECONDS)
    : DEFAULT_SESSION_SECONDS;
let timer = null;
let lastTickAt = null;

// The timer deliberately resumes paused after a reload. This avoids counting time
// while the page is closed or the browser/device is asleep.
function saveTimerState() {
    localStorage.setItem(STORAGE_KEYS.timerState, JSON.stringify({ timeLeft, running: false }));
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    startTimerButton.textContent = timer === null ? "Start" : "Pause";
}

function recordStudySeconds(seconds) {
    if (seconds <= 0) return;
    const today = localDateKey();
    studyStats.dailySeconds[today] = (Number(studyStats.dailySeconds[today]) || 0) + seconds;
    studyStats.totalSeconds += seconds;
    saveStudyStats();
    renderStudyStats();
}

function completePomodoro() {
    const today = localDateKey();
    if (!studyStats.completedPomodoroDates.includes(today)) {
        studyStats.completedPomodoroDates.push(today);
    }
    saveStudyStats();
    renderStudyStats();
    alert("Pomodoro complete! 🎉 Take a short break if you need one.");
}

function tickTimer() {
    const now = Date.now();
    const elapsed = Math.max(1, Math.floor((now - lastTickAt) / 1000));
    lastTickAt = now;
    const trackedSeconds = Math.min(elapsed, timeLeft);
    timeLeft = Math.max(0, timeLeft - elapsed);
    recordStudySeconds(trackedSeconds);
    updateTimerDisplay();
    saveTimerState();

    if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        lastTickAt = null;
        timeLeft = 0;
        saveTimerState();
        updateTimerDisplay();
        completePomodoro();
        timeLeft = DEFAULT_SESSION_SECONDS;
        saveTimerState();
        updateTimerDisplay();
    }
}

function startTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
        lastTickAt = null;
        saveTimerState();
        updateTimerDisplay();
        return;
    }
    if (timeLeft <= 0) timeLeft = DEFAULT_SESSION_SECONDS;
    lastTickAt = Date.now();
    timer = setInterval(tickTimer, 1000);
    saveTimerState();
    updateTimerDisplay();
}

function resetTimer() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    lastTickAt = null;
    timeLeft = DEFAULT_SESSION_SECONDS;
    saveTimerState();
    updateTimerDisplay();
}

startTimerButton.addEventListener("click", startTimer);
resetTimerButton.addEventListener("click", resetTimer);

// Pause when leaving/reloading the page, preserving remaining time and recorded study.
window.addEventListener("pagehide", () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
    lastTickAt = null;
    saveTimerState();
});

// --------------------
// QUICK NOTES
// --------------------
const notes = document.getElementById("notes");
notes.value = localStorage.getItem(STORAGE_KEYS.notes) || "";
notes.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEYS.notes, notes.value);
});

// --------------------
// INITIALIZE APP
// --------------------
renderTasks();
renderStudyStats();
updateTimerDisplay();
saveStudyStats();
saveTimerState();
