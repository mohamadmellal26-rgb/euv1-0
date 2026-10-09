import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        
        {/* الشعار أو اسم الموقع في أقصى اليسار */}
        <div className="footer-brand">
          <span className="footer-logo">v0</span>
        </div>

        {/* أعمدة الروابط */}
        <div className="footer-links-grid">
          
          {/* عمود Product */}
          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#enterprise">Enterprise</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#students">v0 for Students</a></li>
            </ul>
          </div>

          {/* عمود Company */}
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              <li><a href="#terms">Terms</a></li>
              <li><a href="#ai-policy">AI Policy</a></li>
              <li><a href="#privacy">Privacy</a></li>
            </ul>
          </div>

          {/* عمود Resources */}
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-list">
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#docs">Docs</a></li>
              <li><a href="#ambassadors">Ambassadors</a></li>
              <li><a href="#community">Vercel Community</a></li>
              <li><a href="#vercel">Vercel</a></li>
            </ul>
          </div>

          {/* عمود Social */}
          <div className="footer-column">
            <h4 className="footer-heading">Social</h4>
            <ul className="footer-list">
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#linkedin">LinkedIn</a></li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}