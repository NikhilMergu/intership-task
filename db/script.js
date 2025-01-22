const socket = io('http://localhost:5000');
const token = localStorage.getItem('authToken');
const usernameElement = document.getElementById('username');
const logoutButton = document.getElementById('logout');
const userList = document.getElementById('user-list');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');

// Fetch user data
if (token) {
    fetch('http://localhost:5000/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(users => {
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = user.username;
            userItem.addEventListener('click', () => startChat(user.username, user._id));
            userList.appendChild(userItem);
        });
    });

    // Set username
    const user = jwt_decode(token);  // Decode the JWT token
    usernameElement.textContent = user.username;

    // WebSocket: Join the chat room
    socket.emit('join', user.id);

    // Receive new messages in real-time
    socket.on('newMessage', (message) => {
        if (message.receiverId === user.id) {
            displayMessage(message);
        }
    });

    // Send a message
    sendMessageButton.addEventListener('click', () => {
        const receiverId = localStorage.getItem('receiverId');
        const message = messageInput.value;
        if (receiverId && message) {
            fetch('http://localhost:5000/message', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ receiverId, message })
            })
            .then(response => response.json())
            .then(() => {
                messageInput.value = '';
            });
        }
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    });
}

function startChat(username, receiverId) {
    localStorage.setItem('receiverId', receiverId);
    fetch(`http://localhost:5000/messages/${receiverId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(messages => {
        chatBox.innerHTML = '';
        messages.forEach(message => {
            displayMessage(message);
        });
    });
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.senderId.username}: ${message.message}`;
    chatBox.appendChild(messageElement);
}
