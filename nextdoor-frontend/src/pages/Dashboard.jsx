import { useState } from "react";
import CategoryCard from "../components/CategoryCard";
import ChatbotWidget from "../components/ChatbotWidget";
import "./Dashboard.css";
import "../components/NavBar.jsx"; // Import NavBar styles for consistent look

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { title: "Plumbing", description: "Fix leaks, pipes, and drains" },
    { title: "Electrical", description: "Wiring, repairs, and installations" },
    { title: "Cleaning", description: "House, office, and deep cleaning" },
    { title: "Painting", description: "Interior and exterior painting" },
    { title: "Carpentry", description: "Furniture repair and custom wood" },
    { title: "Appliances", description: "Repair for AC, fridge, washing machine" },
    { title: "Gardening", description: "Landscaping and garden maintenance" },
    { title: "Beauty", description: "Salon services at home" },
    { title: "Moving", description: "Packers and movers services" },
    { title: "Pest Control", description: "Termite and bug removal" },
    { title: "IT Support", description: "Computer and network troubleshooting" },
    { title: "Tutor", description: "Private lessons and coaching" },
  ];

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Hero / Search Section */}
      <div className="dashboard-header">
        
        <p>Find the best local professionals for your needs</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for services (e.g., Plumbing, Cleaning)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="category-section">
        <h2 className="section-title">
          {searchTerm ? `Results for "${searchTerm}"` : "All Categories"}
        </h2>

        {filteredCategories.length > 0 ? (
          <div className="category-grid">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                description={category.description}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No services found matching "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")}>Clear Search</button>
          </div>
        )}
      </div>

      {/* Chatbot */}
      <ChatbotWidget />
    </div>
  );
}

export default Dashboard;
