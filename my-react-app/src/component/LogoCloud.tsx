import './LogoCloud.css';

export default function LogoCloud() {
  const logos = [
    {
      id: 1,
      name: "Klaviyo",
      content: (
        <div className="lc-logo-item">
          <span className="lc-klaviyo-text">klaviyo</span>
          <div className="lc-klaviyo-flag"></div>
        </div>
      ),
    },
    {
      id: 2,
      name: "Mercado Libre",
      content: (
        <div className="lc-logo-item lc-mercado">
          <div className="lc-handshake-icon">🤝</div>
          <div className="lc-mercado-text">
            <span className="lc-m-title">mercado</span>
            <span className="lc-m-sub">libre</span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      name: "Vanta",
      content: (
        <div className="lc-logo-item lc-vanta">
          <span>VANTA</span>
        </div>
      ),
    },
    {
      id: 4,
      name: "Stripe",
      content: (
        <div className="lc-logo-item lc-stripe">
          <span>stripe</span>
        </div>
      ),
    },
  ];

  const handleLogoClick = (name: string) => {
    console.log(`Clicked on: ${name}`);
  };

  return (
    <div className="lc-container">
      <div className="lc-marquee">
        <div className="lc-track">
          {/* نكرر المصفوفة 3 مرات لضمان عدم حدوث أي فراغ نهائياً أثناء الحركة */}
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div 
              className="lc-slide" 
              key={`logo-${index}`}
              onClick={() => handleLogoClick(logo.name)}
            >
              {logo.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}