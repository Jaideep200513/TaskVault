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


// ================= ELEMENT REFERENCES =================

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");


// ================= DATE LIMIT =================

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);


// ================= LOAD TASKS =================

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

    // Task Title
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.text;

    if (task.completed) {
        title.style.textDecoration = "line-through";
        title.style.opacity = "0.7";
    }

    // Priority Badge
    if(task.priority){
        const priorityTag = document.createElement("div");
        priorityTag.className = "priority " + task.priority;
        priorityTag.textContent = task.priority.toUpperCase();
        leftDiv.appendChild(priorityTag);
    }

    // Deadline
    const deadline = document.createElement("div");
    deadline.className = "deadline";

    const now = new Date();
    const deadlineDate = new Date(`${task.date}T${task.time}`);
    const diffHours = (deadlineDate - now) / (1000 * 60 * 60);

    if (diffHours > 24) deadline.classList.add("green");
    else if (diffHours > 0) deadline.classList.add("yellow");
    else deadline.classList.add("red");

    const formattedDate = new Date(`${task.date}T${task.time}`)
        .toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });

    deadline.textContent = `Due: ${formattedDate}`;

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

            if (newDeadline < new Date()) {
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

    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const filter = filterSelect ? filterSelect.value : "all";

    // Sort by deadline
    tasks.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    tasks.forEach((task, index) => {

        if(search && !task.text.toLowerCase().includes(search)) return;

        if(filter === "priority-high" && task.priority !== "high") return;
        if(filter === "priority-medium" && task.priority !== "medium") return;
        if(filter === "priority-low" && task.priority !== "low") return;

        if(filter === "deadline-soon"){
            const now = new Date();
            const deadline = new Date(`${task.date}T${task.time}`);
            const diffHours = (deadline - now) / (1000*60*60);
            if(diffHours > 24) return;
        }

        const element = createTaskElement(task, index);

        if (task.completed) completedTasks.appendChild(element);
        else activeTasks.appendChild(element);

    });

    // Update statistics
    if(activeCount) activeCount.textContent = tasks.filter(t => !t.completed).length;
    if(completedCount) completedCount.textContent = tasks.filter(t => t.completed).length;
}


// ================= ADD TASK =================

addTaskBtn.onclick = () => {

    const text = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;
    const priority = priorityInput ? priorityInput.value : "low";

    if (!text || !date || !time) {
        alert("Please fill all fields");
        return;
    }

    const deadline = new Date(`${date}T${time}`);

    if (deadline < new Date()) {
        alert("Deadline cannot be in the past.");
        return;
    }

    tasks.push({
        text,
        date,
        time,
        priority,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    if(priorityInput) priorityInput.value = "low";
};


// ================= SEARCH / FILTER =================

if(searchInput){
    searchInput.addEventListener("input", renderTasks);
}

if(filterSelect){
    filterSelect.addEventListener("change", renderTasks);
}


// ================= INITIAL LOAD =================

renderTasks();