// index.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const {  GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require('@google/generative-ai');
//const mongoose = require('mongoose');
//const connectMongo = require('connect-mongo');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');




const app = express();

// Initialize Firebase Admin SDK
var serviceAccount = require('./admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chatbot-fd346-default-rtdb.firebaseio.com",
});

// Get a reference to the database
const db = admin.database();
const userRef = db.ref("users");

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000, // Session timeout of 60 seconds
  },
}));




// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));




// Set up Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);




app.post('/api/streaming', async (req, res) => {
  const prompt = req.body.prompt;

  console.log('Received prompt:', prompt); // Add this line for debugging

  // Add your existing code for streaming here

  // For now, send a dummy response for testing
  res.json({
    response: 'Dummy response for testing'
  });
});

app.post('/api/messages', async (req, res) => {
  const userMessage = req.body.message;
  const sessionID = req.sessionID;

  // Save the user message and details to Firebase
  const userLog = {
    userMessage: userMessage,
    sender: 'User',
    timestamp: admin.firestore.Timestamp.fromDate(new Date()),
    sessionID: sessionID,
  };
  await userRef.push(userLog);


  // Generate a response using Google's Gemini API with streaming
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const geminiModel = genAI.getGenerativeModel({
      model: 'gemini-pro'
    });

    // Define the parts specific to the company (RadicalX)
    const companyParts = [{
      text: "I'm ReX, your dedicated AI sidekick on RadicalX! 👋 My mission is to guide and support you throughout your learning journey. Whether you need help with task details, tech concepts, or just a boost of motivation, I'm here for you. Just ask me anything, and I'll do my best to assist you! 🚀\nRadicalX is an innovative tech education platform designed to help you level up your skills and accelerate your career in the tech industry. 🌟 We offer a wide range of learning modules, including Quests, Expeditions, Probes, Journeys, Oracles, and Missions. Our platform is designed for learners of all levels, from beginners to experts.\nAt RadicalX, we believe in personalized learning experiences tailored to your needs. We provide up-to-date and engaging content, ensuring you stay ahead of the curve in the ever-evolving tech landscape. Our goal is to empower you with the knowledge and skills necessary to thrive in your tech career.\nWe also offer rewards and certifications to recognize your hard work and dedication. So, get ready to embark on an exciting learning adventure with RadicalX and let's unlock your full potential together! 🚀\nEnroll in RadicalX by tapping 'Start Now' on the website. 🚀 Quests are micro lessons, while Missions are real-world projects. 💰 Earn monetary rewards every week on RadicalX. 📊 Track your progress and rewards through your dashboard. 📚 Content on RadicalX is regularly updated and relevant. 🔒 RadicalX prioritizes data security and confidentiality. 💻 Access RadicalX on any device. 🤝 Receive comprehensive support throughout your learning journey. 🌟 Explore advanced topics by letting me know your interest. 🎓 Get a digital Certificate of Mastery for completing a Quest.\nLet me know if you need further assistance! \nTalha Sabri is a highly experienced mentor on RadicalX. He specializes in various tech domains, including web development, data science, and machine learning. Talha has a strong background in industry and is known for his expertise and dedication to helping learners succeed. You can connect with Talha Sabri through the mentorship channels available on RadicalX. He can provide personalized guidance, answer your questions, and offer valuable insights to support your learning journey. Don't hesitate to reach out to Talha or any other mentors on RadicalX for assistance and mentorship. They are there to help you grow and achieve your goals.\nYou can connect with Talha Sabri and other mentors or hosts on RadicalX through various channels, such as chat, forums, or scheduled mentorship sessions. They are there to assist you, offer guidance, and help you achieve your learning goals. Feel free to reach out to them for personalized support and make the most of their expertise.\nMikhail is another highly skilled mentor on RadicalX. He specializes in various tech domains, including software development, cybersecurity, and cloud computing. Mikhail has a strong background in the industry and is known for his expertise and dedication to helping learners succeed.\nLike Talha Sabri and other mentors on RadicalX, Mikhail is available to provide personalized guidance, answer your questions, and offer valuable insights to support your learning journey. You can connect with Mikhail through the mentorship channels available on RadicalX. Whether you need assistance with a specific concept, guidance on a project, or career advice, Mikhail and other mentors are there to help you grow and achieve your goals.\nFeel free to reach out to Mikhail or any other mentors on RadicalX for support and mentorship. They are passionate about helping learners like you succeed in their tech journeys.\nReX benefits learners in several ways:\n1️⃣ Guidance: ReX provides step-by-step guidance and support throughout your mission journey on RadicalX.\n2️⃣ Answers: ReX answers your questions about task details, tech concepts, and any other queries you may have.\n3️⃣ Encouragement: ReX offers motivation and positive reinforcement to boost your confidence and keep you on track.\n4️⃣ Problem-solving: ReX encourages you to solve problems yourself, providing hints and asking questions to help you find the answers.\n5️⃣ Resources: ReX can direct you to the best resources, whether it's documentation, forums, or other helpful materials.\nRemember, ReX is here to make your learning experience out of this world! 🚀"
    }, ];

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [{
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const result = await geminiModel.generateContentStream({
      contents: [{
          role: 'user',
          parts: [{
            text: userMessage
          }]
        }, // Original user message
        {
          role: 'model',
          parts: [{
            text: 'I see, please wait a moment.'
          }]
        }, // Placeholder response
        {
          role: 'user',
          parts: companyParts
        }, // Use company-specific parts
      ],
      generationConfig,
      safetySettings,
    });

    let textResponse = '';

    // Concatenate the chunks to get the full response
    for await (const chunk of result.stream) {
      textResponse += chunk.text();
    }

    // Save the bot's response and intent to Firebase
    const botLog = {
      botResponse: JSON.stringify(textResponse, null, 2), // Using JSON.stringify with indentation
  sender: 'Bot',
  timestamp: admin.firestore.Timestamp.fromDate(new Date()), // Use Timestamp for Firestore
  intent: 'streaming', // You might want to adjust this based on your needs
  sessionID: sessionID,
    };
    await userRef.push(botLog);


    // Send a response as an array of messages
    res.json({
      messages: [{
        sender: 'Bot',
        text: textResponse,
        timestamp: new Date()
      }],
    });
  } catch (error) {
    console.error('Error generating content:', error);
    // Save the error message to Firebase
     const errorLog = {
       botResponse: 'Error generating content',
       sender: 'Bot',
       timestamp: new Date(),
       //sessionID: sessionID,
       intent: 'error', // You might want to adjust this based on your needs
     };

    // Send an error response
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
