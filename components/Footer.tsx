import { ArrowRight, Box } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <Box className="footer-logo" />
            <span className="footer-name">Visora</span>
          </div>
          <p>From floor plans to vivid 3D stories — quickly, beautifully, and collaboratively.</p>
        </div>

        <div className="footer-links">
          <Link to="/pricing">Pricing</Link>
          <Link to="/community">Community</Link>
          <Link to="/enterprise">Enterprise</Link>
        </div>

        <div className="footer-meta">
          <span className="footer-copyright">© Mandar Navarkar 2026</span>
          <a href="/" className="footer-cta">
            Start building <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
