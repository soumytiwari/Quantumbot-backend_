function generateResponse() {
    // In a real application, you would use JavaScript to send the user input to a backend server
    // The backend server would then interact with GPT and return the generated response
    // For simplicity, this example just displays a static response
    const longResponse = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet semper velit. Sed et sem in justo cursus feugiat. In hac habitasse platea dictumst. Nam tristique, elit vel iaculis ultrices, quam felis sodales ante, vel malesuada nisl sem vel elit. Nullam ac tincidunt orci. Nulla facilisi. Vestibulum rhoncus velit nec turpis vehicula, vitae vulputate nulla fringilla. Proin scelerisque justo eu turpis congue efficitur. Ut hendrerit facilisis tortor, nec ultrices felis suscipit vel. Sed non sem id libero rhoncus facilisis. Nam vel nibh ut purus tincidunt fermentum. Suspendisse potenti. Suspendisse potenti.";
    
    document.getElementById('botResponse').innerText = "Hello! I'm a generated response. " + longResponse;
}