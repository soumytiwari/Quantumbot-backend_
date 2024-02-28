let recognition;

document.getElementById('userMessage').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('startSpeechRecognition').addEventListener('click', function () {
    startSpeechRecognition();
});

document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function () {
    const fileName = this.files[0].name;
    document.getElementById('userMessage').value = `[File Attachment: ${fileName}]`;
});

document.getElementById('sendButton').addEventListener('click', function () {
    sendMessage();
});

function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() === '') return;

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);
    formData.append('message', userMessage);

    // Display the user message in the chat
    appendMessage('You', userMessage);

    // Display loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';

    // Make a POST request to the backend with FormData for file uploads
    fetch('/api/messages', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const messages = data.messages;

        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';

        // Display both user and bot messages in the chat
        messages.forEach(msg => {
            if (msg.sender === 'Bot') {
                appendBotResponse(msg.text, msg.file);
            } else {
                appendMessage(msg.sender, msg.text);
            }
        });
    });

    // Clear the input field and file input
    document.getElementById('userMessage').value = '';
    document.getElementById('fileInput').value = '';
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

function appendBotResponse(response, file) {
    const chatContainer = document.getElementById('chat');
    const responseElement = document.createElement('div');
    responseElement.classList.add('bot');

    // Split the response into steps and format each step without side numbers
    const steps = response.split('\n');
    const formattedSteps = steps.map(step => step.trim());

    // Join the formatted steps into a single HTML string
    responseElement.innerHTML = formattedSteps.join('<br>');

    // If there's a file, append a link to it
    if (file && file.fileName && file.fileContent) {
        const fileLink = document.createElement('a');
        fileLink.href = `data:application/pdf;base64,${file.fileContent}`;
        fileLink.target = '_blank';
        fileLink.textContent = `Click to open the PDF: ${file.fileName}`;
        responseElement.appendChild(fileLink);
    }

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
