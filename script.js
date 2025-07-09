const authModal = document.getElementById("authModal");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const appSection = document.getElementById("appSection");
const currentUserDisplay = document.getElementById("currentUser");
const filmForm = document.getElementById("filmForm");
const filmGrid = document.getElementById("filmGrid");
const searchInput = document.getElementById("search");

let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUser = localStorage.getItem("currentUser");
let editFilmId = null;

function toggleModal() {
  authModal.style.display = authModal.style.display === "block" ? "none" : "block";
}

function switchTab(tab) {
  loginTab.classList.remove("active");
  registerTab.classList.remove("active");
  (tab === "login" ? loginTab : registerTab).classList.add("active");
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveSession() {
  localStorage.setItem("currentUser", currentUser);
}

function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  if (!users[username] || users[username].password !== password) {
    alert("Невірний логін або пароль");
    return;
  }
  currentUser = username;
  saveSession();
  toggleModal();
  showApp();
}

function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  if (!username || !password) {
    alert("Заповніть всі поля");
    return;
  }
  if (users[username]) {
    alert("Користувач вже існує");
    return;
  }
  users[username] = { password, films: [] };
  saveUsers();
  alert("Успішна реєстрація");
  switchTab('login');
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  location.reload();
}

filmForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const film = {
    id: editFilmId || Date.now(),
    title: title.value.trim(),
    genre: genre.value.trim(),
    year: year.value.trim(),
    rating: rating.value.trim(),
    description: description.value.trim()
  };
  const userFilms = users[currentUser].films;
  if (editFilmId) {
    const idx = userFilms.findIndex(f => f.id === editFilmId);
    userFilms[idx] = film;
    editFilmId = null;
  } else {
    userFilms.push(film);
  }
  saveUsers();
  filmForm.reset();
  renderFilms();
});

function renderFilms() {
  const query = searchInput.value.toLowerCase();
  const films = users[currentUser].films || [];
  filmGrid.innerHTML = "";
  const filtered = films.filter(f => f.title.toLowerCase().includes(query));
  for (let f of filtered) {
    const card = document.createElement("div");
    card.className = "film-card";
    card.innerHTML = `
      <div class="film-info">
        <div class="film-title">${f.title}</div>
        <div class="film-meta">Жанр: ${f.genre}</div>
        <div class="film-meta">Рік: ${f.year}</div>
        <div class="rating">⭐ ${f.rating}</div>
        ${f.description ? `<div class="film-description">${f.description}</div>` : ''}
        <div class="card-buttons">
          <button onclick="editFilm(${f.id})">✏️ Редагувати</button>
          <button onclick="deleteFilm(${f.id})">🗑️ Видалити</button>
        </div>
      </div>
    `;
    filmGrid.appendChild(card);
  }
}

function deleteFilm(id) {
  users[currentUser].films = users[currentUser].films.filter(f => f.id !== id);
  saveUsers();
  renderFilms();
}

function editFilm(id) {
  const f = users[currentUser].films.find(f => f.id === id);
  title.value = f.title;
  genre.value = f.genre;
  year.value = f.year;
  rating.value = f.rating;
  description.value = f.description;
  editFilmId = id;
}

if (currentUser && users[currentUser]) {
  showApp();
}

function showApp() {
  document.querySelector(".auth-button").style.display = "none";
  appSection.style.display = "block";
  currentUserDisplay.textContent = currentUser;
  renderFilms();
}
