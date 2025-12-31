import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BrokerList from './wizard/BrokerList';
import { BROKERS, METAL_DEALERS, BOND_PLATFORMS } from '../constants';

export type ProviderType = 'bonds' | 'etf' | 'metals' | 'metals-physical' | null;

interface ProvidersModalProps {
  isOpen: boolean;
  type: ProviderType;
  onClose: () => void;
}

/**
 * Scroll lock bez "trzęsienia" (useLayoutEffect) + z kompensacją szerokości scrollbara.
 * Dodatkowo: licznik blokady (działa poprawnie, nawet jeśli w przyszłości otworzysz 2 modale).
 */
const LOCK_COUNT_ATTR = 'data-scroll-lock-count';
const PREV_OVERFLOW_ATTR = 'data-prev-overflow';
const PREV_PADDING_RIGHT_ATTR = 'data-prev-padding-right';

function lockBodyScroll() {
  const body = document.body;
  const html = document.documentElement;

  const currentCount = parseInt(body.getAttribute(LOCK_COUNT_ATTR) || '0', 10);

  // Jeśli to pierwsza blokada — zapamiętaj poprzednie inline style
  if (currentCount === 0) {
    body.setAttribute(PREV_OVERFLOW_ATTR, body.style.overflow || '');
    body.setAttribute(PREV_PADDING_RIGHT_ATTR, body.style.paddingRight || '');

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    body.style.overflow = 'hidden';

    // dodaj kompensację do aktualnego padding-right (computed), żeby layout nie "skakał"
    if (scrollbarWidth > 0) {
      const computed = getComputedStyle(body).paddingRight;
      const currentPadding = parseFloat(computed || '0') || 0;
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  body.setAttribute(LOCK_COUNT_ATTR, String(currentCount + 1));
}

function unlockBodyScroll() {
  const body = document.body;
  const currentCount = parseInt(body.getAttribute(LOCK_COUNT_ATTR) || '0', 10);

  if (currentCount <= 1) {
    // Ostatni unlock — przywróć poprzednie style
    const prevOverflow = body.getAttribute(PREV_OVERFLOW_ATTR) ?? '';
    const prevPaddingRight = body.getAttribute(PREV_PADDING_RIGHT_ATTR) ?? '';

    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPaddingRight;

    body.removeAttribute(LOCK_COUNT_ATTR);
    body.removeAttribute(PREV_OVERFLOW_ATTR);
    body.removeAttribute(PREV_PADDING_RIGHT_ATTR);
  } else {
    body.setAttribute(LOCK_COUNT_ATTR, String(currentCount - 1));
  }
}

const ProvidersModal: React.FC<ProvidersModalProps> = ({ isOpen, type, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeType, setActiveType] = useState<ProviderType>(type);

  useLayoutEffect(() => {
    if (isOpen && type) {
      setActiveType(type);
      setIsRendered(true);
      setIsClosing(false);

      lockBodyScroll();
      return;
    }

    if (!isOpen && isRendered) {
      setIsClosing(true);
      const timer = window.setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
        unlockBodyScroll();
      }, 350);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen, type, isRendered]);

  // awaryjne sprzątanie (np. hot reload / unmount)
  useLayoutEffect(() => {
    return () => {
      // jeśli modal był otwarty i komponent znika, upewnij się, że odblokujesz
      if (isRendered) unlockBodyScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isRendered || !activeType) return null;

  let title = "";
  let description = "";
  let list: typeof BROKERS = [];
  let variant: 'green' | 'blue' | 'gold' = 'green';
  let icon = "";

  switch (activeType) {
    case 'bonds':
      title = "Gdzie kupić Obligacje?";
      description = "Obligacje Skarbowe kupisz bezpiecznie tylko w oficjalnych punktach sprzedaży.";
      list = BOND_PLATFORMS;
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
