import React from 'react';

interface PixelCatProps {
  type: 'calico' | 'ragdoll' | 'tabby' | 'crystal-ball' | 'magic-hat' | 'magic-wand';
  className?: string;
}

export const PixelCat: React.FC<PixelCatProps> = ({ type, className }) => {
  // Simple SVG pixel-style elements
  if (type === 'calico') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="8" width="10" height="6" fill="#FFFFFF" />
        <rect x="3" y="8" width="4" height="3" fill="#F97316" />
        <rect x="10" y="11" width="3" height="3" fill="#1F2937" />
        <rect x="5" y="3" width="7" height="6" fill="#FFFFFF" />
        <rect x="5" y="3" width="3" height="3" fill="#F97316" />
        <rect x="9" y="3" width="3" height="2" fill="#1F2937" />
        <rect x="5" y="1" width="2" height="2" fill="#FFFFFF" />
        <rect x="10" y="1" width="2" height="2" fill="#FFFFFF" />
        <rect x="6" y="5" width="1" height="1" fill="#000000" />
        <rect x="10" y="5" width="1" height="1" fill="#000000" />
        <rect x="8" y="6" width="1" height="1" fill="#FF9999" />
        <rect x="13" y="9" width="2" height="1" fill="#1F2937" />
        <rect x="14" y="7" width="1" height="2" fill="#1F2937" />
      </svg>
    );
  }

  if (type === 'ragdoll') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="8" width="10" height="6" fill="#FFFFFF" />
        <rect x="3" y="8" width="10" height="2" fill="#F3F4F6" />
        <rect x="5" y="3" width="7" height="6" fill="#FFFFFF" />
        <rect x="5" y="3" width="2" height="4" fill="#9CA3AF" />
        <rect x="10" y="3" width="2" height="4" fill="#9CA3AF" />
        <rect x="7" y="3" width="3" height="2" fill="#9CA3AF" />
        <rect x="5" y="1" width="2" height="2" fill="#9CA3AF" />
        <rect x="10" y="1" width="2" height="2" fill="#9CA3AF" />
        <rect x="6" y="5" width="1" height="1" fill="#3B82F6" />
        <rect x="10" y="5" width="1" height="1" fill="#3B82F6" />
        <rect x="8" y="7" width="1" height="1" fill="#FF9999" />
        <rect x="13" y="9" width="3" height="1" fill="#9CA3AF" />
      </svg>
    );
  }

  if (type === 'tabby') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body - Brown with black stripes */}
        <rect x="3" y="8" width="10" height="6" fill="#78350f" />
        <rect x="4" y="9" width="8" height="1" fill="#1c1917" />
        <rect x="4" y="11" width="8" height="1" fill="#1c1917" />
        <rect x="4" y="13" width="8" height="1" fill="#1c1917" />
        {/* Head */}
        <rect x="5" y="3" width="7" height="6" fill="#78350f" />
        <rect x="6" y="4" width="5" height="1" fill="#1c1917" />
        <rect x="6" y="6" width="5" height="1" fill="#1c1917" />
        {/* Ears */}
        <rect x="5" y="1" width="2" height="2" fill="#78350f" />
        <rect x="10" y="1" width="2" height="2" fill="#78350f" />
        {/* Eyes */}
        <rect x="6" y="5" width="1" height="1" fill="#000000" />
        <rect x="10" y="5" width="1" height="1" fill="#000000" />
        {/* Nose */}
        <rect x="8" y="7" width="1" height="1" fill="#FF9999" />
        {/* Tail */}
        <rect x="13" y="9" width="3" height="1" fill="#1c1917" />
      </svg>
    );
  }

  if (type === 'crystal-ball') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="7" r="6" fill="#6b21a8" fillOpacity="0.6" />
        <circle cx="6" cy="5" r="2" fill="#FFFFFF" fillOpacity="0.3" />
        <rect x="4" y="13" width="8" height="2" fill="#fbbf24" />
        <rect x="5" y="12" width="6" height="1" fill="#fbbf24" />
      </svg>
    );
  }

  if (type === 'magic-hat') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L3 12H13L8 1Z" fill="#4b2c20" />
        <rect x="2" y="12" width="12" height="2" fill="#4b2c20" />
        <rect x="3" y="10" width="10" height="1" fill="#db2777" />
        <rect x="7" y="10" width="2" height="1" fill="#fbbf24" />
      </svg>
    );
  }

  if (type === 'magic-wand') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="13" width="12" height="1" fill="#78350f" transform="rotate(-45 8 8)" />
        <path d="M12 2L13 4L15 5L13 6L12 8L11 6L9 5L11 4L12 2Z" fill="#fbbf24" />
        <circle cx="12" cy="4" r="1" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    );
  }

  return null;
};
