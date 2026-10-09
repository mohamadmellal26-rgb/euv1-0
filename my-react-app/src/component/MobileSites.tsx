import './MobileSites.css';

interface MobileTemplate {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  tagText?: string;
}

const mobileTemplates: MobileTemplate[] = [
  {
    id: 1,
    title: "Project Alpha",
    category: "MOBILE APP DESIGN",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/aeb591164284711.63f481f03b4f9.png",
  },
  {
    id: 2,
    title: "Creative Dashboard",
    category: "ANALYTICS APP",
    imageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/3ac141104657977.5f684785eaed8.png",
    tagText: "🌙 Dark Mode"
  },
  {
    id: 3,
    title: "Smart Home Hub",
    category: "IOT INTEGRATION",
    imageUrl: "https://i.pinimg.com/736x/cd/31/98/cd319872daed461b8d0df4a086049edf.jpg",
  },
  {
    id: 4,
    title: "Webflow Portfolio",
    category: "PORTFOLIO",
    imageUrl: "https://global-uploads.webflow.com/63a9fb94e473f36dbe99c1b1/648b4025e77707c9cf12b401_WJgWyzI1SWizvQwUD3IT.jpeg",
  },
  {
    id: 5,
    title: "Ride Sharing App",
    category: "Taxi Service",
    imageUrl: "https://masterbundles.com/wp-content/uploads/2023/03/ride-car-234.png",
  },
];

export default function MobileSites() {
  const handleCardClick = (title: string) => {
    console.log(`Clicked mobile template: ${title}`);
  };

  return (
    <div className="ms-container">
      <div className="ms-wrapper">
        
        {/* قسم العنوان العلوي */}
        <div className="ms-header">
          <h2 className="ms-title">Ship mobile sites</h2>
          <button className="ms-browse-btn" onClick={() => console.log('Browse all clicked')}>
            Browse all <span>›</span>
          </button>
        </div>

        {/* شبكة البطاقات */}
        <div className="ms-scroll-container">
          <div className="ms-grid">
            {mobileTemplates.map((template) => (
              <div 
                key={template.id} 
                className="ms-card"
                onClick={() => handleCardClick(template.title)}
              >
                {/* خلفية الصورة تملأ البطاقة بالكامل */}
                <div className="ms-card-image-wrapper">
                  <img src={template.imageUrl} alt={template.title} className="ms-bg-img" />
                  <div className="ms-overlay-gradient"></div>
                </div>

                {/* النصوص في الأعلى */}
                <div className="ms-card-content">
                  <span className="ms-card-category">{template.category}</span>
                  <h3 className="ms-card-title">{template.title}</h3>
                </div>

                {/* شارة اختيارية في الأسفل مثل Dark Mode */}
                {template.tagText && (
                  <div className="ms-card-footer-tag">
                    <span>{template.tagText}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}