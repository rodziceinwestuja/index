import React, { useState } from 'react';
import ProvidersModal, { ProviderType } from '../../ProvidersModal';

const ResultMetals: React.FC = () => {
  const [modalType, setModalType] = useState<ProviderType>(null);

  // Card style: interactive button with crisp hover effect (shadow only)
  const cardStyle = "w-full bg-white p-6 md:p-8 rounded-[32px] border shadow-lg flex flex-col items-center text-center relative overflow-hidden group hover:shadow-xl cursor-pointer hover-card-crisp";

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Złoto i Srebro</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            To doskonałe zabezpieczenie majątku. Możesz w nie inwestować na dwa sposoby – wybierz ten, który bardziej do Ciebie pasuje.
          </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Physical Card */}
          <button onClick={() => setModalType('metals')} className={`${cardStyle} border-amber-100 shadow-amber-100/40 hover:border-amber-300 hover:shadow-amber-200/50`}>
              {/* Background Icon */}
              <i className="fas fa-coins absolute -bottom-5 -right-5 text-8xl md:text-9xl text-amber-50 opacity-50 transition-transform duration-500"></i>
              
              <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">Złoto Fizyczne</h3>
              <p className="text-sm text-gray-600 mb-6 relative z-10 leading-relaxed">
                  Kupujesz prawdziwe monety lub sztabki. Masz je w ręku. To daje pełną niezależność od banków, ale wymaga bezpiecznego przechowywania (sejf).
              </p>
              
              <div className="mt-auto relative z-10 bg-amber-100 text-amber-700 font-bold px-6 py-3 rounded-full group-hover:bg-amber-200 transition-colors flex items-center gap-2 w-fit">
                  Rekomendowani dealerzy <i className="fas fa-chevron-right text-xs"></i>
              </div>
          </button>

          {/* ETF Card */}
          <button onClick={() => setModalType('etf')} className={`${cardStyle} border-emerald-100 shadow-emerald-100/40 hover:border-emerald-300 hover:shadow-emerald-200/50`}>
              {/* Background Icon */}
              <i className="fas fa-chart-line absolute -bottom-5 -right-5 text-8xl md:text-9xl text-emerald-50 opacity-50 transition-transform duration-500"></i>

              <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">Złoto na Giełdzie (ETF)</h3>
              <p className="text-sm text-gray-600 mb-6 relative z-10 leading-relaxed">
                  Kupujesz instrument śledzący cenę złota. Nie potrzebujesz sejfu, spready są niższe, a płynność wyższa. Idealne, jeśli nie chcesz trzymać kruszcu w domu.
              </p>
              
              <div className="mt-auto relative z-10 bg-emerald-100 text-emerald-700 font-bold px-6 py-3 rounded-full group-hover:bg-emerald-200 transition-colors flex items-center gap-2 w-fit">
                  Najlepsze platformy <i className="fas fa-chevron-right text-xs"></i>
              </div>
          </button>
      </div>

      <ProvidersModal 
        isOpen={!!modalType} 
        type={modalType} 
        onClose={() => setModalType(null)} 
      />
    </div>
  );
};

export default ResultMetals;