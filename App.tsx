import React, { useState } from 'react';
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

  const BLOG_URL = "https://rodziceinwestuja.substack.com/";

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const scrollToId = (id: string) => {
    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const openLegal = (type: LegalType) => {
      setLegalModalType(type);
      setIsMenuOpen(false);
  };

  if (currentPage === 'wizard') {
    return <InvestmentWizard key="wizard-mode" onBack={() => navigateTo('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-accent selection:text-white">
      
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 fixed w-full z-[100] top-0 transition-all shadow-sm">
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
            <header id="hero" className="hero-pattern text-white pt-20 pb-16 lg:pt-28 lg:pb-24 relative overflow-hidden scroll-mt-20">
                <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="font-display font-bold text-4xl lg:text-6xl leading-tight mb-6">
                            Podaruj dziecku łatwiejszy start w dorosłość.
                        </h1>
                        <p className="text-lg text-gray-200 mb-10 leading-relaxed">
                            Nie musisz być bogaty, by zbudować dziecku kapitał na start. Dowiedz się, jak zamienić <span className="text-accent font-bold">małe kwoty</span> (nawet z 800+) na duże rezultaty, pokonując <span className="tooltip-term text-accent font-bold" data-tip="Wzrost cen towarów i usług.">inflację</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap w-full sm:w-auto">
                            <button onClick={() => navigateTo('wizard')} className="group relative overflow-hidden inline-flex items-center justify-center bg-accent hover:bg-green-500 text-white font-display font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out text-lg w-full sm:w-auto">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]"></div>
                                <span className="relative z-10">Wybierz swoją drogę</span>
                            </button>
                            <button onClick={() => scrollToId('problem')} className="inline-flex items-center justify-center bg-primary border-2 border-white hover:bg-white hover:text-primary text-white font-display font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out gap-2 w-full sm:w-auto">
                                Sprawdź kroki <i className="fas fa-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2 flex justify-center">
                        <div className="relative w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <i className="fas fa-rocket text-9xl text-accent drop-shadow-2xl"></i>
                            <div className="absolute -top-4 -right-4 bg-white text-primary p-4 rounded-xl shadow-xl flex items-center gap-3 animate-pulse-subtle">
                                <i className="fas fa-chart-line text-2xl text-accent"></i>
                                <div className="text-sm font-bold leading-tight">Wielkie<br />rezultaty</div>
                            </div>
                            <div className="absolute bottom-8 -left-8 bg-white text-primary p-4 rounded-xl shadow-xl flex items-center gap-3 animate-pulse-subtle" style={{ animationDelay: '1.5s' }}>
                                <i className="fas fa-coins text-2xl text-yellow-500"></i>
                                <div className="text-sm font-bold leading-tight">Małe<br />kwoty</div>
                            </div>
                        </div>
                    </div>
                </div>
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

            <div id="calculator" className="relative scroll-mt-20 pt-16 pb-6 bg-bgLight border-b border-gray-100">
               <StepBadge step={2} label="Liczby" />
               <Calculator />
            </div>

            <section id="blog-section" className="relative py-16 bg-white overflow-visible scroll-mt-20 border-b border-gray-50">
                <StepBadge step={3} label="Wiedza" />
                <div className="container mx-auto px-6">
                    <div className="bg-primary/5 rounded-[40px] p-8 md:p-14 flex flex-col lg:flex-row items-center gap-12 border border-primary/10 mt-4">
                        <div className="lg:w-2/3 text-center lg:text-left">
                            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mb-6">Czytaj Bloga na platformie Substack</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">Komentarze giełdowe i edukacja finansowa w polskich realiach. Dowiedz się, jak mądrze budować kapitał dla swojej rodziny.</p>
                            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-out">
                                <i className="fas fa-newspaper"></i> Odwiedź Bloga
                            </a>
                        </div>
                        <div className="lg:w-1/3 flex justify-center">
                            <div className="relative group cursor-pointer" onClick={() => window.open(BLOG_URL, '_blank')}>
                                <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl group-hover:bg-accent/30 transition-all"></div>
                                <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <i className="fas fa-bookmark text-accent"></i>
                                        <span className="text-xs font-bold text-gray-400 uppercase">Najnowszy wpis</span>
                                    </div>
                                    <h4 className="font-bold text-primary mb-2 leading-snug">Jak dbać o finanse Twojego dziecka?</h4>
                                    <div className="w-12 h-1 bg-accent/20 mb-4"></div>
                                    <p className="text-xs text-gray-500 leading-relaxed italic">Poznaj proste sposoby na zabezpieczenie kapitału...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="steps-section" className="relative bg-bgLight pt-16 pb-28 border-t border-gray-100 scroll-mt-20">
                <StepBadge step={4} label="Plan" />
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mt-4 mb-4">Wykonaj pierwsze kroki</h2>
                    <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Masz już świadomość i wiedzę. Czas na konkretny plan działania dostosowany do Twojej sytuacji.</p>
                    <button onClick={() => setIsStepsModalOpen(true)} className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-primary hover:bg-opacity-90 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl shadow-primary/30 hover:shadow-2xl transition-all duration-300 ease-out w-full sm:w-auto">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            <i className="fas fa-map-signs"></i> Zobacz plan krok po kroku
                        </span>
                    </button>
                </div>
            </section>

            <section id="guide" className="bg-primary pt-20 pb-16 text-white text-center relative overflow-visible scroll-mt-20">
                <StepBadge step={5} label="Działanie" />
                <i className="fas fa-question absolute top-10 left-10 text-white opacity-5 text-9xl pointer-events-none"></i>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="font-display font-bold text-3xl md:text-5xl mt-6 mb-4">Nie wiesz co wybrać?</h2>
                    <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg leading-relaxed">Skorzystaj z inteligentnego kreatora, który pomoże Ci dobrać strategię inwestycyjną.</p>
                    <button onClick={() => navigateTo('wizard')} className="group relative overflow-hidden bg-accent hover:bg-green-500 text-white font-bold py-5 px-12 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 ease-out flex items-center justify-center mx-auto gap-3 w-full sm:w-auto">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]"></div>
                      <i className="fas fa-magic"></i> Uruchom Kreator Inwestycji
                    </button>
                </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto">
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