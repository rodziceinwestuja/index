import React, { useState } from 'react';
import BondSimulator from '../BondSimulator';
import ProvidersModal, { ProviderType } from '../../ProvidersModal';
import SimulatorTrigger from './SimulatorTrigger';
import { BOND_DATA, FAMILY_BOND_SELECTION_NOTE, SHOW_PROVIDER_LISTS } from '../../../constants';

const ResultFamilyBonds: React.FC = () => {
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
    setModalType('bonds-family');
  };

  const cardStyle =
    'w-full text-left bg-white p-6 rounded-3xl border border-blue-100 shadow-lg shadow-blue-100/40 relative overflow-hidden';

  return (
    <div className="animate-fade-in max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Obligacje Rodzinne (800+)</h2>
      <p className="text-lg text-gray-500 mb-8">Dostępne tylko dla beneficjentów programu 800+. To najlepszy produkt oszczędnościowy na rynku.</p>

      <div className="mb-12 max-w-2xl mx-auto">
        <h4 className="font-bold text-primary text-lg mb-2">
          Co to jest <span className="tooltip-term tooltip-term--current cursor-help" data-tip="Dodatkowy, stały zysk ponad inflację. Sprawdź aktualną wysokość na obligacjeskarbowe.pl">marża</span> i dlaczego jest tak ważna?
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          Oprocentowanie Obligacji Rodzinnych w kolejnych latach to suma inflacji i marży
          (marża jest wyższa niż dla standardowych obligacji). <span className="text-blue-600 font-bold">Marża to Twój gwarantowany, realny zysk nad inflacją w długim terminie.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
        <div className={cardStyle}>
          <i className="fas fa-baby absolute -bottom-5 -right-5 text-8xl text-blue-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-3 py-1 text-xs font-bold rounded-bl-xl uppercase">6 lat</div>
          <h3 className="text-xl font-bold text-primary mb-2 relative z-10">Obligacje ROS</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4 relative z-10">
            <p className="flex justify-between"><span>Pierwszy rok:</span> <span className="font-bold text-blue-600">{BOND_DATA.ROS.firstYear.toFixed(2)}%</span></p>
            <p className="flex justify-between"><span>Kolejne lata:</span> <span className="font-bold text-blue-600">inflacja + marża ({BOND_DATA.ROS.margin.toFixed(2)}%)</span></p>
          </div>

          <a href={BOND_DATA.ROS.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mb-2 inline-flex items-center gap-1 relative z-20 transition-colors">
            <i className="fas fa-info-circle"></i> Szczegóły oferty
          </a>

          <p className="text-xs text-gray-400 relative z-10">Kapitalizacja roczna. Idealne na krótszy horyzont.</p>
        </div>

        <div className={cardStyle}>
          <i className="fas fa-graduation-cap absolute -bottom-5 -right-5 text-8xl text-blue-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-3 py-1 text-xs font-bold rounded-bl-xl uppercase">12 lat</div>
          <h3 className="text-xl font-bold text-primary mb-2 relative z-10">Obligacje ROD</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4 relative z-10">
            <p className="flex justify-between"><span>Pierwszy rok:</span> <span className="font-bold text-blue-600">{BOND_DATA.ROD.firstYear.toFixed(2)}%</span></p>
            <p className="flex justify-between"><span>Kolejne lata:</span> <span className="font-bold text-blue-600">inflacja + marża ({BOND_DATA.ROD.margin.toFixed(2)}%)</span></p>
          </div>

          <a href={BOND_DATA.ROD.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 mb-2 inline-flex items-center gap-1 relative z-20 transition-colors">
            <i className="fas fa-info-circle"></i> Szczegóły oferty
          </a>

          <p className="text-xs text-gray-400 relative z-10">Kapitalizacja roczna. Najwyższy zysk na start w dorosłość.</p>
        </div>
      </div>

      <div className="mb-12 p-6 bg-blue-50/70 rounded-3xl border border-blue-100 text-sm text-blue-900 flex items-start gap-4 text-left">
        <i className="fas fa-info-circle mt-1"></i>
        <p>{FAMILY_BOND_SELECTION_NOTE}</p>
      </div>

      {!showSimulator ? (
        <SimulatorTrigger onClick={handleShowSimulator} />
      ) : (
        <div id="simulator-section" className="scroll-mt-24">
          <BondSimulator
            defaultMargin={BOND_DATA.ROD.margin}
            defaultFirstYear={BOND_DATA.ROD.firstYear}
            title="Symulator obligacji rodzinnych"
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

export default ResultFamilyBonds;
