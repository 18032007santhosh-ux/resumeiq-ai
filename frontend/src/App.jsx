import React from 'react';
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

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Premium Ambient Gradients */}
      <div className="bg-gradient-glow glow-indigo"></div>
      <div className="bg-gradient-glow glow-purple"></div>
      <div className="bg-gradient-glow glow-accent"></div>

      {/* Landing Page Content */}
      <Navbar />
      <Hero />
      <TrustedCompanies />
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
