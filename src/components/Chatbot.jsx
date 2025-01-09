import React, { useEffect, useRef, useState } from "react";
import { getChatGPTResponse } from "../api/api";
import logo from "../assets/logo-final.webp";
import { CgProfile } from "react-icons/cg";
import { BsArrowUp } from "react-icons/bs";

const ChatBot = () => {
  const [symptoms, setSymptoms] = useState(""); // Current user input
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hi, I’m Doc AI, here to assist with your medical questions. Ask me about symptoms or health concerns!",
    },
  ]); // Chat history
  const [loading, setLoading] = useState(false);
  const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(true);

  const predefinedQuestions = [
    "What are the symptoms of COVID-19?",
    "What causes frequent headaches?",
    "How do I treat a sore throat?",
    "What are the side effects of antibiotics?",
    "How can I prevent seasonal allergies?",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setShowPredefinedQuestions(false); // Hide predefined questions

    const userMessage = { role: "user", content: symptoms };
    setChatHistory((prev) => [...prev, userMessage]); // Add user input to history
    setSymptoms("");

    setLoading(true);
    try {
      // Send the full chat history
      const botResponse = await getChatGPTResponse([
        ...chatHistory,
        userMessage,
      ]);
      const botMessage = { role: "assistant", content: botResponse };

      setChatHistory((prev) => [...prev, botMessage]); // Add bot response to history
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredefinedQuestionClick = async (question) => {
    setShowPredefinedQuestions(false); // Hide predefined questions

    const userMessage = { role: "user", content: question };
    setChatHistory((prev) => [...prev, userMessage]);

    setLoading(true);
    try {
      const botResponse = await getChatGPTResponse([
        ...chatHistory,
        userMessage,
      ]);
      const botMessage = { role: "assistant", content: botResponse };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] md:px-8 md:py-4 px-2 py-2">
      <div className="max-w-6xl mx-auto   md:px-6 rounded-lg shadow-md relative">
        <div className="flex gap-2 items-center">
          <img
            src={logo}
            className="md:w-[50px] md:h-[50px] w-[30px] h-[30px] object-cover"
            alt="DocAI logo"
          />
          <h1 className="text-xl md:text-3xl font-bold text-[#2050d4]">
            DocAI
          </h1>
        </div>
        <div className="chat-container rounded-lg p-4 h-[82vh]  md:h-[75vh] overflow-y-auto">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-3 flex flex-col bg-[#262626] rounded-xl ${
                message.role === "user" ? "justify-end" : "justify-start"
              } px-4 pt-4`}
            >
              {message.role === "user" ? (
                <div className="flex gap-2 justify-end items-center">
                  <span className="text-[#647072]">You</span>
                  <CgProfile className="w-[20px] h-[20px] text-white" />
                </div>
              ) : (
                <div className="flex gap-2 justify-start items-center">
                  <img src={logo} className="w-[20px] h-[20px]" alt="DocAI" />
                  <span className="text-[#647072]">DocAI</span>
                </div>
              )}
              <div
                className={`inline-block py-2 rounded-lg text-white ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center mt-3">
              <p className="text-gray-500">DocAI is Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Predefined questions */}
        {showPredefinedQuestions && (
          <div className="predefined-questions space-x-2 space-y-2 mt-4 p-2  rounded-lg  absolute md:bottom-[20%] bottom-[10%]">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedQuestionClick(question)}
                className="bg-[#2050d4] text-white py-2 px-4 rounded-lg text-left hover:bg-[#123aa8] inline text-[10px] md:text-[16px]"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Chat input */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-2 bg-[#262626] flex gap-4 rounded-lg"
        >
          <textarea
            value={symptoms}
            onChange={(e) => {
              setSymptoms(e.target.value);
              if (e.target.value.trim() && showPredefinedQuestions) {
                setShowPredefinedQuestions(false); // Hide predefined questions on typing
              }
            }}
            placeholder="Ask a medical question..."
            className="w-full text-white text-md rounded-md bg-[#262626] focus:outline-none"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <button
            type="submit"
            disabled={!symptoms.trim()}
            className="p-3 h-[40px] w-[40px] rounded-full bg-[#2050d4] text-white font-medium hover:bg-[#123aa8] disabled:bg-[#2050d455]"
          >
            <BsArrowUp />
          </button>
        </form>
      </div>

      <p className="text-sm text-red-800 text-center mt-4">
        Disclaimer: This chatbot is for informational purposes only and does not
        provide professional medical advice. Always consult a doctor for
        accurate diagnosis and treatment.
      </p>
    </div>
  );
};

export default ChatBot;
