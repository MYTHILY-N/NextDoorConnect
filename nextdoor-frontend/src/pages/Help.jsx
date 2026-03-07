import "./Help.css";

function Help() {
  return (
    <div className="help-container">
      <div className="help-content">
        <h2>Help & Support</h2>
        <p>Welcome to our Help Center. Find answers to frequently asked questions and get support.</p>
        
        <div className="help-faq">
          <div className="faq-item">
            <h4>How do I create an account?</h4>
            <p>Click on the Register button and fill in your details. You'll need to provide your name, email, phone number, and address for verification.</p>
          </div>
          <div className="faq-item">
            <h4>How does the verification process work?</h4>
            <p>After registration, admins review your documents. You'll receive a notification once your account is verified.</p>
          </div>
          <div className="faq-item">
            <h4>Can I list multiple services?</h4>
            <p>Yes! Service providers can list multiple services. Contact support for more details.</p>
          </div>
          <div className="faq-item">
            <h4>How do I contact support?</h4>
            <p>You can reach out through the Feedback page or email us directly at support@nextdoorconnect.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
