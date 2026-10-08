import React from 'react';

export const DharmachakraIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Rim */}
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
    
    {/* Center Hub */}
    <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
    <circle cx="24" cy="24" r="2.5" fill="currentColor" />

    {/* 8 Spokes */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 24 + 6 * Math.cos(angle);
      const y1 = 24 + 6 * Math.sin(angle);
      const x2 = 24 + 18 * Math.cos(angle);
      const y2 = 24 + 18 * Math.sin(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    })}

    {/* Outer Droplets/Knobs at 8 Points */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const cx = 24 + 21 * Math.cos(angle);
      const cy = 24 + 21 * Math.sin(angle);
      return <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.5" fill="currentColor" />;
    })}
  </svg>
);

export const EndlessKnotIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M10 6L16 12L22 6L26 10L20 16L26 22L22 26L16 20L10 26L6 22L12 16L6 10L10 6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 4V10M16 22V28M4 16H10M22 16H28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
