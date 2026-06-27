import React from 'react';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
}) => {
  return (
    <div className="section-header" style={{ textAlign: align }}>
      {badge && <span className="badge" style={{ margin: align === 'center' ? '0 auto 1rem auto' : '0 0 1rem 0' }}>{badge}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};
