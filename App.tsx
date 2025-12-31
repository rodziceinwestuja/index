import React, { useEffect, useState } from 'react';
import { Page } from './types';
import Calculator from './components/Calculator';
import ComparisonChart from './components/ComparisonChart';
import StepsModal from './components/StepsModal';
import InvestmentWizard from './components/InvestmentWizard';
import LegalModal, { LegalType } from './components/LegalModal';
import StepBadge from './components/StepBadge';
import CookieConsent from './components/CookieConsent';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);

  // Unified state for legal documents and contact
  const [legalModalType, setLegalModalType] = useState<LegalType>(null);

  // Stabilne przewijanie do sekcji po przejściu na home
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const BLOG_URL = "https://rodziceinwestuja.substack.com/";

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);

    // scroll do góry tylko przy normalnej nawigacji
    // (przy scrollToId przewijamy docelowo do sekcji)
    window.scrollTo(0, 0);
  };

  const scrollToId = (id: string) => {
    setIsMenuOpen(false);

    if (currentPage !== 'home') {
      setPendingScrollId(id);
      setCurrentPage('home');
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // wykonaj przewinięcie dopiero, gdy home się wyrenderuje
  useEffect(() => {
    if (currentPage !== 'home') return;
    if (!pendingScrollId) return;

    const el = document.getElementById(pendingScrollId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });

    setPendingScrollId(null);
  }, [currentPage, pendingScrollId]);

  const openLegal = (type: LegalType) => {
    setLegalModalType(type);
    setIsMenuOpen(false);
  };

  if (currentPage === 'wizard') {
    return <InvestmentWizard key="wizard-mode" onBack={() => navigateTo('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-accent selection:text-white overflow-x-hidden">
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 fixed w-full z-[50] top-0 transition-all shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center gap-2 text-primary font-display font-bold text-xl cursor-pointer"
              onClick={() => navigateTo('home')}
            >
              <i className="fas fa-seedling text-accent text-2xl"></i>
              <span>Rodzice<span className="text-accent">Inwestują</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setIsStepsModalOpen(true)} className="text-gray-600 hover:text-primary font-semibold transition">Jak zacząć?</button>
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary font-semibold transition">Blog</a>
              <button onClick={() => scrollToId('calculator')} className="text-gray-600 hover:text-primary font-semibold transition">Kalkulator</button>
              <button
                onClick={() => navigateTo('wizard')}
                className="px-6 py-2 border-2 border-accent text-accent font-bold rounded-full hover:bg-accent hover:text-white transition duration-300"
              >
                <i className="fas fa-magic mr-2"></i> Kreator Inwestycji
              </button>
            </div>

            <button
              className="md:hidden text-primary text-2xl focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Otwórz menu"
            >
              <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-4 py-4 border-t border-gray-100">
              <button onClick={() => { setIsStepsModalOpen(true); setIsMenuOpen(false); }} className="text-left text-gray-600 hover:text-primary font-semibold flex items-center gap-3 py-2">
                <i className="fas fa-map-signs text-accent w-6 text-center"></i> Jak zacząć?
              </button>
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="text-left text-gray-600 hover:text-primary font-semibold flex items-center gap-3 py-2">
                <i className="fas fa-newspaper text-accent w-6 text-center"></i> Blog
              </a>
              <button onClick={() => scrollToId('calculator')} className="text-left text-gray-600 hover:text-primary font-semibold flex items-center gap-3 py-2">
                <i className="fas fa-calculator text-accent w-6 text-center"></i> Kalkulator
              </button>
              <button onClick={() => navigateTo('wizard')} className="text-left font-bold text-accent flex items-center gap-3 py-2">
                <i className="fas fa-magic text-accent w-6 text-center"></i> Kreator Inwestycji
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {currentPage === 'home' && (
          <div className="animate-fade-in">
            {/* …reszta bez zmian… */}

            <header id="hero" className="hero-pattern text-white pt-16 pb-20 lg:pt-32 lg:pb-32 relative overflow-hidden scroll-mt-20">
              {/* tu zostawiasz dokładnie swój kod */}
              {/* --- */}
            </header>

            <section id="problem" className="relative pt-16 pb-12 bg-white scroll-mt-20 border-b border-gray-50">
              <StepBadge step={1} label="Świadomość" />
              <div className="container mx-auto px-6 text-center max-w-5xl">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mt-4 mb-6">Dlaczego "skarbonka" to za mało?</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                  Większość rodziców trzyma pieniądze na koncie 0%. Przez <span className="tooltip-term font-bold text-red-500" data-tip="To 'cichy zabójca' oszczędności. Jeśli inflacja wynosi 5%, to Twoje 100 zł po roku jest warte realnie tylko 95 zł.">inflację</span>, 10 000 zł odłożone dziś, za 18 lat będzie warte o połowę mniej.
                </p>
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-10">
                  <h3 className="text-xl font-bold text-primary mb-6 text-center">Wizualizacja: Skarpeta vs. Inwestycja vs. Inflacja</h3>
                  <ComparisonChart />
                  <p className="text-sm text-gray-500 mt-6 text-center">*Symulacja dla 800 zł/mc przez 18 lat. Inwestycja 7% rocznie, Inflacja 2.5% rocznie.</p>
                </div>
              </div>
            </section>

            <div id="calculator" className="relative scroll-mt-20 pt-16 pb-0 bg-bgLight border-b border-gray-100">
              <StepBadge step={2} label="Liczby" />
              <Calculator />
            </div>

            {/* reszta Twojego home bez zmian */}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
              <i className="fas fa-seedling text-accent"></i>
              <span>Rodzice<span className="text-accent">Inwestują</span></span>
            </div>
            <div className="flex gap-6 items-center flex-wrap justify-center">
              <button onClick={() => openLegal('terms')} className="hover:text-white transition">Regulamin</button>
              <button onClick={() => openLegal('privacy')} className="hover:text-white transition">Prywatność</button>
              <button onClick={() => openLegal('contact')} className="hover:text-white transition">Kontakt</button>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-facebook hover:text-white transition" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white transition" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-600 max-w-2xl mx-auto border-t border-gray-800 pt-8 leading-relaxed">
            &copy; {new Date().getFullYear()} RodziceInwestują.pl. Treści edukacyjne, nie stanowią porady inwestycyjnej. Inwestowanie wiąże się z ryzykiem utraty kapitału.
          </div>
        </div>
      </footer>

      <StepsModal isOpen={isStepsModalOpen} onClose={() => setIsStepsModalOpen(false)} onOpenWizard={() => navigateTo('wizard')} />
      <LegalModal isOpen={!!legalModalType} type={legalModalType} onClose={() => setLegalModalType(null)} />
      <CookieConsent onOpenPrivacy={() => openLegal('privacy')} />
    </div>
  );
};

export default App;
