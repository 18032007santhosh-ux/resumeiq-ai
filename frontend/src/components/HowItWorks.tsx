import React from 'react';
import { UploadCloud, Cpu, Sparkles, Download, ArrowRight } from 'lucide-react';
import { SectionTitle } from './SectionTitle';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <UploadCloud size={32} />,
      title: 'Upload Resume',
      desc: 'Drag & drop your current resume PDF or Word file in seconds.'
    },
    {
      num: '02',
      icon: <Cpu size={32} />,
      title: 'AI Analysis',
      desc: 'Our neural networks scan for parsing failures, keywords, and density.'
    },
    {
      num: '03',
      icon: <Sparkles size={32} />,
      title: 'Improve Resume',
      desc: 'Apply tailor-made recommendations to patch critical issues.'
    },
    {
      num: '04',
      icon: <Download size={32} />,
      title: 'Download Better Resume',
      desc: 'Export your highly-optimized, high-scoring ATS-ready document.'
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <SectionTitle 
        badge="Workflow"
        title="Four Simple Steps to Success"
        subtitle="Transform your resume from generic to optimized in less than 2 minutes."
      />
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-wrapper">
            <div className="step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-icon-container">
                {step.icon}
              </div>
              <h4 className="step-card-title">{step.title}</h4>
              <p className="step-card-desc">{step.desc}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="step-connector">
                <ArrowRight size={24} className="connector-icon" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
