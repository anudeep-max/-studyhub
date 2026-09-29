# StudyHub - Project Notes

## Why I built this

I wanted to build a small web application while learning frontend development instead of just following tutorials.

I decided to make a productivity dashboard that I could actually use for studying. That became StudyHub.

I started with a basic HTML/CSS/JavaScript version and focused on getting the core features working before thinking about adding a backend.

---

## How the application works

StudyHub is currently a client-side web application.

The basic flow is:

HTML → CSS → JavaScript → localStorage

HTML provides the structure, CSS handles the UI, JavaScript handles the functionality, and localStorage is used to keep the user's data after refreshing the page.

There is currently no backend or database.

---

## HTML

I used HTML to create the different sections of the application:

- Header
- Productivity summary cards
- Task manager
- Pomodoro timer
- Quick notes

I gave important elements IDs so that JavaScript could access and update them.

---

## CSS

I used CSS to design the complete interface.

I wanted something different from the usual dark developer dashboard, so I went with a soft pink and floral design.

Some of the things I used:

- CSS Grid
- Flexbox
- Responsive layout
- Rounded cards
- Glass-style cards
- Shadows
- Borders
- Custom background image
- Different styles for completed tasks

One problem I had was that the background sometimes made the text difficult to read.

I fixed this by adding a translucent overlay and making the cards more opaque.

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

A task looks like:

```javascript
{
    text: "Complete DSA practice",
    completed: false
}

##Adding tasks

When the user enters a task and clicks Add:

1. The input value is read.
2. Empty spaces are removed.
3. A new task object is created.
4. The task is added to the array.
5. The array is saved to localStorage.
6. The task list is rendered again.

I also added an event listener for the Enter key so a task can be added without clicking the button.

##Completing tasks

Each task has a complete button.

When it is clicked, the corresponding task is found using its index and its completed value is changed.

The UI is then rendered again.

Completed tasks get a different appearance and a strikethrough.

Deleting tasks

The delete button removes the selected task from the array.

After deleting it, the updated array is saved and the task list is rendered again.

Task filters

There are three filters:

* All
* Active
* Completed

The same tasks array is used for all three.

JavaScript filters the array depending on which filter the user selects.

Progress

The application calculates the percentage of completed tasks using:

completed tasks / total tasks × 100

This percentage is then used to update the progress bar and the percentage shown on the page.

⸻

Pomodoro Timer

The Pomodoro timer starts at 25 minutes.

I implemented the countdown using JavaScript’s setInterval().

Every second, the remaining time is decreased by one second and the timer display is updated.

When the timer reaches zero:

1. The interval is stopped.
2. 25 minutes are added to the study time.
3. The study time is saved to localStorage.
4. The study time display is updated.
5. A completion message is shown.

For example:

25:00 → 24:59 → 24:58 → … → 00:00

The current version only adds study time after a complete 25-minute Pomodoro.

⸻

Quick Notes

The notes section is a textarea.

Whenever the user types something, an input event is triggered.

The current contents are saved to localStorage.

When the application loads, the saved notes are retrieved and placed back into the textarea.

⸻

localStorage

Since I don’t have a backend in this version, I used browser localStorage for persistence.

I store:

* Tasks
* Study time
* Notes

This means refreshing the page doesn’t remove the saved data.

One limitation is that localStorage is specific to the browser/device. The data is not connected to a user account and cannot be synchronized between different devices.

⸻

Problems I faced

Task filter issue

Initially, the filter state was not initialized properly after refreshing the page.

I fixed this by explicitly setting the All filter as active when the application starts.

Pomodoro layout issue

The Pomodoro card initially stretched vertically because of the grid layout.

I had to adjust the grid alignment and the height of the Pomodoro section so that it would only take the space it actually needed.

Readability issue

The first version had too much transparency.

Because the floral background was visible behind the cards, some text wasn’t easy to read.

I increased the card opacity and adjusted the text colors while keeping the glass effect.

Making data persistent

At first, refreshing the page would remove the application data.

I solved this by learning how localStorage works and using it for tasks, notes and study time.

GitHub authentication

While pushing the project to GitHub, my Mac was using credentials for a different GitHub account.

Because of this, GitHub rejected the push with a permission error.

I had to remove the old GitHub credentials and authenticate using the correct account and a Personal Access Token.

This was also my first time dealing with Git authentication and repository permissions.

⸻

Current limitations

This is the first version of StudyHub, so there are still some limitations:

* No login/signup
* No backend
* No database
* Data is stored only in the browser
* Study time is recorded only after completing a full Pomodoro
* Running timer state is not saved if the page is refreshed
* Data cannot be synchronized between devices

⸻

What I learned

This project helped me understand how a basic web application works from the frontend side.

I learned more about:

* HTML structure
* CSS layouts
* Responsive design
* JavaScript DOM manipulation
* Event listeners
* Arrays and objects
* localStorage
* setInterval()
* Debugging
* Git
* GitHub

The biggest thing I learned was that building a project isn’t just about writing the initial code. A lot of the work is debugging, testing different cases, fixing UI problems and figuring out why something doesn’t behave the way I expected.

⸻

Future plans

I want to continue developing StudyHub instead of leaving it as just a basic frontend project.

The next version could include:

* React frontend
* FastAPI backend
* Database
* User authentication
* Cloud deployment
* User-specific productivity data
* Better study analytics
* More flexible timer settings