// Global username variable
let username = '';

document.addEventListener('DOMContentLoaded', function() {
    const maxWords = 30;
    const socket = new WebSocket('ws://localhost:3000');  // Pastikan URL sesuai dengan hosting Anda

    const loginContainer = document.getElementById('loginContainer');
    const chatContainer = document.getElementById('chatContainer');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        username = usernameInput.value.trim();

        if (username !== '') {
            loginContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
            socket.send(JSON.stringify({ type: 'username', username: username }));
        }
    });

    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    socket.addEventListener('open', function() {
        sendButton.disabled = false;  // Enable button
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        const wordCount = messageText.split(/\s+/).length;

        if (wordCount > maxWords) {
            alert(`Pesan terlalu panjang! Maksimal ${maxWords} kata.`);
            return;
        }

        if (messageText !== '' && socket.readyState === WebSocket.OPEN) {
            const messageData = {
                type: 'message',
                username: username,
                message: messageText
            };
            socket.send(JSON.stringify(messageData));
            messageInput.value = '';
        } else {
            console.error('WebSocket is not open. Ready state: ' + socket.readyState);
        }
    }

    socket.addEventListener('message', function(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'received'); // Gunakan kelas CSS 'received' untuk pesan yang diterima

            // Buat elemen username
            const usernameElement = document.createElement('div');
            usernameElement.classList.add('username'); // Berikan kelas 'username'
            usernameElement.textContent = data.username; // Set username

            // Buat elemen konten pesan
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content'); // Berikan kelas 'message-content'
            messageContent.textContent = data.message; // Set isi pesan

            // Tambahkan elemen username dan pesan ke dalam pesan elemen utama
            messageElement.appendChild(usernameElement); // Tambahkan username ke pesan
            messageElement.appendChild(messageContent); // Tambahkan konten pesan

            // Tambahkan pesan baru ke dalam container chat
            chatMessages.appendChild(messageElement);

            // Gulir ke bawah untuk melihat pesan baru
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else if (data.type === 'username') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'received'); // Gunakan kelas CSS 'received' untuk pesan yang diterima

            const usernameElement = document.createElement('div');
            usernameElement.classList.add('username');
            usernameElement.textContent = `${data.username} has joined the chat.`; // Set pesan saat pengguna baru bergabung

            messageElement.appendChild(usernameElement);
            chatMessages.appendChild(messageElement);

            chatMessages.scrollTop = chatMessages.scrollHeight; // Gulir otomatis ke bawah
        }
    });
});
