import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Sprawdź czy poziom zgody został już ustawiony
    const consentLevel = localStorage.getItem('cookie_consent_level');
    
    // Jeśli nie ma żadnej decyzji, pokaż baner
    if (!consentLevel) {
       const timer = setTimeout(() => {
         setIsMounted(true);
         requestAnimationFrame(() => setIsVisible(true));
       }, 1500);
       return () => clearTimeout(timer);
    }
  }, []);

  const handleDecision = (level: 'all' | 'necessary') => {
    localStorage.setItem('cookie_consent_level', level);
    
    // Tutaj w przyszłości można dodać kod inicjalizujący np. Google Analytics
    // if (level === 'all') { initAnalytics(); }

    setIsVisible(false);
    setTimeout(() => setIsMounted(false), 400);
  };

  if (!isMounted) return null;

  return (
    <div 
        className={`fixed bottom-0 left-0 right-0 z-[90] p-4 md:p-6 pointer-events-none transition-all duration-500 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
    >
      <div className="container mx-auto max-w-5xl pointer-events-auto">
         <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 justify-between relative overflow-hidden">
            
            {/* Dekoracyjny pasek na górze */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>

            <div className="flex items-start gap-4 md:gap-5">
               <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-1 lg:mt-0">
                  <i className="fas fa-cookie-bite text-xl"></i>
               </div>
               <div className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  <p className="mb-1">
                    <strong>Szanujemy Twój wybór.</strong> Używamy plików cookies, aby zapewnić poprawne działanie strony (niezbędne) oraz – za Twoją zgodą – do analizy ruchu, co pomaga nam rozwijać treści edukacyjne.
                  </p>
                  <button
                      onClick={onOpenPrivacy}
                      className="text-primary font-bold hover:text-accent transition-colors text-xs inline-flex items-center gap-1 py-1"
                    >
                      Pełna polityka prywatności <i className="fas fa-chevron-right text-[10px]"></i>
                    </button>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => handleDecision('necessary')}
                  className="px-6 py-3 rounded-full font-bold text-gray-500 hover:text-primary hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-sm w-full sm:w-auto whitespace-nowrap"
                >
                  Tylko niezbędne
                </button>
                <button
                  onClick={() => handleDecision('all')}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95 text-sm w-full sm:w-auto whitespace-nowrap"
                >
                  Akceptuję wszystko
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CookieConsent;