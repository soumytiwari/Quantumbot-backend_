// script.js

document.getElementById('userMessage').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() === '') return;

    appendMessage('You', userMessage);

    // Make a POST request to the backend
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.response;
        appendMessage('Bot', botResponse);
    });

    // Clear the input field
    document.getElementById('userMessage').value = '';
}

function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat');
    const messageElement = document.createElement('div');

    // Add different CSS classes based on the sender
    messageElement.classList.add(sender.toLowerCase()); // Assuming sender is 'User' or 'Bot'

    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);

    // Scroll to the bottom to show the latest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
