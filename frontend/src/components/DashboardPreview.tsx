import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  ListTodo, 
  Sparkles, 
  CheckCircle,
  BarChart3,
  Layers,
  Search
} from 'lucide-react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

export const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'skills'>('overview');

  return (
    <section className="dashboard-preview-section" id="demo-preview" data-aos="fade-up" data-aos-duration="1000">
      <SectionTitle 
        badge="Interactive Demo"
        title="Experience the Power of ResumeIQ"
        subtitle="Explore the live simulated analytics platform candidates use to scale their application quality."
      />

      <div className="dashboard-container glass-card">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-brand">
            <Sparkles size={20} color="#6366f1" />
            <span>Developer Panel</span>
          </div>
          <ul className="sidebar-menu">
            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              <BarChart3 size={16} /> Overview
            </li>
            <li className={activeTab === 'keywords' ? 'active' : ''} onClick={() => setActiveTab('keywords')}>
              <Search size={16} /> Missing Keywords
            </li>
            <li className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>
              <Layers size={16} /> Skills Gap
            </li>
          </ul>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content-area">
          {activeTab === 'overview' && (
            <div className="dashboard-tab-grid">
              {/* ATS Score */}
              <div className="dashboard-widget score-widget" data-aos="zoom-in" data-aos-delay="100">
                <h5>ATS Matching Score</h5>
                <div className="score-circle-container">
                  <svg viewBox="0 0 100 100" className="progress-ring">
                    <circle className="progress-ring-bg" cx="50" cy="50" r="40" />
                    <circle className="progress-ring-fill" cx="50" cy="50" r="40" strokeDasharray="251.2" strokeDashoffset="20.1" />
                  </svg>
                  <div className="score-inner-text">
                    <span className="number">92%</span>
                    <span className="label">Excellent</span>
                  </div>
                </div>
                <p className="widget-info">Target role: Full Stack Engineer</p>
              </div>

              {/* Resume Strength */}
              <div className="dashboard-widget strength-widget" data-aos="zoom-in" data-aos-delay="200">
                <h5>Matched Skills</h5>
                <div className="skills-badge-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  <span className="skill-pill matched">Java</span>
                  <span className="skill-pill matched">React</span>
                  <span className="skill-pill matched">Node</span>
                  <span className="skill-pill matched">JavaScript</span>
                  <span className="skill-pill matched">SQL</span>
                </div>
                
                <h5 style={{ marginTop: '1.5rem' }}>Missing Skills</h5>
                <div className="skills-badge-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  <span className="skill-pill missing-pill">Docker</span>
                  <span className="skill-pill missing-pill">AWS</span>
                </div>
              </div>

              {/* Recent Resume */}
              <div className="dashboard-widget recent-widget" data-aos="zoom-in" data-aos-delay="300">
                <h5>Active Upload</h5>
                <div className="file-preview-card">
                  <FileText size={32} color="#6366f1" />
                  <div>
                    <p className="file-name">Santhosh_CV_2026.pdf</p>
                    <p className="file-meta">PDF • 1.4 MB • Checked 2m ago</p>
                  </div>
                </div>
                <div className="widget-checklist">
                  <div className="checklist-item done"><CheckCircle size={14} /> Correct Margins</div>
                  <div className="checklist-item done"><CheckCircle size={14} /> Single Page Format</div>
                  <div className="checklist-item warning"><AlertCircle size={14} /> Add cloud infrastructure credentials</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="dashboard-tab-content">
              <h5>Missing Keywords & ATS Optimization</h5>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                We found missing crucial keywords based on the top 50 Full Stack Engineer job openings.
              </p>
              
              <div className="keyword-pills-container">
                <div className="keyword-pill missing">Docker <span className="action">+ Add</span></div>
                <div className="keyword-pill missing">AWS <span className="action">+ Add</span></div>
                <div className="keyword-pill missing">Kubernetes <span className="action">+ Add</span></div>
                <div className="keyword-pill found"><CheckCircle size={12} /> Java</div>
                <div className="keyword-pill found"><CheckCircle size={12} /> React</div>
                <div className="keyword-pill found"><CheckCircle size={12} /> Node</div>
                <div className="keyword-pill found"><CheckCircle size={12} /> SQL</div>
              </div>

              <div className="suggestion-box">
                <h6>AI Rewriting Recommendation</h6>
                <p className="suggestion-text">
                  "Add bullet point: 'Containerized microservices using <strong>Docker</strong> and deployed on <strong>AWS</strong> ECS with high availability, reducing provisioning times by 40%.'"
                </p>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="dashboard-tab-content">
              <h5>Skills Gap Assessment</h5>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Match rate of your capabilities versus market expectations.
              </p>
              <div className="skills-chart-mock">
                <div className="chart-bar-group">
                  <span className="label">Java / Node Backend</span>
                  <div className="chart-track"><div className="fill" style={{ width: '95%', background: 'linear-gradient(95deg, var(--primary), var(--secondary))' }}></div></div>
                  <span className="value">95%</span>
                </div>
                <div className="chart-bar-group">
                  <span className="label">React Frontend</span>
                  <div className="chart-track"><div className="fill" style={{ width: '90%', background: 'linear-gradient(95deg, var(--primary), var(--secondary))' }}></div></div>
                  <span className="value">90%</span>
                </div>
                <div className="chart-bar-group">
                  <span className="label">DevOps / Cloud</span>
                  <div className="chart-track"><div className="fill" style={{ width: '30%', background: '#ef4444' }}></div></div>
                  <span className="value">30%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
