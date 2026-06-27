import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';
import { Button } from './Button';
import { Check, Sparkles } from 'lucide-react';

export const Pricing: React.FC = () => {
  const freeFeatures = [
    'Unlimited ATS Resume Scans',
    'AI-Powered Formatting Check',
    'Side-by-Side Job Matching Analysis',
    'Missing Keyword & Skills Gap suggestions',
    'Custom Cover Letter Generator',
    'Customized Interview Questions generator',
    'Personal Career Coach chatbot interface',
    'High-fidelity PDF resume downloads',
  ];

  return (
    <section className="pricing-section" id="free-features">
      <SectionTitle 
        badge="100% Free Project"
        title="All Premium Features, Fully Free"
        subtitle="ResumeIQ AI is an open-source portfolio project. No credit card, no subscription, and no hidden fees."
      />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card className="pricing-card highlighted-plan-card" hoverEffect={true} style={{ padding: '3rem' }}>
          <div className="plan-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sparkles size={12} /> OPEN SOURCE
          </div>
          
          <div className="plan-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h4 className="plan-name" style={{ fontSize: '2rem' }}>Developer Plan</h4>
            <p className="plan-desc" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Access our complete smart ATS suite. Built as a high-fidelity demonstration workspace.
            </p>
            <div className="plan-price-container" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <span className="price" style={{ fontSize: '4rem' }}>Free</span>
              <span className="period" style={{ fontSize: '1.1rem', marginLeft: '0.5rem' }}>forever</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {freeFeatures.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                <Check size={18} color="var(--accent-light)" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="plan-cta" style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="#hero" style={{ width: '100%', maxWidth: '400px' }}>
              <Button variant="primary" className="w-full">
                Get Started Now (Free)
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};
