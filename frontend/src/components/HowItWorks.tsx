import React from 'react';
import { UploadCloud, Cpu, Sparkles, Download, ArrowRight } from 'lucide-react';
import { SectionTitle } from './SectionTitle';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1️⃣',
      icon: <UploadCloud size={32} />,
      title: 'Upload Resume',
      desc: 'Drag & drop your current resume PDF or Word file in seconds.'
    },
    {
      num: '2️⃣',
      icon: <Cpu size={32} />,
      title: 'AI Extracts Data',
      desc: 'Our neural networks parse and extract key credentials from your document.'
    },
    {
      num: '3️⃣',
      icon: <Sparkles size={32} />,
      title: 'ATS Analysis',
      desc: 'ResumeIQ compares your resume structure and keywords against top job profiles.'
    },
    {
      num: '4️⃣',
      icon: <Download size={32} />,
      title: 'Improve Resume',
      desc: 'Apply tailor-made AI suggestions to output a high-scoring ATS-ready document.'
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works" data-aos="fade-up" data-aos-duration="1000">
      <SectionTitle 
        badge="Workflow"
        title="Four Simple Steps to Success"
        subtitle="Transform your resume from generic to optimized in less than 2 minutes."
      />
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-wrapper" data-aos="fade-up" data-aos-delay={index * 150} data-aos-duration="800">
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
