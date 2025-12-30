import React from 'react';

interface SimulatorTriggerProps {
  onClick: () => void;
}

const SimulatorTrigger: React.FC<SimulatorTriggerProps> = ({ onClick }) => (
  <div 
    onClick={onClick} 
    className="mb-12 p-6 md:p-8 bg-white border border-gray-100 rounded-[32px] shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 hover:border-accent cursor-pointer group flex flex-col md:flex-row items-center gap-6 text-center md:text-left border-l-8 border-l-accent hover-card-crisp"
  >
    <div className="w-20 h-20 bg-accent/5 rounded-2xl flex items-center justify-center transition-transform duration-300">
      <i className="fas fa-chart-pie text-4xl text-accent"></i>
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-primary mb-1">Kalkulator Przyszłości</h3>
      <p className="text-gray-500 text-sm">Sprawdź potencjalne zyski z regularnych inwestycji</p>
    </div>
    {/* Removed separate hover translation to avoid double-lift effect and blur issues */}
    <div className="bg-primary text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg group-hover:bg-primary/90 flex items-center gap-2 transition-colors">
      Oblicz swój zysk <i className="fas fa-chevron-right text-xs"></i>
    </div>
  </div>
);

export default SimulatorTrigger;