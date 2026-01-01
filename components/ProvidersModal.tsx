import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BrokerList from './wizard/BrokerList';
import { BROKERS, METAL_DEALERS, BOND_PLATFORMS_FAMILY, BOND_PLATFORMS_STANDARD } from '../constants';

export type ProviderType = 'bonds-family' | 'bonds-standard' | 'etf' | 'metals' | 'metals-physical' | null;

interface ProvidersModalProps {
  isOpen: boolean;
  type: ProviderType;
  onClose: () => void;
}

const ProvidersModal: React.FC<ProvidersModalProps> = ({ isOpen, type, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeType, setActiveType] = useState<ProviderType>(type);

  useEffect(() => {
    if (isOpen && type) {
      setActiveType(type);
      setIsRendered(true);
      setIsClosing(false);
      
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
    } else if (!isOpen && isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 350); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, isRendered]);

  if (!isRendered || !activeType) return null;

  let title = "";
  let description = "";
  let list: typeof BROKERS = [];
  let variant: 'green' | 'blue' | 'gold' = 'green';
  let icon = "";

  switch (activeType) {
    case 'bonds-family':
      title = "Gdzie kupić Obligacje Rodzinne?";
      description = "Obligacje rodzinne (ROS, ROD) przeznaczone dla beneficjentów 800+ są dostępne wyłącznie w Grupie PKO Banku Polskiego.";
      list = BOND_PLATFORMS_FAMILY;
      variant = 'blue';
      icon = "fa-baby-carriage";
      break;
    case 'bonds-standard':
      title = "Gdzie kupić Obligacje Skarbowe?";
      description = "Standardowe obligacje oszczędnościowe (m.in. COI, EDO) możesz kupić bezpiecznie w dwóch państwowych bankach.";
      list = BOND_PLATFORMS_STANDARD;
      variant = 'blue';
      icon = "fa-shield-alt";
      break;
    case 'etf':
      title = "Konta Maklerskie i Fundusze indeksowe";
      description = "Aby kupić akcje czy ETFy potrzebujesz konta maklerskiego. Alternatywnym rozwiązaniem są fundusze indeksowe. Oto sprawdzone instytucje z niskimi opłatami.";
      list = BROKERS;
      variant = 'green';
      icon = "fa-chart-line";
      break;
    case 'metals':
    case 'metals-physical':
      title = "Dealerzy Metali Szlachetnych";
      description = "Rekomendowani dealerzy, u których bezpiecznie kupisz fizyczne złoto i srebro z dostawą lub odbiorem osobistym.";
      list = METAL_DEALERS;
      variant = 'gold';
      icon = "fa-coins";
      break;
  }

  const backdropAnimation = isClosing ? 'animate-fade-out' : 'animate-fade-in';
  const modalAnimation = isClosing 
    ? 'animate-slide-down md:animate-fade-out' 
    : 'animate-slide-up md:animate-fade-in';

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex justify-center items-end md:items-center pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto ${backdropAnimation}`} 
        onClick={onClose}
      ></div>

      <div 
        className={`
          bg-white w-full relative z-10 pointer-events-auto
          rounded-t-[32px] md:rounded-[32px]
          max-h-[90vh] md:max-h-[85vh]
          flex flex-col
          md:max-w-2xl
          shadow-2xl
          ${modalAnimation}
        `}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0 rounded-t-[32px]">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                 variant === 'blue' ? 'bg-blue-100 text-blue-600' :
                 variant === 'gold' ? 'bg-amber-100 text-amber-600' :
                 'bg-emerald-100 text-emerald-600'
             }`}>
                <i className={`fas ${icon} text-xl`}></i>
             </div>
             <div>
                <h3 id="modal-title" className="text-xl font-bold text-primary leading-tight">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">Sprawdzeni dostawcy</p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Zamknij"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary flex items-center justify-center transition-all shrink-0"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 md:p-8 bg-white overflow-y-auto flex-1 overscroll-contain">
            <p className="text-gray-600 mb-8 leading-relaxed text-center max-w-lg mx-auto">
                {description}
            </p>
            
            <BrokerList 
                list={list} 
                title="Wybierz dostawcę" 
                isHighlight={false} 
                variant={variant}
                actionLabel="Przejdź do serwisu"
            />
            <div className="h-8 md:h-0"></div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center shrink-0 md:rounded-b-[32px]">
            <button onClick={onClose} className="text-gray-500 hover:text-primary text-sm font-semibold transition py-2 px-4">
                Zamknij listę
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProvidersModal;
