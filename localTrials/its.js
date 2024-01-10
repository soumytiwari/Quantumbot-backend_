// Define an array to store old chat sessions
const oldChatSessions = [];

function generateResponse() {
    const userInput = document.getElementById('userInput').value;

    // Display user input in past history
    displayMessage(userInput, 'past-message', 'pastHistory');

    // In a real application, you would use JavaScript to send the user input to a backend server
    // The backend server would then interact with GPT and return the generated response
    // For simplicity, this example just displays a static response
    const longResponse = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet semper velit. Sed et sem in justo cursus feugiat. In hac habitasse platea dictumst. Nam tristique, elit vel iaculis ultrices, quam felis sodales ante, vel malesuada nisl sem vel elit. Nullam ac tincidunt orci. Nulla facilisi. Vestibulum rhoncus velit nec turpis vehicula, vitae vulputate nulla fringilla. Proin scelerisque justo eu turpis congue efficitur. Ut hendrerit facilisis tortor, nec ultrices felis suscipit vel. Sed non sem id libero rhoncus facilisis. Nam vel nibh ut purus tincidunt fermentum. Suspendisse potenti. Suspendisse potenti.";

    // Display user input in chat history
    displayMessage(userInput, 'user-message', 'chatHistory');

    // Display bot response in chat history
    displayMessage("Hello! I'm a generated response. " + longResponse, 'bot-message', 'chatHistory');

    // Save the current chat session to old chat sessions
    saveChatSession(userInput, "Hello! I'm a generated response. " + longResponse);

    // Clear user input
    document.getElementById('userInput').value = '';
}

// Function to display messages in the chat history or past history
function displayMessage(message, messageType, containerId) {
    const historyContainer = document.getElementById(containerId);
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message ' + messageType;
    messageContainer.innerText = message;
    historyContainer.appendChild(messageContainer);

    // Scroll to the bottom of the history container to show the latest messages
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

// Function to save the current chat session to old chat sessions
function saveChatSession(userInput, botResponse) {
    const chatSession = {
        user: userInput,
        bot: botResponse,
        timestamp: new Date().toLocaleString() // Include a timestamp for each session
    };

    oldChatSessions.push(chatSession);
}

// Function to view old chat sessions
function viewOldChatSessions() {
    const oldSessionsContainer = document.getElementById('oldSessions');
    oldSessionsContainer.innerHTML = '';

    if (oldChatSessions.length === 0) {
        oldSessionsContainer.innerText = 'No old chat sessions available.';
        return;
    }

    oldChatSessions.forEach(session => {
        const sessionContainer = document.createElement('div');
        sessionContainer.className = 'message old-session';
        sessionContainer.innerHTML = `<strong>User:</strong> ${session.user}<br><strong>Bot:</strong> ${session.bot}<br><em>${session.timestamp}</em>`;
        oldSessionsContainer.appendChild(sessionContainer);
    });

    // Scroll to the bottom of the old sessions container to show the latest sessions
    oldSessionsContainer.scrollTop = oldSessionsContainer.scrollHeight;
}
