import React from 'react';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Software Engineer at Google',
      review: 'ResumeIQ helped me identify exactly what was wrong with my formatting and key sections. After implementing the recommended keyword enhancements, my interview callback rate doubled!',
      avatarLetters: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager at Microsoft',
      review: 'Absolutely brilliant. The ATS check is incredibly detailed, and the AI suggestions helped me reword my resume bullets to sound far more impact-driven and analytical.',
      avatarLetters: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist at Amazon',
      review: 'I love the side-by-side job matching feature. I customized my resume for three different roles and managed to land callbacks for all three of them!',
      avatarLetters: 'ER',
    },
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <SectionTitle 
        badge="Success Stories"
        title="Loved by Job Seekers"
        subtitle="See how professionals landed their dream jobs at major tech companies using ResumeIQ."
      />

      <div className="testimonials-grid">
        {reviews.map((item, index) => (
          <Card key={index} className="testimonial-card">
            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="var(--secondary)" color="var(--secondary)" />
              ))}
            </div>
            <p className="testimonial-review">"{item.review}"</p>
            <div className="testimonial-user">
              <div className="user-avatar-placeholder">
                {item.avatarLetters}
              </div>
              <div>
                <p className="user-name">{item.name}</p>
                <p className="user-role">{item.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
