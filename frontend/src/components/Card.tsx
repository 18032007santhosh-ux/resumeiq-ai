import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverEffect = true,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`glass-card ${hoverEffect ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
