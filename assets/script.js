// ================= THEME TOGGLE =================

const toggleButtons = document.querySelectorAll("#themeToggle");

toggleButtons.forEach(btn => {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        btn.textContent = "☀️";
    }

    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            btn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            btn.textContent = "🌙";
        }
    });
});


// ================= TASK SYSTEM =================

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ================= SAVE TASKS =================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ================= CREATE TASK =================

function createTaskElement(task, index) {

    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";

    const leftDiv = document.createElement("div");
    leftDiv.className = "task-left";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.text;

    if (task.completed) {
        title.style.textDecoration = "line-through";
        title.style.opacity = "0.7";
    }

    const deadline = document.createElement("div");
    deadline.className = "deadline";

    const now = new Date();
    const deadlineDate = new Date(`${task.date}T${task.time}`);

    const diffHours = (deadlineDate - now) / (1000 * 60 * 60);

    if (diffHours > 24) {
        deadline.classList.add("green");
    } 
    else if (diffHours > 0) {
        deadline.classList.add("yellow");
    } 
    else {
        deadline.classList.add("red");
    }

    deadline.textContent = `Due: ${task.date} ${task.time}`;

    leftDiv.appendChild(title);
    leftDiv.appendChild(deadline);

    const actions = document.createElement("div");
    actions.className = "task-actions";


    // ================= ACTIVE TASK BUTTONS =================

    if (!task.completed) {

        // EDIT BUTTON
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        editBtn.onclick = () => {

            const newText = prompt("Edit task name:", task.text);
            if (!newText || newText.trim() === "") return;

            const newDate = prompt("Edit deadline date (YYYY-MM-DD):", task.date);
            if (!newDate) return;

            const newTime = prompt("Edit deadline time (HH:MM):", task.time);
            if (!newTime) return;

            const newDeadline = new Date(`${newDate}T${newTime}`);

            if (isNaN(newDeadline)) {
                alert("Invalid date or time format.");
                return;
            }

            const now = new Date();

            if (newDeadline < now) {
                alert("Deadline cannot be in the past.");
                return;
            }

            tasks[index].text = newText.trim();
            tasks[index].date = newDate;
            tasks[index].time = newTime;

            saveTasks();
            renderTasks();
        };

        actions.appendChild(editBtn);


        // COMPLETE BUTTON
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = "Complete";

        completeBtn.onclick = () => {
            tasks[index].completed = true;
            saveTasks();
            renderTasks();
        };

        actions.appendChild(completeBtn);
    }


    // ================= COMPLETED TASK BUTTONS =================

    if (task.completed) {

        const undoBtn = document.createElement("button");
        undoBtn.className = "undo-btn";
        undoBtn.textContent = "Undo";

        undoBtn.onclick = () => {
            tasks[index].completed = false;
            saveTasks();
            renderTasks();
        };

        actions.appendChild(undoBtn);
    }


    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    actions.appendChild(deleteBtn);


    taskDiv.appendChild(leftDiv);
    taskDiv.appendChild(actions);

    return taskDiv;
}


// ================= RENDER TASKS =================

function renderTasks() {

    activeTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    tasks.forEach((task, index) => {

        const element = createTaskElement(task, index);

        if (task.completed) {
            completedTasks.appendChild(element);
        } 
        else {
            activeTasks.appendChild(element);
        }

    });

}


// ================= ADD TASK =================

addTaskBtn.onclick = () => {

    const text = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!text || !date || !time) {
        alert("Please fill all fields");
        return;
    }

    const now = new Date();
    const deadline = new Date(`${date}T${time}`);

    if (deadline < now) {
        alert("Deadline cannot be in the past.");
        return;
    }

    tasks.push({
        text: text,
        date: date,
        time: time,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
};


// ================= INITIAL LOAD =================

renderTasks();