import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedCompanies } from './components/TrustedCompanies';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { DashboardPreview } from './components/DashboardPreview';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-quad',
    });
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Premium Ambient Gradients */}
      <div className="bg-gradient-glow glow-indigo"></div>
      <div className="bg-gradient-glow glow-purple"></div>
      <div className="bg-gradient-glow glow-accent"></div>
      <div className="bg-gradient-glow glow-subtle-1"></div>
      <div className="bg-gradient-glow glow-subtle-2"></div>

      {/* Landing Page Content */}
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <Stats />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
