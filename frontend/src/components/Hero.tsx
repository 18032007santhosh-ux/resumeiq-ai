import React from 'react';
import { Sparkles, ArrowRight, UploadCloud, Play, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const Hero: React.FC = () => {
  return (
    <header className="hero" id="hero">
      <div className="hero-content" data-aos="fade-right" data-aos-duration="1000">
        <div className="trust-badge-wrapper">
          <div className="trust-badge">
            <span className="badge-text">⭐ AI Powered ATS Resume Analyzer</span>
          </div>
          <span className="trust-sub">Trusted by Students & Job Seekers</span>
        </div>
        <h1 className="hero-title">
          AI Resume <span>Analyzer</span>
        </h1>
        <p className="hero-desc">
          Get past Applicant Tracking Systems (ATS) and secure more interviews. ResumeIQ AI scans formatting, matching, and keywords, giving you actionable steps in seconds.
        </p>
        <div className="hero-cta">
          <a href="#demo-preview">
            <Button variant="primary" className="btn-large animate-pulse-glow">
              Analyze My Resume <UploadCloud size={20} style={{ marginLeft: '0.25rem' }} />
            </Button>
          </a>
          <a href="#demo-preview">
            <Button variant="secondary" className="btn-large">
              Try Demo <Play size={16} />
            </Button>
          </a>
        </div>
      </div>

      <div className="demo-card" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
        {/* Floating Mini Dashboard Cards to represent visual illustration */}
        <div className="floating-card-container">
          <Card className="floating-dashboard-widget main-widget">
            <div className="score-badge">
              <span className="score-num">87</span>
              <span className="score-lbl">ATS Score</span>
            </div>
            
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <Cpu size={18} color="#6366f1" /> resume_v2_final.pdf
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <div className="demo-item">
                <span className="demo-item-label">
                  <CheckCircle2 size={16} color="#14b8a6" /> ATS Formatting
                </span>
                <span className="status-badge status-pass">Passing</span>
              </div>
              <div className="demo-item">
                <span className="demo-item-label">
                  <ShieldAlert size={16} color="#f59e0b" /> Skill Keywords
                </span>
                <span className="status-badge status-warn">8 Missing</span>
              </div>
              <div className="demo-item">
                <span className="demo-item-label">
                  <CheckCircle2 size={16} color="#14b8a6" /> Section Structure
                </span>
                <span className="status-badge status-pass">Optimal</span>
              </div>
            </div>
          </Card>

          <Card className="floating-dashboard-widget overlay-widget-1 shadow-lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="widget-dot green"></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Job Match Rate</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#14b8a6' }}>92% Match</p>
              </div>
            </div>
          </Card>

          <Card className="floating-dashboard-widget overlay-widget-2 shadow-lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="widget-dot purple"></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary Prediction</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#a855f7' }}>+$12,500 Market Value</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </header>
  );
};
