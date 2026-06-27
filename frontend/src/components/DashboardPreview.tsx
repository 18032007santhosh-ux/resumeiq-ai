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
    <section className="dashboard-preview-section" id="demo-preview">
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
              <div className="dashboard-widget score-widget">
                <h5>ATS Matching Score</h5>
                <div className="score-circle-container">
                  <svg viewBox="0 0 100 100" className="progress-ring">
                    <circle className="progress-ring-bg" cx="50" cy="50" r="40" />
                    <circle className="progress-ring-fill" cx="50" cy="50" r="40" strokeDasharray="251.2" strokeDashoffset="37.6" />
                  </svg>
                  <div className="score-inner-text">
                    <span className="number">85</span>
                    <span className="label">Excellent</span>
                  </div>
                </div>
                <p className="widget-info">Target role: Senior React Engineer</p>
              </div>

              {/* Resume Strength */}
              <div className="dashboard-widget strength-widget">
                <h5>Resume Strength</h5>
                <div className="strength-metrics">
                  <div className="metric-row">
                    <span>Readability</span>
                    <div className="strength-bar"><div className="fill" style={{ width: '92%' }}></div></div>
                    <span>92%</span>
                  </div>
                  <div className="metric-row">
                    <span>Action Verbs</span>
                    <div className="strength-bar"><div className="fill" style={{ width: '75%', background: 'var(--secondary)' }}></div></div>
                    <span>75%</span>
                  </div>
                  <div className="metric-row">
                    <span>Quantifiable Stats</span>
                    <div className="strength-bar"><div className="fill" style={{ width: '80%', background: 'var(--accent)' }}></div></div>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              {/* Recent Resume */}
              <div className="dashboard-widget recent-widget">
                <h5>Active Upload</h5>
                <div className="file-preview-card">
                  <FileText size={32} color="#6366f1" />
                  <div>
                    <p className="file-name">John_Doe_CV_2026.pdf</p>
                    <p className="file-meta">PDF • 1.4 MB • Checked 2m ago</p>
                  </div>
                </div>
                <div className="widget-checklist">
                  <div className="checklist-item done"><CheckCircle size={14} /> Correct Margins</div>
                  <div className="checklist-item done"><CheckCircle size={14} /> Single Page Format</div>
                  <div className="checklist-item warning"><AlertCircle size={14} /> Avoid multi-column tables</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="dashboard-tab-content">
              <h5>Missing Keywords & ATS Optimization</h5>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                We found missing crucial keywords based on the top 50 Senior Frontend Engineer job openings.
              </p>
              
              <div className="keyword-pills-container">
                <div className="keyword-pill missing">TypeScript <span className="action">+ Add</span></div>
                <div className="keyword-pill missing">Next.js <span className="action">+ Add</span></div>
                <div className="keyword-pill missing">Redux Toolkit <span className="action">+ Add</span></div>
                <div className="keyword-pill missing">CI/CD <span className="action">+ Add</span></div>
                <div className="keyword-pill found"><CheckCircle size={12} /> React</div>
                <div className="keyword-pill found"><CheckCircle size={12} /> TailwindCSS</div>
                <div className="keyword-pill found"><CheckCircle size={12} /> REST APIs</div>
              </div>

              <div className="suggestion-box">
                <h6>AI Rewriting Recommendation</h6>
                <p className="suggestion-text">
                  "Replace the bullet point: 'Managed state in React apps' with 'Engineered enterprise state management using <strong>Redux Toolkit</strong> reducing load overhead by 15%.'"
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
                  <span className="label">Frontend Core</span>
                  <div className="chart-track"><div className="fill" style={{ width: '95%', background: 'linear-gradient(95deg, var(--primary), var(--secondary))' }}></div></div>
                  <span className="value">95%</span>
                </div>
                <div className="chart-bar-group">
                  <span className="label">State / API</span>
                  <div className="chart-track"><div className="fill" style={{ width: '80%', background: 'linear-gradient(95deg, var(--primary), var(--secondary))' }}></div></div>
                  <span className="value">80%</span>
                </div>
                <div className="chart-bar-group">
                  <span className="label">Cloud / Deploy</span>
                  <div className="chart-track"><div className="fill" style={{ width: '45%', background: '#ef4444' }}></div></div>
                  <span className="value">45%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
