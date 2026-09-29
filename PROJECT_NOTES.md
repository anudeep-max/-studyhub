# StudyHub - Project Notes

## Why I built this

I wanted to build a small web application while learning frontend development instead of only following tutorials.

I decided to make a productivity dashboard that I could actually use for studying. That became StudyHub.

I started with a basic HTML, CSS and JavaScript version and focused on getting the core features working before thinking about adding a backend.

---

## How the application works

StudyHub is currently a client-side web application.

The basic flow is:

**HTML → CSS → JavaScript → localStorage**

HTML provides the structure, CSS handles the design and layout, JavaScript handles the application logic, and localStorage is used to keep the user's data after refreshing the page.

There is currently no backend or database.

---

## HTML

I used HTML to create the main sections of the application:

- Header
- Productivity summary cards
- Task manager
- Pomodoro timer
- Quick notes

I gave important elements IDs and classes so that JavaScript could access and update them.

---

## CSS

I used CSS to design the complete interface.

I wanted something different from the usual dark developer dashboard, so I went with a soft pink and floral design.

I used:

- CSS Grid
- Flexbox
- Responsive layout
- Rounded cards
- Glass-style cards
- Shadows
- Borders
- Custom background image
- Different styles for completed tasks
- Different states for active filters

One problem I had was that the background sometimes made the text difficult to read.

I fixed this by adding a translucent overlay, increasing the card opacity and adjusting the text colors.

---

# JavaScript

JavaScript is responsible for most of the actual functionality.

I used:

- Arrays
- Objects
- DOM manipulation
- Event listeners
- Functions
- setInterval()
- localStorage

---

## Task Manager

Tasks are stored as objects inside an array.

Each task contains its text and whether it has been completed.

A task has two main properties:

**text** - the task description

**completed** - whether the task is completed or not

### Adding tasks

When the user enters a task and clicks Add:

1. The input value is read.
2. Empty spaces are removed.
3. A new task object is created.
4. The task is added to the tasks array.
5. The updated array is saved to localStorage.
6. The task list is rendered again.
7. The input field is cleared.

I also added an event listener for the Enter key so a task can be added without clicking the button.

### Completing tasks

Each task has a complete button.

When it is clicked, JavaScript finds the corresponding task using its index and changes its completed state.

The updated tasks are then saved and the UI is rendered again.

Completed tasks get a different appearance and a strikethrough.

### Deleting tasks

The delete button removes the selected task from the tasks array.

After deleting it, the updated array is saved to localStorage and the task list is rendered again.

### Task filters

There are three filters:

- All
- Active
- Completed

The same tasks array is used for all three.

JavaScript filters the array depending on which filter the user selects.

The All filter shows every task.

The Active filter shows only unfinished tasks.

The Completed filter shows only finished tasks.

### Progress tracking

The application calculates the percentage of completed tasks using:

**completed tasks / total tasks × 100**

This percentage is used to update the progress bar and the percentage displayed on the page.

---

# Pomodoro Timer

The Pomodoro timer starts at 25 minutes.

I implemented the countdown using JavaScript's setInterval() function.

Every second, the remaining time is decreased by one second and the timer display is updated.

The timer follows this basic flow:

**25:00 → 24:59 → 24:58 → ... → 00:00**

When the timer reaches zero:

1. The interval is stopped.
2. 25 minutes are added to the study time.
3. The study time is saved to localStorage.
4. The study time display is updated.
5. A completion message is shown.

The current version records study time only after completing a full 25-minute Pomodoro.

If the user resets the timer before completing the session, those minutes are not added to the study time.

---

# Quick Notes

The Notes section uses a textarea.

Whenever the user types something, an input event is triggered.

The current contents are saved to localStorage.

When the application loads, the saved notes are retrieved and placed back into the textarea.

This means refreshing the page does not remove the notes.

---

# localStorage

Since I don't have a backend in this version, I used the browser's localStorage for persistence.

The application stores:

- Tasks
- Completed task status
- Study time
- Notes

This means refreshing the page does not remove the saved data.

One limitation is that localStorage is specific to the browser and device.

The data is not connected to a user account and cannot be synchronized between different devices.

---

# Problems I faced

## 1. Task filter issue

Initially, the filter state was not initialized properly after refreshing the page.

The application worked when switching between filters, but the active filter needed to be set correctly when the page loaded.

I fixed this by explicitly setting the All filter as active when the application initializes.

---

## 2. Pomodoro layout issue

The Pomodoro card initially stretched vertically because of the grid layout.

The timer section was taking up more space than I wanted.

I fixed this by changing the grid alignment and adjusting the height of the Pomodoro section so that it only takes the space it needs.

---

## 3. Text readability issue

The first version had too much transparency.

Because the floral background was visible through the cards, some of the text was difficult to read.

I fixed this by increasing the card opacity and adjusting the text colors while keeping the glass-style design.

---

## 4. Background design

I didn't want the project to look like a generic dashboard.

I experimented with the background and eventually used a custom floral background with a soft pink overlay.

The main challenge was finding a balance where the background looked good without making the actual application difficult to use.

---

## 5. Making data persistent

Initially, the application would lose its data when the page was refreshed.

I solved this by learning how localStorage works and using it to store tasks, notes and study time.

This made the application feel much more like an actual usable application instead of just a static webpage.

---

## 6. GitHub authentication

While pushing the project to GitHub, my Mac was using credentials for a different GitHub account.

Because of this, GitHub rejected the push with a permission error.

I had to remove the old GitHub credentials stored on my Mac and authenticate with the correct GitHub account using a Personal Access Token.

This was my first time dealing with Git authentication and repository permissions.

---

# Current limitations

This is the first version of StudyHub, so there are still some limitations:

- No user authentication
- No backend
- No database
- Data is stored only in the browser
- Study time is added only after completing a full Pomodoro
- The currently running timer is not saved if the page is refreshed or closed
- Data cannot be synchronized between different devices

---

# What I learned

This project helped me understand how the different parts of a web application work together.

I learned more about:

- HTML structure
- CSS layouts
- Responsive design
- JavaScript DOM manipulation
- Event listeners
- Arrays and objects
- localStorage
- setInterval()
- Debugging
- Git
- GitHub

The biggest thing I learned was that building a project isn't just about writing the initial code.

A lot of the work involved debugging, testing different cases, fixing UI problems and figuring out why something wasn't behaving the way I expected.

---

# Future plans

I want to continue developing StudyHub instead of leaving it as just a basic frontend project.

Some things I want to add in future versions:

- React frontend
- FastAPI backend
- Database
- User authentication
- Cloud deployment
- User-specific productivity data
- Better study analytics
- More flexible timer settings