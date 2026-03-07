import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p>© {new Date().getFullYear()} NextDoor Connect</p>
        </div>
        <div className="footer-right">
          <span>Built for Neighbors, Powered by Trust.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

