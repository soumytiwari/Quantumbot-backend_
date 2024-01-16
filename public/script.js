// script.js

let recognition;

document.getElementById('userMessage').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('startSpeechRecognition').addEventListener('click', function () {
    startSpeechRecognition();
});

function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() === '') return;

    // Display the user message in the chat
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
        const messages = data.messages;

        // Display both user and bot messages in the chat
        messages.forEach(msg => {
            if (msg.sender === 'Bot') {
                appendBotResponse(msg.text);
            } else {
                appendMessage(msg.sender, msg.text);
            }
        });
    });

    // Clear the input field
    document.getElementById('userMessage').value = '';
}

function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat');
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender.toLowerCase()); // Add a class for styling

    // Format the message with sender and text
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContainer.appendChild(messageElement);

    // Scroll to the bottom to show the latest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendBotResponse(response) {
    const chatContainer = document.getElementById('chat');
    const responseElement = document.createElement('div');
    responseElement.classList.add('bot');

    // Split the response into steps and format each step without side numbers
    const steps = response.split('\n');
    const formattedSteps = steps.map(step => step.trim());

    // Join the formatted steps into a single HTML string
    responseElement.innerHTML = formattedSteps.join('<br>');

    chatContainer.appendChild(responseElement);

    // Scroll to the bottom to show the latest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleSpeechRecognitionResult(speechResult) {
    document.getElementById('userMessage').value = speechResult;
    sendMessage(); // send the message when speech recognition is complete
}


function startSpeechRecognition() {
    recognition = new webkitSpeechRecognition(); // use webkitSpeechRecognition for Chrome
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
        const speechResult = event.results[0][0].transcript;
        document.getElementById('userMessage').value = speechResult;
        sendMessage(); // send the message when speech recognition is complete
    };

    recognition.start();
}
