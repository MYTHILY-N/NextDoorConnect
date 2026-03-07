import { useNavigate } from "react-router-dom";

function CategoryCard({ title, description }) {
  const navigate = useNavigate();

  return (
    <div
      className="category-card"
      onClick={() => navigate("/services")}
    >
      <div className="card-icon-placeholder">
        {/* Placeholder for icon based on title first letter */}
        {title.charAt(0)}
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
      <div className="card-arrow">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  );
}

export default CategoryCard;
