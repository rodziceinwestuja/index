import React from 'react';

interface StepBadgeProps {
  step: number;
  label: string;
}

const StepBadge: React.FC<StepBadgeProps> = ({ step, label }) => (
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
    <div className="bg-accent border-2 border-white shadow-xl rounded-2xl px-8 py-3 flex flex-col items-center justify-center min-w-[200px]">
      <span className="text-[10px] font-bold uppercase opacity-90 mb-0.5 tracking-wider text-white">Krok {step}:</span>
      <span className="font-bold uppercase tracking-widest text-sm text-white">{label}</span>
    </div>
  </div>
);

export default StepBadge;