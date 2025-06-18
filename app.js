document.addEventListener('DOMContentLoaded', loadUsers);

async function loadUsers() {
    try {
        const response = await fetch('http://localhost:8080/api/users');
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        
        const users = await response.json();
        
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = users.map(user => `
            <div class="user-card">
                <h3>${user.name}</h3>
                <p>ID: ${user.id}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить пользователей');
    }
}
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const name = document.getElementById('name').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }) 
        });
        
        if (!response.ok) {
            throw new Error('Ошибка создания пользователя');
        }
        
        loadUsers();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось создать пользователя');
    }
});
