import React, { useState } from 'react';
import ProvidersModal, { ProviderType } from '../../ProvidersModal';
import { PROVIDER_SELECTION_DETAILS, SHOW_PROVIDER_LISTS } from '../../../constants';

const ResultMetals: React.FC = () => {
  const [modalType, setModalType] = useState<ProviderType>(null);

  const cardStyle =
    'w-full bg-white p-6 md:p-8 rounded-[32px] border shadow-lg flex flex-col items-center text-center relative overflow-hidden';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Złoto i Srebro</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          To doskonałe zabezpieczenie majątku. Możesz w nie inwestować na dwa sposoby, w zależności od tego, co bardziej do Ciebie pasuje.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className={`${cardStyle} border-amber-100 shadow-amber-100/40`}>
          <i className="fas fa-coins absolute -bottom-5 -right-5 text-8xl md:text-9xl text-amber-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
          <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">Złoto Fizyczne</h3>
          <p className="text-sm text-gray-600 relative z-10 leading-relaxed">
            Kupujesz prawdziwe monety lub sztabki. Masz je w ręku. To daje pełną niezależność od banków, ale wymaga bezpiecznego przechowywania.
          </p>
        </div>

        <div className={`${cardStyle} border-emerald-100 shadow-emerald-100/40`}>
          <i className="fas fa-chart-line absolute -bottom-5 -right-5 text-8xl md:text-9xl text-emerald-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
          <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">Złoto na Giełdzie (ETF)</h3>
          <p className="text-sm text-gray-600 relative z-10 leading-relaxed">
            Kupujesz instrument śledzący cenę złota. Nie potrzebujesz sejfu, spready są niższe, a płynność wyższa.
          </p>
        </div>
      </div>

      <div className="p-6 bg-amber-50/70 rounded-3xl border border-amber-100 text-sm text-amber-900 flex items-start gap-4 text-left">
        <i className="fas fa-info-circle mt-1"></i>
        <p>{PROVIDER_SELECTION_DETAILS}</p>
      </div>

      {SHOW_PROVIDER_LISTS && (
        <ProvidersModal isOpen={!!modalType} type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default ResultMetals;
