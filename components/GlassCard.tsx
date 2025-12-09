import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      relative
      backdrop-blur-xl 
      bg-white/40 
      border border-white/60 
      shadow-[0_8px_32px_0_rgba(200,190,220,0.15)] 
      rounded-3xl
      overflow-hidden
      ${className}
    `}>
      {/* Subtle shine effect on top-left */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
