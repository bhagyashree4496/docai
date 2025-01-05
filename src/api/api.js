export const getChatGPTResponse = async (messages) => {
  try {
    const prompt =
      "The user should ask only medical-related questions but if user asks simple greeting messages respond them and introduce yoursef as medical chatbot. If the user's input is unrelated to medicine, respond with 'I can only answer medical-related questions. Please ask about symptoms, diseases, or treatments' and you can collect more details like gender and age and other symptoms to assist suggestions";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_CHATGPT_API_KEY}`, // Replace with your API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Specify the ChatGPT model
        messages: [{ role: "user", content: prompt }, ...messages], // Pass the chat history
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content; // Extract the bot's response
  } catch (error) {
    console.error("Error fetching response:", error);
    return "I'm sorry, but I encountered an error. Please try again.";
  }
};
