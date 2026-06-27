import React from 'react';

export const TrustedCompanies: React.FC = () => {
  const companies = [
    { name: 'Microsoft', logoText: 'Microsoft' },
    { name: 'Google', logoText: 'Google' },
    { name: 'Amazon', logoText: 'Amazon' },
    { name: 'TCS', logoText: 'TCS' },
    { name: 'Infosys', logoText: 'Infosys' },
  ];

  return (
    <section className="trusted-companies">
      <p className="trusted-title">TRUSTED BY CANDIDATES HIRED AT</p>
      <div className="companies-grid">
        {companies.map((company, index) => (
          <div key={index} className="company-logo">
            <span className="company-logo-text">{company.logoText}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
