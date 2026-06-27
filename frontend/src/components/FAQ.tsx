import React, { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from './Card';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'How does the ATS Score work?',
      answer: 'Our ATS score analyzes your resume structure, file format, headings, keyword density, and overall relevance against typical ATS screening parameters. It checks if the text is fully parsable and grades it on standard industry criteria.',
    },
    {
      question: 'Is my resume secure on your servers?',
      answer: 'Absolutely. We prioritize your privacy above all else. Your uploaded documents are parsed in memory, fully encrypted, and deleted automatically from our database as soon as you finish your analysis session.',
    },
    {
      question: 'Can I compare my resume against multiple jobs?',
      answer: 'Yes! With our comparison and job-matching tool, you can copy-paste multiple job listings and run dedicated scans to optimize your resume for each specific job description side-by-side.',
    },
    {
      question: 'Can the AI rewrite my resume bullets?',
      answer: 'Yes, our AI Resume Suggestions tool will suggest stronger action verbs, recommend rephrasing for weak accomplishments, and help you structure your bullet points to emphasize impact and metrics.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="faq-section" id="faq">
      <SectionTitle 
        badge="Frequently Asked Questions"
        title="Got Questions? We Have Answers"
        subtitle="Learn more about how ResumeIQ AI analyzes your resume and helps you pass ATS checkups."
      />

      <div className="faq-container">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card key={index} className="faq-item" hoverEffect={false}>
              <button className="faq-question-btn" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              <div className={`faq-answer-container ${isOpen ? 'open' : ''}`}>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
