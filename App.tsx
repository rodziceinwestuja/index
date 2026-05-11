import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Page } from './types';
import Calculator from './components/Calculator';
import ComparisonChart from './components/ComparisonChart';
import InvestmentWizard from './components/InvestmentWizard';
import { LegalType } from './components/LegalModal';
import CookieConsent from './components/CookieConsent';
import ParentsGuide from './components/ParentsGuide';
import StepBadge from './components/StepBadge';
import {
  HASH_NAVIGATION_DELAY,
  NAV_OFFSET,
  PAGE_TRANSITION_DELAY,
  SCROLL_SPY_OFFSET,
} from './lib/scrollConstants';

const StepsModal = lazy(() => import('./components/StepsModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));
const ContactModal = lazy(() => import('./components/ContactModal'));

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);

  const [legalModalType, setLegalModalType] = useState<LegalType>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  // Bumped each time the user resets cookies — forces <CookieConsent /> to remount.
  const [cookieVersion, setCookieVersion] = useState(0);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const pendingScrollTimer = useRef<number | null>(null);

  const BLOG_URL = 'https://rodziceinwestuja.substack.com/';
  const X_URL = 'https://x.com/RodziceInwest';
  const homeProgressClass = `home-progress-${activeStepIndex}` as const;

  const homeSteps = [
    { id: 'problem', label: 'Świadomość' },
    { id: 'calculator', label: 'Liczby' },
    { id: 'blog-section', label: 'Wiedza' },
    { id: 'steps-section', label: 'Plan' },
    { id: 'guide', label: 'Działanie' },
    { id: 'parents-teaser', label: 'Rodzice' },
  ];

  const clearPendingScroll = () => {
    if (pendingScrollTimer.current !== null) {
      window.clearTimeout(pendingScrollTimer.current);
      pendingScrollTimer.current = null;
    }
  };

  // --- SCROLL SPY FOR HOME STEPS ---
  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const offset = SCROLL_SPY_OFFSET;
      const scrollPosition = window.scrollY + offset;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (window.scrollY + windowHeight >= documentHeight - 50) {
        setActiveStepIndex(homeSteps.length - 1);
        return;
      }

      let currentActiveIndex = 0;
      for (let i = homeSteps.length - 1; i >= 0; i--) {
        const element = document.getElementById(homeSteps[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveIndex = i;
          break;
        }
      }
      setActiveStepIndex(currentActiveIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, homeSteps.length]);

  // --- DEEP LINKING HANDLER ---
  useEffect(() => {
    const handleHashChange = () => {
      let hash = '';
      try {
        hash = window.location.hash.replace('#', '');
      } catch (e) {
        console.warn('Cannot read location hash', e);
        return;
      }

      if (!hash) return;

      const parentsSections = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'parents-guide'];
      const wizardHash = 'wizard';

      const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      };

      if (parentsSections.includes(hash)) {
        if (currentPage !== 'parents-guide') {
          setCurrentPage('parents-guide');
          clearPendingScroll();
          pendingScrollTimer.current = window.setTimeout(() => {
            if (hash !== 'parents-guide') {
              scrollToSection(hash);
            } else {
              window.scrollTo(0, 0);
            }
          }, HASH_NAVIGATION_DELAY);
        } else if (hash !== 'parents-guide') {
          scrollToSection(hash);
        }
      } else if (hash === wizardHash) {
        setCurrentPage('wizard');
      } else {
        if (currentPage !== 'home') {
          setCurrentPage('home');
          clearPendingScroll();
          pendingScrollTimer.current = window.setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, HASH_NAVIGATION_DELAY);
        } else {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearPendingScroll();
    };
  }, [currentPage]);

  const safeUpdateUrl = (hash: string | null) => {
    try {
      if (hash) {
        window.history.pushState(null, '', `#${hash}`);
      } else {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {
      // Some embedded contexts disallow pushState; ignore.
    }
  };

  const navigateTo = (page: Page) => {
    setIsMenuOpen(false);
    setCurrentPage(page);
    window.scrollTo(0, 0);

    let hash = '';
    if (page === 'wizard') hash = 'wizard';
    if (page === 'parents-guide') hash = 'parents-guide';

    safeUpdateUrl(hash || null);
  };

  const scrollToId = (id: string) => {
    safeUpdateUrl(id);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      clearPendingScroll();
      pendingScrollTimer.current = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, PAGE_TRANSITION_DELAY);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const openLegal = (type: LegalType) => {
    setLegalModalType(type);
    setIsMenuOpen(false);
  };

  const handleResetCookies = () => {
    localStorage.removeItem('cookie_consent_level');
    setCookieVersion((v) => v + 1);
  };

  if (currentPage === 'wizard') {
    return (
      <InvestmentWizard
        key="wizard-mode"
        onBack={() => navigateTo('home')}
        onGoToParentsGuide={() => navigateTo('parents-guide')}
      />
    );
  }

  if (currentPage === 'parents-guide') {
    return <ParentsGuide key="parents-mode" onBack={() => navigateTo('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-accent selection:text-white">
      {/* DRAWER MENU */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-lg">
            <i aria-hidden="true" className="fas fa-seedling text-accent"></i>
            <span>Rodzice<span className="text-accent">Inwestują</span></span>
          </div>
          <button type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Zamknij menu"
            className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-primary hover:bg-gray-100 flex items-center justify-center transition-all"
          >
            <i aria-hidden="true" className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <button type="button" onClick={() => { setIsStepsModalOpen(true); setIsMenuOpen(false); }} className="text-left text-gray-600 hover:text-primary font-semibold flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><i aria-hidden="true" className="fas fa-map-signs text-sm"></i></div>
              <span>Jak zacząć?</span>
            </button>
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="text-left text-gray-600 hover:text-primary font-semibold flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center"><i aria-hidden="true" className="fas fa-newspaper text-sm"></i></div>
              <span>Blog</span>
            </a>
            <button type="button" onClick={() => scrollToId('calculator')} className="text-left text-gray-600 hover:text-primary font-semibold flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><i aria-hidden="true" className="fas fa-calculator text-sm"></i></div>
              <span>Kalkulator</span>
            </button>
            <button type="button" onClick={() => navigateTo('wizard')} className="text-left font-bold text-primary flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center"><i aria-hidden="true" className="fas fa-wand-magic-sparkles text-sm"></i></div>
              <span>Kreator Inwestycji</span>
            </button>
            <button type="button" onClick={() => navigateTo('parents-guide')} className="text-left font-bold text-primary flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><i aria-hidden="true" className="fas fa-user-shield text-sm"></i></div>
              <span>Strefa Rodzica</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <button type="button" onClick={() => { openLegal('terms'); setIsMenuOpen(false); }} className="text-xs text-gray-500 hover:text-primary font-semibold">Regulamin</button>
            <button type="button" onClick={() => { openLegal('privacy'); setIsMenuOpen(false); }} className="text-xs text-gray-500 hover:text-primary font-semibold">Prywatność</button>
            <button type="button" onClick={() => { setIsContactOpen(true); setIsMenuOpen(false); }} className="text-xs text-gray-500 hover:text-primary font-semibold">Kontakt</button>
          </div>
          <p className="text-[10px] text-gray-400">&copy; RodziceInwestują.pl</p>
        </div>
      </div>

      {/* MAIN NAVBAR - FIXED */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 fixed w-full z-[50] top-0 transition-all shadow-sm h-[var(--nav-h)]">
        <div className="container mx-auto px-6 h-full">
          <div className="flex justify-between items-center gap-6 h-full">
            <button
              type="button"
              className="flex items-center gap-2 text-primary font-display font-bold text-xl cursor-pointer shrink-0"
              onClick={() => navigateTo('home')}
            >
              <i aria-hidden="true" className="fas fa-seedling text-accent text-2xl"></i>
              <span>Rodzice<span className="text-accent">Inwestują</span></span>
            </button>

            <div className="hidden xl:flex items-center gap-8">
              <button type="button" onClick={() => setIsStepsModalOpen(true)} className="text-gray-600 hover:text-primary font-semibold transition whitespace-nowrap">Jak zacząć?</button>
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary font-semibold transition">Blog</a>
              <button type="button" onClick={() => scrollToId('calculator')} className="text-gray-600 hover:text-primary font-semibold transition">Kalkulator</button>

              <button type="button"
                onClick={() => navigateTo('parents-guide')}
                className="text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full font-bold text-sm transition border border-purple-100 flex items-center gap-2 whitespace-nowrap"
              >
                <i aria-hidden="true" className="fas fa-user-shield"></i> Dla Rodziców
              </button>

              <button type="button"
                onClick={() => navigateTo('wizard')}
                className="px-6 py-2 border-2 border-accent text-accent font-bold rounded-full hover:bg-accent hover:text-white transition duration-300 whitespace-nowrap"
              >
                <i aria-hidden="true" className="fas fa-wand-magic-sparkles mr-2"></i> Kreator Inwestycji
              </button>
            </div>

            <button type="button"
              className="xl:hidden text-primary text-2xl focus:outline-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Otwórz menu"
            >
              <i aria-hidden="true" className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-[var(--nav-h)]">
        <div className="animate-fade-in">
          <header id="hero" className="hero-pattern text-white pt-16 pb-20 lg:pt-32 lg:pb-32 relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 xl:gap-24">
              <div className="lg:w-3/5 text-center lg:text-left">
                <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.1] sm:leading-[1.1] mb-8 tracking-tight">
                  Podaruj dziecku <br />
                  <button
                    type="button"
                    onClick={() => scrollToId('problem')}
                    className="inline-block pb-[0.3em] -mb-[0.3em] cursor-pointer whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300 hover:text-emerald-200 transition-colors underline decoration-1 decoration-accent/30 hover:decoration-accent underline-offset-4 decoration-skip-ink"
                  >
                    łatwiejszy start
                  </button>{' '}
                  <br />
                  w&nbsp;dorosłość, a&nbsp;sobie <br />
                  <button
                    type="button"
                    onClick={() => navigateTo('parents-guide')}
                    className="inline-block pb-[0.3em] -mb-[0.3em] cursor-pointer whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300 hover:text-purple-200 transition-all underline decoration-1 decoration-purple-400/30 hover:decoration-purple-300 underline-offset-4 decoration-skip-ink"
                  >
                    spokojną emeryturę
                  </button>
                </h1>
                <p className="text-base sm:text-lg text-blue-50 mb-10 leading-relaxed max-w-3xl mx-auto lg:mx-0 font-medium opacity-90">
                  Nie musisz być bogaty, by zbudować dziecku kapitał. Dowiedz się, jak zamienić{' '}
                  <span className="text-accent font-bold whitespace-nowrap">małe kwoty</span>{' '}
                  (nawet z 800+) na duże rezultaty, a sobie{' '}
                  <span className="text-purple-300 font-bold cursor-pointer hover:underline decoration-purple-400/50" onClick={() => navigateTo('parents-guide')}>dodatkową emeryturę</span>,{' '}
                  <span className="whitespace-nowrap">
                    pokonując{' '}
                    <span className="tooltip-term text-accent font-bold border-accent/40 hover:border-accent" data-tip="Wzrost cen towarów i usług.">inflację</span>.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                  <button type="button" onClick={() => navigateTo('wizard')} className="w-full sm:w-auto bg-accent hover:bg-green-500 text-white font-display font-bold py-4 px-8 rounded-full shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 ease-out text-lg active:scale-95">
                    Wybierz swoją drogę
                  </button>

                  <button type="button" onClick={() => scrollToId('problem')} className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white border border-white text-white hover:text-primary font-display font-bold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm text-lg active:scale-95">
                    Sprawdź kroki <i aria-hidden="true" className="fas fa-arrow-down text-sm group-hover:translate-y-1 transition-transform opacity-70"></i>
                  </button>
                </div>
              </div>

              <div className="lg:w-2/5 flex justify-center lg:justify-end mb-4 lg:mb-0">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl shadow-primary/30">
                  <i aria-hidden="true" className="fas fa-rocket text-8xl sm:text-9xl text-accent drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"></i>

                  <div className="absolute -top-4 -right-4 bg-white text-primary p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse-subtle border border-gray-100">
                    <i aria-hidden="true" className="fas fa-chart-line text-2xl text-accent"></i>
                    <div className="text-sm font-bold leading-tight">Wielkie<br />rezultaty</div>
                  </div>

                  <div className="absolute bottom-6 -left-8 bg-white text-primary p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse-subtle pulse-delay-1500 border border-gray-100">
                    <i aria-hidden="true" className="fas fa-coins text-2xl text-amber-500"></i>
                    <div className="text-sm font-bold leading-tight">Małe<br />kwoty</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="sticky top-[var(--nav-h)] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all -mt-[50px] mb-[40px]">
            <div className="container mx-auto px-4 py-3 max-w-5xl">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative h-8 flex items-center">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 -z-10 rounded-full mx-2"></div>
                  <div
                    className={`absolute left-0 top-1/2 h-0.5 bg-accent -translate-y-1/2 -z-10 rounded-full mx-2 transition-all duration-500 ease-out ${homeProgressClass}`}
                  ></div>
                  <div className="flex justify-between w-full relative">
                    {homeSteps.map((step, index) => (
                      <button type="button"
                        key={step.id}
                        onClick={() => scrollToId(step.id)}
                        className={`
                          relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10 group cursor-pointer
                          ${index <= activeStepIndex
                            ? 'bg-accent border-accent text-white scale-110 shadow-md'
                            : 'bg-white border-gray-300 text-gray-400 hover:border-accent hover:text-accent'
                          }
                        `}
                        aria-label={step.label}
                      >
                        {index === homeSteps.length - 1 ? <i aria-hidden="true" className="fas fa-user-shield text-[10px]"></i> : index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="problem" className="relative mt-12 pt-12 pb-16 bg-white scroll-mt-48 border-b border-gray-50">
            <StepBadge step={1} label="Świadomość" colorClass="bg-gradient-to-r from-emerald-400 to-emerald-300" />
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

          <div id="calculator" className="relative scroll-mt-48 pt-12 pb-16 bg-bgLight border-b border-gray-100">
            <StepBadge step={2} label="Liczby" colorClass="bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <Calculator />
          </div>

          <section id="blog-section" className="relative pt-12 pb-16 bg-white overflow-visible scroll-mt-48 border-b border-gray-50">
            <StepBadge step={3} label="Wiedza" colorClass="bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <div className="container mx-auto px-6 max-w-5xl">
              <div className="bg-primary/5 rounded-[40px] p-8 md:p-14 flex flex-col lg:flex-row items-center gap-12 border border-primary/10 mt-4">
                <div className="lg:w-2/3 text-center lg:text-left">
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mb-6">Czytaj Bloga na platformie Substack</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">Komentarze giełdowe i edukacja finansowa w polskich realiach. Dowiedz się, jak mądrze budować kapitał dla swojej rodziny.</p>
                  <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-out">
                    <i aria-hidden="true" className="fas fa-newspaper"></i> Odwiedź Bloga
                  </a>
                </div>
                <div className="lg:w-1/3 flex justify-center">
                  <a
                    href={BLOG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group cursor-pointer block"
                  >
                    <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl group-hover:bg-accent/30 transition-all"></div>
                    <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <i aria-hidden="true" className="fas fa-bookmark text-accent"></i>
                        <span className="text-xs font-bold text-gray-400 uppercase">Najnowszy wpis</span>
                      </div>
                      <h4 className="font-bold text-primary mb-2 leading-snug">Jak dbać o finanse Twojego dziecka?</h4>
                      <div className="w-12 h-1 bg-accent/20 mb-4"></div>
                      <p className="text-xs text-gray-500 leading-relaxed italic">Poznaj proste sposoby na zabezpieczenie kapitału...</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="steps-section" className="relative bg-bgLight pt-12 pb-20 border-t border-gray-100 scroll-mt-48">
            <StepBadge step={4} label="Plan" colorClass="bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <div className="container mx-auto px-6 max-w-5xl text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary mt-4 mb-4">Wykonaj pierwsze kroki</h2>
              <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Masz już świadomość i wiedzę. Czas na konkretny plan działania dostosowany do Twojej sytuacji.</p>
              <button type="button" onClick={() => setIsStepsModalOpen(true)} className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-primary hover:bg-opacity-90 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl shadow-primary/30 hover:shadow-2xl transition-all duration-300 ease-out w-full sm:w-auto">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <i aria-hidden="true" className="fas fa-map-signs"></i> Zobacz plan krok po kroku
                </span>
              </button>
            </div>
          </section>

          <section id="guide" className="bg-primary pt-14 pb-20 text-white text-center relative overflow-visible scroll-mt-48">
            <StepBadge step={5} label="Działanie" colorClass="bg-gradient-to-r from-emerald-400 to-emerald-300" />
            <i aria-hidden="true" className="fas fa-question absolute top-10 left-10 text-white opacity-5 text-9xl pointer-events-none"></i>
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
              <h2 className="font-display font-bold text-3xl md:text-5xl mt-6 mb-4">Nie wiesz co wybrać?</h2>
              <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg leading-relaxed">Skorzystaj z inteligentnego kreatora, który pomoże Ci dobrać strategię inwestycyjną.</p>
              <button type="button" onClick={() => navigateTo('wizard')} className="group relative overflow-hidden bg-accent hover:bg-green-500 text-white font-bold py-5 px-12 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 ease-out flex items-center justify-center mx-auto gap-3 w-full sm:w-auto">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer skew-x-[-20deg]"></div>
                <i aria-hidden="true" className="fas fa-wand-magic-sparkles"></i> Uruchom Kreator Inwestycji
              </button>
            </div>
          </section>

          <div id="parents-teaser" className="bg-purple-900 py-16 relative overflow-hidden border-t border-purple-800 scroll-mt-48">
            <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
              <span className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2 block">Dla Rodziców</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
                A co z Twoją emeryturą?
              </h3>
              <p className="text-purple-100 mb-6 text-sm md:text-base max-w-2xl mx-auto">
                Zabezpiecz swoją przyszłość, korzystając z limitów IKE i IKZE. To najlepszy sposób na inwestowanie bez podatku Belki i z ulgą w PIT.
              </p>
              <button type="button"
                onClick={() => navigateTo('parents-guide')}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
              >
                <i aria-hidden="true" className="fas fa-user-shield"></i> Wejdź do Strefy Rodzica
              </button>
            </div>
            <i aria-hidden="true" className="fas fa-shield-alt absolute -left-10 -bottom-10 text-9xl text-white opacity-5"></i>
            <i aria-hidden="true" className="fas fa-chart-line absolute -right-10 top-10 text-9xl text-white opacity-5"></i>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
              <i aria-hidden="true" className="fas fa-seedling text-accent"></i>
              <span>Rodzice<span className="text-accent">Inwestują</span></span>
            </div>
            <div className="flex gap-6 items-center flex-wrap justify-center">
              <button type="button" onClick={() => openLegal('terms')} className="hover:text-white transition">Regulamin</button>
              <button type="button" onClick={() => openLegal('privacy')} className="hover:text-white transition">Prywatność</button>
              <button type="button" onClick={() => setIsContactOpen(true)} className="hover:text-white transition">Kontakt</button>
            </div>
            <div className="flex gap-4">
              <a href={X_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white transition" aria-label="X (Twitter)">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-600 max-w-2xl mx-auto border-t border-gray-800 pt-8 leading-relaxed">
            &copy; {new Date().getFullYear()} RodziceInwestują.pl. Treści edukacyjne, nie stanowią porady inwestycyjnej. Inwestowanie wiąże się z ryzykiem utraty kapitału.
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <StepsModal isOpen={isStepsModalOpen} onClose={() => setIsStepsModalOpen(false)} onOpenWizard={() => navigateTo('wizard')} />
        <LegalModal
          isOpen={!!legalModalType}
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
          onResetCookies={handleResetCookies}
        />
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </Suspense>
      <CookieConsent key={cookieVersion} onOpenPrivacy={() => openLegal('privacy')} />
    </div>
  );
};

export default App;
