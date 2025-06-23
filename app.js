document.addEventListener('DOMContentLoaded', () => {
    // Проверяем авторизацию при загрузке
    checkAuthStatus();
    
    // Обработчики форм
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
});

// Проверка статуса авторизации
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const authStatus = document.getElementById('auth-status');
    const profileSection = document.getElementById('profile-section');
    const authForms = document.querySelector('.auth-forms');

    if (token) {
        authStatus.textContent = 'Вы авторизованы';
        profileSection.style.display = 'block';
        authForms.style.display = 'none';
        loadProfile();
        loadUsers();
    } else {
        authStatus.textContent = 'Вы не авторизованы';
        profileSection.style.display = 'none';
        authForms.style.display = 'flex';
    }
}

// Регистрация
async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.errors?.join(', ') || 'Ошибка регистрации');
        }

        alert('Регистрация успешна! Теперь вы можете войти.');
        document.getElementById('register-form').reset();
    } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message);
    }
}

// Авторизация
async function handleLogin(e) {
    e.preventDefault();
    
    const credentials = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) throw new Error('Неверные учетные данные');
        
        const { token } = await response.json();
        localStorage.setItem('authToken', token);
        checkAuthStatus();
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        alert(error.message);
    }
}

// Выход
function handleLogout() {
    localStorage.removeItem('authToken');
    checkAuthStatus();
}

// Загрузка профиля
async function loadProfile() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('http://localhost:8080/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Ошибка загрузки профиля');
        
        const profile = await response.json();
        renderProfile(profile);
        
    } catch (error) {
        console.error('Ошибка:', error);
        localStorage.removeItem('authToken');
        checkAuthStatus();
    }
}

// Отрисовка профиля
function renderProfile(profile) {
    const profileData = document.getElementById('profile-data');
    profileData.innerHTML = `
        <p><strong>Логин:</strong> ${profile.username}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Дата регистрации:</strong> ${new Date(profile.registrationDate).toLocaleDateString()}</p>
    `;
}

// Загрузка пользователей
async function loadUsers() {
    try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch('http://localhost:8080/users', { headers });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('users-list').innerHTML = `
            <div class="error">Ошибка загрузки: ${error.message}</div>
        `;
    }
}

// Отрисовка пользователей
function renderUsers(users) {
    const usersList = document.getElementById('users-list');
    
    if (users.length === 0) {
        usersList.innerHTML = '<p>Нет пользователей</p>';
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-info">
                <h3>${user.username}</h3>
                <p>Email: ${user.email}</p>
            </div>
        </div>
    `).join('');
}
