import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// المكونات الرئيسية
import Header from './component/Header';
import Hero from './component/HeroSection';
import TemplatesSection from './component/TemplatesSection';
import LogoCloud from './component/LogoCloud';
import MobileSites from './component/MobileSites';
import CtaSection from './component/CtaSection';
import Footer from './component/Footer';

// مكون المصادقة
import Auth from './component/Auth'; // تأكد من ضبط المسار حسب مكان ملف Auth.tsx

// مكون الصفحة الرئيسية
function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <TemplatesSection />
      <LogoCloud />
      <MobileSites />
      <CtaSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* المسار الرئيسي */}
        <Route path="/" element={<HomePage />} />
        
        {/* مسار تسجيل الدخول / إنشاء الحساب */}
        <Route path="/Auth" element={<Auth />} />
        
        {/* يمكنك إضافة مسار بحروف صغيرة أيضاً للتيسير على المستخدمين */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;