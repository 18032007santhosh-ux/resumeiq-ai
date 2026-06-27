import React from 'react';
import { 
  Award, 
  Sparkles, 
  FileCheck, 
  Key, 
  History, 
  FileText, 
  HelpCircle, 
  UserCheck 
} from 'lucide-react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

export const Features: React.FC = () => {
  const featuresList = [
    {
      icon: <Award size={24} />,
      title: 'ATS Resume Score',
      description: 'Get an instant scoring breakdown representing how well your resume matches ATS algorithms.',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'AI Resume Suggestions',
      description: 'Step-by-step smart suggestions to structure your experiences and highlight achievements.',
    },
    {
      icon: <FileCheck size={24} />,
      title: 'Resume vs Job Matching',
      description: 'Compare your resume against any target job description side-by-side to ensure compliance.',
    },
    {
      icon: <Key size={24} />,
      title: 'Keyword Optimization',
      description: 'Uncover missing industry-relevant skills and keywords that recruiter search filters track.',
    },
    {
      icon: <History size={24} />,
      title: 'Resume History',
      description: 'Track version histories, analyze scores over time, and compare multiple drafts easily.',
    },
    {
      icon: <FileText size={24} />,
      title: 'Cover Letter Generator',
      description: 'Instantly write professional, job-tailored cover letters that complement your resume.',
    },
    {
      icon: <HelpCircle size={24} />,
      title: 'Interview Questions',
      description: 'Generate customized behavioral and technical questions based directly on your resume.',
    },
    {
      icon: <UserCheck size={24} />,
      title: 'Career Coach',
      description: 'Interact with a virtual AI career counselor for personalized career paths and guidance.',
    },
  ];

  return (
    <section className="features-section" id="features">
      <SectionTitle 
        badge="Features"
        title="Supercharge Your Job Search"
        subtitle="Our advanced AI-driven features assist you through every phase of the recruitment funnel."
      />
      <div className="features-grid">
        {featuresList.map((feature, index) => (
          <Card key={index} className="feature-card">
            <div className="feature-icon-wrapper">
              {feature.icon}
            </div>
            <h4 className="feature-title">{feature.title}</h4>
            <p className="feature-desc">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
