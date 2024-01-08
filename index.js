// index.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const bodyParser = require('body-parser');

const app = express();


//Creating MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/chatbot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



const MongoStore = connectMongo.create({
  mongoUrl: 'mongodb://127.0.0.1:27017/chatbot',
});


// Define a model for messages
const Message = mongoose.model('Message', {
  text: String,
  sender: String,
  timestamp: Date,
  sessionID: String,
  intent: String,
  botResponse: String,
  // Add any additional fields as needed
});


// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore,
  cookie: {
    maxAge: 60 * 1000, // Session timeout of 60 seconds
  },
}));


// Set up Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



// Define Message model only if not defined
if (!mongoose.models.Message) {
  const Message = mongoose.model('Message', { text: String });
}


// Create an instance of the NLP Manager
// const manager = new NlpManager({ languages: ['en'] });
//
// // Train the NLP model with custom data
// manager.addDocument('en', 'tell me a joke', 'intent.joke');
// manager.addDocument('en', 'What is Quantumbot Core Mission', 'intent.mission');
// manager.addDocument('en', 'what is the weather today', 'intent.weather');
// manager.addDocument('en', 'how does photosynthesis work', 'intent.science');
// // Add more training data based on your intents
//
// manager.addAnswer('en', 'intent.mission', "The QuantumBot Core mission is all about building a backend server for a chat application. You'll learn how to handle chat appending, starting, and removing chat history related to a user or session ID. You'll also create endpoints to log chat histories and include necessary debugging information. The mission covers tasks like project setup, defining API endpoints, testing with Postman, and creating a presentation and documentation. Let me know if you need help with any specific task or concept!");
// manager.addAnswer('en', 'intent.joke', "Why did the scarecrow win an award? Because he was outstanding!");
// manager.addAnswer('en', 'intent.weather', "I'm sorry, I don't have real-time weather information.");
// manager.addAnswer('en', 'intent.science', "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.");
//
//
// // Train the NLP model with sample data
// manager.addDocument('en', 'hello', 'greetings.hello');
// manager.addDocument('en', 'hey', 'greetings.hi');
// manager.addDocument('en', 'hi', 'greetings.hi');
// manager.addDocument('en', 'how are you', 'greetings.howAreYou');
// manager.addDocument('en', 'bye', 'farewell.bye');
// manager.addDocument('en', 'goodbye', 'farewell.goodbye');
// manager.addAnswer('en', 'greetings.hello', 'Hello!');
// manager.addAnswer('en', 'greetings.hi', 'Hi there!');
// manager.addAnswer('en', 'greetings.howAreYou', 'I\'m doing well, thank you!');
// manager.addAnswer('en', 'farewell.bye', 'Goodbye!');
// manager.addAnswer('en', 'farewell.goodbye', 'See you later!');
//
// // Train and save the model
// (async () => {
//     await manager.train();
//     manager.save();
// })();

// Handle incoming chat messages
app.post('/api/messages', async (req, res) => {
  const userMessage = req.body.message;
  const sessionID = req.sessionID;

  // Save the user message to MongoDB
  //const userMessageModel = new mongoose.models.Message({ text: userMessage });
  //await userMessageModel.save();

  // Save the user message to MongoDB
  const userLog = new Message({
    text: userMessage,
    sender: 'User',
    timestamp: new Date(),
    sessionID: sessionID,
  });
  await userLog.save();


  // Generate a response using Google's Gemini API
  const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const geminiResult = await geminiModel.generateContent(userMessage);
  const geminiResponse = await geminiResult.response;
  const botResponse = geminiResponse.text();

  // Save the bot's response to MongoDB
  //const botMessageModel = new mongoose.models.Message({ text: botResponse });
  //await botMessageModel.save();

  // Save the bot's response and intent to MongoDB
  const botLog = new Message({
    botResponse: botResponse,
    sender: 'Bot',
    timestamp: new Date(),
    sessionID: sessionID,
    intent: geminiResponse.intent, // Assuming Gemini API provides intent in the response
  });
  await botLog.save();

  // Send a response
  res.json({ response: botResponse });
});

// Start the server
app.listen(3000, () => {
    console.log(`Server is running at port 3000`);
});
