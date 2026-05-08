import React, { useState } from 'react';
import BondSimulator from '../BondSimulator';
import ProvidersModal, { ProviderType } from '../../ProvidersModal';
import SimulatorTrigger from './SimulatorTrigger';
import { BOND_DATA, SHOW_PROVIDER_LISTS, STANDARD_BOND_SELECTION_NOTE } from '../../../constants';

const ResultStandardBonds: React.FC = () => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [modalType, setModalType] = useState<ProviderType>(null);

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShowSimulator = () => {
    setShowSimulator(true);
    setTimeout(() => scrollToElement('simulator-section'), 100);
  };

  const openProviderModal = () => {
    setModalType('bonds-standard');
  };

  const cardStyle =
    'w-full text-left bg-white p-6 rounded-3xl border border-blue-100 shadow-lg shadow-blue-100/40 relative overflow-hidden';

  return (
    <div className="animate-fade-in max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Obligacje Skarbowe</h2>
      <p className="text-lg text-gray-500 mb-8">Bezpieczny sposób na ochronę kapitału dla każdego, niezależnie od 800+.</p>

      <div className="mb-12 max-w-2xl mx-auto">
        <h4 className="font-bold text-primary text-lg mb-2">
          Co to jest <span className="tooltip-term tooltip-term--current cursor-help" data-tip="Dodatkowy, stały zysk ponad inflację. Sprawdź aktualną wysokość na obligacjeskarbowe.pl">marża</span> i dlaczego jest tak ważna?
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          Oprocentowanie tych obligacji w kolejnych latach to suma: <strong>inflacja + marża</strong>.
          <span className="text-blue-600 font-bold"> Marża to Twój gwarantowany, realny zysk</span>.
          To jedyny mechanizm dający pewność, że zarobisz na czysto, niezależnie od wysokości inflacji.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
        <div className={cardStyle}>
          <i className="fas fa-piggy-bank absolute -bottom-5 -right-5 text-8xl text-blue-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-3 py-1 text-xs font-bold rounded-bl-xl uppercase">4 lata</div>
          <h3 className="text-xl font-bold text-primary mb-2 relative z-10">Obligacje COI</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4 relative z-10">
            <p className="flex justify-between"><span>Pierwszy rok:</span> <span className="font-bold text-blue-600">{BOND_DATA.COI.firstYear.toFixed(2)}%</span></p>
            <p className="flex justify-between"><span>Kolejne lata:</span> <span className="font-bold text-blue-600">inflacja + marża ({BOND_DATA.COI.margin.toFixed(2)}%)</span></p>
          </div>

          <a href={BOND_DATA.COI.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mb-2 inline-flex items-center gap-1 relative z-20 transition-colors">
            <i className="fas fa-info-circle"></i> Szczegóły oferty
          </a>

          <p className="text-xs text-gray-400 relative z-10">Wypłata odsetek co roku (nie powiększają kapitału automatycznie).</p>
        </div>

        <div className={cardStyle}>
          <i className="fas fa-hourglass-half absolute -bottom-5 -right-5 text-8xl text-blue-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-3 py-1 text-xs font-bold rounded-bl-xl uppercase">Emerytalne (10 lat)</div>
          <h3 className="text-xl font-bold text-primary mb-2 relative z-10">Obligacje EDO</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4 relative z-10">
            <p className="flex justify-between"><span>Pierwszy rok:</span> <span className="font-bold text-blue-600">{BOND_DATA.EDO.firstYear.toFixed(2)}%</span></p>
            <p className="flex justify-between"><span>Kolejne lata:</span> <span className="font-bold text-blue-600">inflacja + marża ({BOND_DATA.EDO.margin.toFixed(2)}%)</span></p>
          </div>

          <a href={BOND_DATA.EDO.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mb-2 inline-flex items-center gap-1 relative z-20 transition-colors">
            <i className="fas fa-info-circle"></i> Szczegóły oferty
          </a>

          <p className="text-xs text-gray-400 relative z-10">Pełna kapitalizacja odsetek. Procent składany działa najmocniej.</p>
        </div>
      </div>

      <div className="mb-12 p-6 bg-blue-50/70 rounded-3xl border border-blue-100 text-sm text-blue-900 flex items-start gap-4 text-left">
        <i className="fas fa-info-circle mt-1"></i>
        <p>{STANDARD_BOND_SELECTION_NOTE}</p>
      </div>

      {!showSimulator ? (
        <SimulatorTrigger onClick={handleShowSimulator} />
      ) : (
        <div id="simulator-section" className="scroll-mt-24">
          <BondSimulator
            defaultMargin={BOND_DATA.EDO.margin}
            defaultFirstYear={BOND_DATA.EDO.firstYear}
            title="Symulator obligacji EDO"
            onScrollToPurchase={SHOW_PROVIDER_LISTS ? openProviderModal : undefined}
            variant="blue"
          />
        </div>
      )}

      {SHOW_PROVIDER_LISTS && (
        <ProvidersModal isOpen={!!modalType} type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default ResultStandardBonds;
