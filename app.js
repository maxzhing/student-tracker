const app = document.getElementById("app");

let state = {
    user: null,
    assignments: []
};

// ---------- UI RENDER ----------
function render() {
    if (!state.user) {
        renderSignIn();
    } else {
        renderDashboard();
    }
}

// ---------- SIGN IN ----------
function renderSignIn() {
    app.innerHTML = `
        <div class="container">
            <h2>🎓 Sign In</h2>
            <input id="name" placeholder="Name">
            <input id="email" placeholder="Email">
            <button onclick="signIn()">Sign In</button>
        </div>
    `;
}

function signIn() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!name || !email) {
        alert("Fill everything");
        return;
    }

    state.user = { name, email };
    render();
}

// ---------- DASHBOARD ----------
function renderDashboard() {
    let list = state.assignments.map(a => `
        <div class="card">
            <b>${a.title}</b><br>
            Due: ${a.due}
            <br><br>
            <button onclick="markDone('${a.id}')">Done</button>
            <button onclick="deleteTask('${a.id}')">Delete</button>
        </div>
    `).join("");

    app.innerHTML = `
        <div class="container">
            <h2>Hello, ${state.user.name}</h2>

            <input id="title" placeholder="Assignment title">
            <input id="due" type="date">
            <button onclick="addAssignment()">Add</button>

            <hr>

            ${list || "<p>No assignments yet</p>"}
        </div>
    `;
}

// ---------- LOGIC ----------
function addAssignment() {
    const title = document.getElementById("title").value;
    const due = document.getElementById("due").value;

    if (!title || !due) return;

    state.assignments.push({
        id: Math.random().toString(36).slice(2),
        title,
        due
    });

    render();
}

function deleteTask(id) {
    state.assignments = state.assignments.filter(a => a.id !== id);
    render();
}

function markDone(id) {
    alert("Marked done (you can expand this)");
}

// ---------- START ----------
render();
