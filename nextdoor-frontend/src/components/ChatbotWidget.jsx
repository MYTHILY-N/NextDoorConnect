import { useState, useRef, useEffect } from "react";
import "./ChatbotWidget.css";

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm your NextDoor assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock AI Response Logic
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Could you try asking for a specific service like 'plumbing' or 'cleaning'?";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("plumb") || lowerInput.includes("leak") || lowerInput.includes("pipe") || lowerInput.includes("water")) {
        botResponse = "It looks like you have a plumbing issue. I recommend checking our 'Plumbing' category for top-rated professionals.";
      } else if (lowerInput.includes("electric") || lowerInput.includes("light") || lowerInput.includes("wire") || lowerInput.includes("power")) {
        botResponse = "For electrical problems, our 'Electrical' experts can help. You can find them in the dashboard.";
      } else if (lowerInput.includes("clean") || lowerInput.includes("dust") || lowerInput.includes("wash") || lowerInput.includes("maid")) {
        botResponse = "Need a clean home? Browse our 'Cleaning' services to book a verified professional.";
      } else if (lowerInput.includes("paint") || lowerInput.includes("color") || lowerInput.includes("wall")) {
        botResponse = "Planning to paint? Our 'Painting' specialists can transform your space.";
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        botResponse = "Hello! How can I assist you with your home service needs today?";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponse, sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Search/Chat Toggle Button */}
      <div
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
      >
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <span className="chat-icon">💬</span>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>NextDoor Assistant</h3>
            <span className="online-status">● Online</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatbotWidget;
