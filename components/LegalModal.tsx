import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type LegalType = 'privacy' | 'terms' | 'contact' | null;

interface LegalModalProps {
  isOpen: boolean;
  type: LegalType;
  onClose: () => void;
}

// Ten sam GLOBALNY scroll lock (wspólny dla obu modali)
let scrollLockedCount = 0;
let prevOverflow = '';
let prevPaddingRight = '';

function lockBodyScrollOnce() {
  const body = document.body;
  const html = document.documentElement;

  scrollLockedCount += 1;
  if (scrollLockedCount > 1) return;

  prevOverflow = body.style.overflow;
  prevPaddingRight = body.style.paddingRight;

  const scrollbarWidth = window.innerWidth - html.clientWidth;

  body.style.overflow = 'hidden';

  if (scrollbarWidth > 0) {
    const computed = getComputedStyle(body).paddingRight;
    const currentPadding = parseFloat(computed || '0') || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
}

function unlockBodyScrollOnce() {
  const body = document.body;

  scrollLockedCount = Math.max(0, scrollLockedCount - 1);
  if (scrollLockedCount > 0) return;

  body.style.overflow = prevOverflow;
  body.style.paddingRight = prevPaddingRight;

  prevOverflow = '';
  prevPaddingRight = '';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeType, setActiveType] = useState<LegalType>(type);

  const hasLockedRef = useRef(false);

  useLayoutEffect(() => {
    if (isOpen && type) {
      setActiveType(type);
      setIsRendered(true);
      setIsClosing(false);

      if (!hasLockedRef.current) {
        lockBodyScrollOnce();
        hasLockedRef.current = true;
      }
      return;
    }

    if (!isOpen && isRendered) {
      setIsClosing(true);

      const timer = window.setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);

        if (hasLockedRef.current) {
          unlockBodyScrollOnce();
          hasLockedRef.current = false;
        }
      }, 350);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen, type, isRendered]);

  useLayoutEffect(() => {
    return () => {
      if (hasLockedRef.current) {
        unlockBodyScrollOnce();
        hasLockedRef.current = false;
      }
    };
  }, []);

  const handleResetCookies = () => {
    if (confirm("Czy na pewno chcesz zresetować ustawienia plików cookies? Strona zostanie odświeżona.")) {
      localStorage.removeItem('cookie_consent_level');
      window.location.reload();
    }
  };

  if (!isRendered || !activeType) return null;

  const email = "rodziceinwestuja@gmail.com";

  let title = "";
  let icon = "";
  let content: React.ReactNode = null;
  let headerColorClass = "";

  switch (activeType) {
    case 'terms':
      title = "Regulamin Serwisu";
      icon = "fa-file-contract";
      headerColorClass = "bg-blue-50 text-blue-600";
      content = (
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h4 className="font-bold text-primary text-base mb-2">1. Postanowienia ogólne</h4>
            <p>Niniejszy regulamin określa zasady korzystania z serwisu edukacyjnego Rodzice Inwestują. Właścicielem serwisu jest podmiot prywatny, a kontakt możliwy jest pod adresem: {email}.</p>
          </section>
          <section>
            <h4 className="font-bold text-primary text-base mb-2">2. Cel serwisu i Wyłączenie odpowiedzialności</h4>
            <p>Treści prezentowane w serwisie mają charakter wyłącznie <strong>edukacyjny i informacyjny</strong>. Nie stanowią one rekomendacji inwestycyjnych.</p>
            <p className="mt-2 bg-red-50 p-3 rounded-xl border border-red-100 text-red-800 font-medium">
              Autorzy serwisu nie ponoszą odpowiedzialności za decyzje inwestycyjne podjęte na podstawie prezentowanych treści.
            </p>
          </section>
          <section>
            <h4 className="font-bold text-primary text-base mb-2">3. Prawa autorskie</h4>
            <p>Wszelkie treści, kalkulatory, grafiki i układ serwisu są chronione prawem autorskim. Kopiowanie i rozpowszechnianie bez zgody autora jest zabronione.</p>
          </section>
          <section>
            <h4 className="font-bold text-primary text-base mb-2">4. Linki zewnętrzne</h4>
            <p>Serwis zawiera linki do stron podmiotów trzecich. Nie mamy wpływu na treści tam zawarte ani na zmiany w ofertach tych instytucji.</p>
          </section>
        </div>
      );
      break;

    case 'privacy':
      title = "Polityka Prywatności";
      icon = "fa-user-shield";
      headerColorClass = "bg-emerald-50 text-emerald-600";
      content = (
        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h4 className="font-bold text-primary text-base mb-2">1. Administrator Danych</h4>
            <p>Szanujemy Twoją prywatność. Serwis nie wymaga zakładania konta ani podawania danych osobowych do korzystania z treści edukacyjnych i kalkulatorów.</p>
          </section>

          <section>
            <h4 className="font-bold text-primary text-base mb-2">2. Pliki Cookies (Ciasteczka)</h4>
            <p className="mb-4">Serwis wykorzystuje pliki cookies.</p>

            <button
              onClick={handleResetCookies}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors border border-gray-200 text-xs"
            >
              <i className="fas fa-cookie-bite"></i> Zresetuj ustawienia cookies dla tej strony
            </button>
          </section>

          <section>
            <h4 className="font-bold text-primary text-base mb-2">3. Kontakt</h4>
            <p>W przypadku pytań dotyczących prywatności, prosimy o kontakt pod adresem: {email}.</p>
          </section>
        </div>
      );
      break;

    case 'contact':
      title = "Kontakt z nami";
      icon = "fa-envelope";
      headerColorClass = "bg-accent/10 text-accent";
      content = (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Masz pytania? Napisz do nas!</p>
          <div className="bg-gray-50 py-3 px-4 rounded-xl border border-gray-200 text-primary font-bold select-all mb-6 break-all max-w-sm mx-auto">
            {email}
          </div>
          <a
            href={`mailto:${email}`}
            className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Napisz teraz <i className="fas fa-paper-plane ml-2"></i>
          </a>
        </div>
      );
      break;
  }

  const backdropAnimation = isClosing ? 'animate-fade-out' : 'animate-fade-in';
  const modalAnimation = isClosing
    ? 'animate-slide-down md:animate-fade-out'
    : 'animate-slide-up md:animate-fade-in';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-center items-end md:items-center pointer-events-none" role="dialog" aria-modal="true">
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto ${backdropAnimation}`}
        onClick={onClose}
      />

      <div
        className={`
          bg-white w-full relative z-10 pointer-events-auto
          rounded-t-[32px] md:rounded-[32px]
          max-h-[90vh] md:max-h-[85vh]
          flex flex-col
          md:max-w-xl
          shadow-2xl
          ${modalAnimation}
        `}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0 rounded-t-[32px] bg-white">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${headerColorClass}`}>
              <i className={`fas ${icon} text-xl`}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary leading-tight">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary flex items-center justify-center transition-all shrink-0"
            aria-label="Zamknij"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 md:p-8 bg-white overflow-y-auto flex-1 overscroll-contain">
          {content}
          <div className="h-8 md:h-0"></div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center shrink-0 md:rounded-b-[32px]">
          <button onClick={onClose} className="text-gray-500 hover:text-primary text-sm font-semibold transition py-2 px-4">
            Zamknij okno
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LegalModal;
