document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('userGreeting');
    const logoutButton = document.getElementById('logoutButton');

    function checkAuthAndLoadUser() {
        const userId = sessionStorage.getItem('usuarioId');
        const userName = sessionStorage.getItem('usuarioNome');

        if (userId && userName) {
            // RF03: Exibe saudação
            userGreeting.textContent = `Olá, ${userName}`;
        } else {
            // Redireciona se a sessão não for encontrada
            alert('Sessão não iniciada. Por favor, faça login.');
            window.location.href = 'login.html';
        }
    }

    // RF02: Função de Logout
    logoutButton.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = 'login.html'; 
    });

    checkAuthAndLoadUser();
});