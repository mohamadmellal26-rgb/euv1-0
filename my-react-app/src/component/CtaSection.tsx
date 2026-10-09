import './CtaSection.css';

export default function CtaSection() {
  const handleGetStarted = () => {
    console.log('Get Started clicked');
  };

  return (
    <div className="cta-container">
      <div className="cta-content">
        <h2 className="cta-title">Start building with v0</h2>
        <p className="cta-description">
          Go from idea to production in seconds with smart, secure infrastructure
        </p>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}