import { useState, useRef, useEffect } from "react";
import "./ChatbotWidget.css";

function ChatbotWidget({ onBookService }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm your NextDoor assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingService, setPendingService] = useState(null);
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

    // Keyword NLP Logic
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      
      const yesKeywords = ["yes", "yeah", "yep", "sure", "ok", "okay", "book", "please", "do it"];
      const noKeywords = ["no", "nah", "not", "don't", "cancel", "stop"];
      
      if (pendingService) {
        if (yesKeywords.some((kw) => lowerInput.split(" ").includes(kw) || lowerInput.includes(kw))) {
            const botResponse = `Awesome! 🚀 Finding the top ${pendingService} professionals for you right now...`;
            setMessages((prev) => [
              ...prev,
              { id: Date.now() + 1, text: botResponse, sender: "bot" },
            ]);
            
            if (onBookService) {
                setTimeout(() => {
                  onBookService(pendingService);
                  setIsOpen(false); // Optionally close chat when redirecting
                }, 1500);
            }
            setPendingService(null);
            return;
        } else if (noKeywords.some((kw) => lowerInput.split(" ").includes(kw) || lowerInput.includes(kw))) {
            const botResponse = `No worries at all! 😊\n\nIs there anything else I can help you with today? I'm here for you! 💙`;
            setMessages((prev) => [
              ...prev,
              { id: Date.now() + 1, text: botResponse, sender: "bot" },
            ]);
            setPendingService(null);
            return;
        }
        // If not explicitly yes or no, clear pending and re-evaluate as normal query
        setPendingService(null);
      }

      const servicesDict = [
        { service: "Plumbing", icon: "🔧", keywords: ["plumb", "leak", "pipe", "drain", "tap", "water"], desc: "fix leaks, pipes, and drainage issues" },
        { service: "Electrical", icon: "⚡", keywords: ["electric", "wire", "switch", "power", "install", "fan", "light"], desc: "help with wiring, switches, power issues, and installations" },
        { service: "Cleaning", icon: "🧹", keywords: ["clean", "house", "office", "deep", "dust", "wash", "maid", "sweep"], desc: "provide house, office, and deep cleaning services" },
        { service: "Painting", icon: "🎨", keywords: ["paint", "wall", "interior", "exterior", "color"], desc: "handle wall painting, interior, and exterior projects" },
        { service: "Carpentry", icon: "🪵", keywords: ["carpent", "furniture", "wood", "door", "table", "chair", "bed", "repair"], desc: "assist with furniture repair, woodwork, and doors" },
        { service: "Appliances Repair", icon: "🔌", keywords: ["appliance", "ac", "fridge", "washing machine", "tv", "cool", "repair"], desc: "repair your AC, fridge, washing machine, or TV" },
        { service: "Gardening", icon: "🌿", keywords: ["garden", "plant", "landscape", "grass", "tree"], desc: "take care of plants, landscaping, and garden maintenance" },
        { service: "Beauty", icon: "💄", keywords: ["beauty", "salon", "makeup", "hair", "skin", "facial", "cut"], desc: "offer salon services, makeup, haircare, and skincare" },
        { service: "Moving", icon: "📦", keywords: ["move", "shift", "packer", "mover", "relocat"], desc: "help with shifting, packing, moving, and relocation" },
        { service: "Pest Control", icon: "🪳", keywords: ["pest", "termite", "cockroach", "insect", "bug", "ant", "rat"], desc: "remove termites, cockroaches, and other insects" },
        { service: "IT Support", icon: "💻", keywords: ["it", "computer", "network", "laptop", "wifi", "internet", "pc", "software"], desc: "troubleshoot computer issues, networks, and repair laptops" },
        { service: "Tutor", icon: "📚", keywords: ["tutor", "tuition", "coach", "class", "math", "science", "english", "teach", "learn"], desc: "provide tuition, coaching, and private classes" }
      ];

      let matchedServices = [];

      servicesDict.forEach(s => {
        if (s.keywords.some(kw => lowerInput.includes(kw))) {
          matchedServices.push(s);
        }
      });

      let botResponse = "";

      if (matchedServices.length === 1) {
        const match = matchedServices[0];
        setPendingService(match.service);
        botResponse = `Heyy! 😊 That sounds like a ${match.service} issue ${match.icon}\n\nNo worries — I've got you covered! 💪\nI can help you ${match.desc}.\n\n✨ Would you like me to book this service for you right now?`;
        
      } else if (matchedServices.length > 1) {
        botResponse = `Hmm 🤔 I found a few services that might match your need:\n\n👉 ${matchedServices.map(s => s.service).join("\n👉 ")}\n\nCould you tell me a bit more so I can pick the perfect one for you? 😊`;
        
      } else {
        if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
          botResponse = `Hey there! 👋😊\nI'm super happy to help you today!\n\nTell me what you need — home services, repairs, anything — I’ve got you covered 💙`;
          
        } else {
          botResponse = `Oops 😅 I couldn’t quite catch that.\n\nCould you describe your issue a little more? I’ll make sure to find the perfect service for you! 💡`;
        }
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
