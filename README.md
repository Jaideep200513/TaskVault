# TaskVault — Simple Version
> A beginner-friendly Task Management app using **HTML, CSS, Vanilla JS, Node.js, and MongoDB**

---

## 📁 Folder Structure

```
taskvault-simple/
│
├── index.html      ← Login page
├── dashboard.html  ← Task dashboard
├── style.css       ← All styling (dark mode included)
├── server.js       ← Backend (Node.js + Express + MongoDB)
└── README.md       ← This file
```

---

## 🛠️ Step-by-Step Setup Guide

### Step 1 — Install Required Software

1. **Node.js** → Download from https://nodejs.org (choose LTS version)
   - After install, verify: `node -v` and `npm -v`

2. **MongoDB** → Download Community Edition from https://www.mongodb.com/try/download/community
   - Install with default settings

3. **VS Code** → Download from https://code.visualstudio.com (recommended editor)

---

### Step 2 — Get the Project

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux):

```bash
# Clone the original repo
git clone https://github.com/Jaideep200513/TaskVault taskvault-simple

# Go into the project folder
cd taskvault-simple
```

> Or just copy all 5 files into a folder called `taskvault-simple`.

---

### Step 3 — Install Node.js Packages

Inside the project folder, run:

```bash
npm init -y
npm install express mongodb
```

This installs:
- `express` — lightweight web server
- `mongodb` — to talk to your MongoDB database

---

### Step 4 — Start MongoDB

Open a **new terminal window** and run:

```bash
mongod
```

Leave this terminal open. MongoDB is now running in the background.

---

### Step 5 — Set Up the Database

Open another **new terminal** and run:

```bash
mongosh
```

Then type these commands one by one to create sample data:

```js
// Select (or create) the taskvault database
use taskvault

// Create a user you can log in with
db.users.insertOne({ username: "admin", password: "1234" })

// (Optional) Insert a sample task to test
db.tasks.insertOne({
  title: "Finish lab report",
  priority: "high",
  date: "2026-04-25",
  time: "18:00",
  completed: false,
  createdAt: new Date()
})

// Check that your data was saved
db.users.find().pretty()
db.tasks.find().pretty()

// Exit the mongo shell
exit
```

---

### Step 6 — Run the App

Back in your main terminal (inside the project folder):

```bash
node server.js
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running at http://localhost:3000
```

Open your browser and go to: **http://localhost:3000**

Log in with:
- Username: `admin`
- Password: `1234`

---

## 🔄 MongoDB CRUD Operations (Quick Reference)

```js
// CREATE — add a task
db.tasks.insertOne({ title: "Study JS", priority: "high", completed: false })

// READ — view all tasks
db.tasks.find().pretty()

// UPDATE — mark a task as completed
db.tasks.updateOne({ title: "Study JS" }, { $set: { completed: true } })

// DELETE — remove a task
db.tasks.deleteOne({ title: "Study JS" })
```

---

## 📡 API Endpoints (Backend Routes)

| Method | URL              | What it does              |
|--------|------------------|---------------------------|
| POST   | /api/login       | Check username & password |
| GET    | /api/tasks       | Get all tasks             |
| POST   | /api/tasks       | Add a new task            |
| PATCH  | /api/tasks/:id   | Mark task complete/undo   |
| DELETE | /api/tasks/:id   | Delete a task             |

---

## 🚀 Push to GitHub

```bash
git init
git add .
git commit -m "Initial simple version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## ✅ Features

- Login with username & password (stored in MongoDB)
- Add tasks with title, priority, date, and time
- Mark tasks complete / undo
- Delete tasks
- Search tasks by name
- Filter by priority (High / Medium / Low)
- Active & Completed task counts
- Dark mode toggle (saved between sessions)

---

## ⚠️ Notes for Beginners

- **Never close the `mongod` terminal** while the app is running.
- If you see `MongoDB connection failed`, make sure `mongod` is running.
- Passwords in this version are stored in plain text — this is fine for a **college lab project**. In real apps, always hash passwords.