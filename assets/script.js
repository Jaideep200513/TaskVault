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