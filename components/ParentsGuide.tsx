import React, { useState, useEffect } from 'react';
import TaxSimulator from './TaxSimulator';
import ProvidersModal, { ProviderType } from './ProvidersModal';
import StepBadge from './StepBadge';
import {
    LIMITS,
    PROVIDER_SELECTION_DETAILS,
    PROVIDER_SELECTION_NOTE,
    SHOW_PROVIDER_LISTS,
} from '../constants';

interface ParentsGuideProps {
    onBack: () => void;
}

const STRATEGY_KEY = 'rodzice_strategy_level';
const SELF_EMPLOYED_KEY = 'rodzice_self_employed';
const SELF_EMPLOYED_INPUT_ID = 'self-employed-toggle';
const PARENTS_PROGRESS_CLASS = [
    'parents-progress-0',
    'parents-progress-1',
    'parents-progress-2',
    'parents-progress-3',
    'parents-progress-4',
] as const;

const readStoredNumber = (key: string, fallback: number): number => {
    try {
        const v = sessionStorage.getItem(key);
        if (v === null) return fallback;
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : fallback;
    } catch {
        return fallback;
    }
};

const readStoredBool = (key: string, fallback: boolean): boolean => {
    try {
        const v = sessionStorage.getItem(key);
        if (v === null) return fallback;
        return v === '1';
    } catch {
        return fallback;
    }
};

const ParentsGuide: React.FC<ParentsGuideProps> = ({ onBack }) => {
    const [strategyLevel, setStrategyLevel] = useState(() => readStoredNumber(STRATEGY_KEY, 1));
    const [isSelfEmployed, setIsSelfEmployed] = useState(() => readStoredBool(SELF_EMPLOYED_KEY, false));
    const [modalType, setModalType] = useState<ProviderType>(null);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    useEffect(() => {
        try { sessionStorage.setItem(STRATEGY_KEY, String(strategyLevel)); } catch {}
    }, [strategyLevel]);

    useEffect(() => {
        try { sessionStorage.setItem(SELF_EMPLOYED_KEY, isSelfEmployed ? '1' : '0'); } catch {}
    }, [isSelfEmployed]);

    const steps = [
        { id: 'step-1', label: 'Wybór' },
        { id: 'step-2', label: 'Zasady' },
        { id: 'step-3', label: 'Strategia' },
        { id: 'step-4', label: 'Symulacja' },
        { id: 'step-5', label: 'Działanie' },
    ];

    const handleBack = () => {
        window.scrollTo(0,0);
        onBack();
    };

    // SCROLL SPY: Automatyczne wykrywanie aktywnej sekcji
    useEffect(() => {
        const handleScroll = () => {
            const headerHeight = 160; // Przybliżona wysokość nagłówka
            const scrollPosition = window.scrollY + headerHeight + 50; // +50px bufor

            // Znajdź sekcję, która jest aktualnie widoczna
            let currentActiveIndex = 0;
            
            // Sprawdzamy od końca, żeby złapać ostatnią widoczną sekcję
            for (let i = steps.length - 1; i >= 0; i--) {
                const element = document.getElementById(steps[i].id);
                if (element && element.offsetTop <= scrollPosition) {
                    currentActiveIndex = i;
                    break;
                }
            }
            setActiveStepIndex(currentActiveIndex);
        };

        window.addEventListener('scroll', handleScroll);
        // Wywołaj raz na starcie
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 150; 
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

    // Determine current limit based on user selection
    const currentIkzeLimit = isSelfEmployed ? LIMITS.IKZE_SELF_EMPLOYED : LIMITS.IKZE;

    // Strategy Data Definition - COLORS CHANGED TO PURPLE FOR STOCKS
    const strategies = {
        1: {
            title: "Twierdza (100% Bezpieczeństwa)",
            desc: "Nie akceptujesz ryzyka. Chcesz chronić kapitał przed inflacją, wykorzystując wszystkie ulgi podatkowe.",
            ike: { type: 'Obligacje', color: 'blue', limit: LIMITS.IKE },
            ikze: { type: 'Obligacje', color: 'blue', limit: currentIkzeLimit },
            pros: "Pełna ochrona kapitału, gwarancja zysku (powyżej inflacji), spokój ducha.",
            cons: "Niższy potencjalny zysk niż na giełdzie w czasie hossy."
        },
        2: {
            title: "Ostrożny Wzrost (Hybryda Defensywna)",
            desc: "Większość środków (limit IKE) trzymasz bezpiecznie. Mniejszą część (limit IKZE) ryzykujesz na giełdzie, bo zwrot podatku z PIT amortyzuje ewentualne spadki.",
            ike: { type: 'Obligacje', color: 'blue', limit: LIMITS.IKE },
            ikze: { type: 'Akcje / ETF', color: 'purple', limit: currentIkzeLimit }, // Purple for Stocks
            pros: "Duża stabilność. Ryzykujesz tylko ~30% rocznego kapitału.",
            cons: "Ograniczony udział w wzrostach giełdowych."
        },
        3: {
            title: "Aktywny Wzrost (Hybryda Ofensywna)",
            desc: "Chcesz maksymalizować zyski bez podatku Belki (IKE Akcje). IKZE traktujesz jako bezpieczną poduszkę finansową.",
            ike: { type: 'Akcje / ETF', color: 'purple', limit: LIMITS.IKE }, // Purple for Stocks
            ikze: { type: 'Obligacje', color: 'blue', limit: currentIkzeLimit },
            pros: "Duży potencjał zysku (limit IKE jest 3x wyższy). Bezpiecznik w postaci IKZE.",
            cons: "Większa zmienność portfela."
        },
        4: {
            title: "Pełna Ofensywa (100% Wzrostu)",
            desc: "Masz długi horyzont (15+ lat) i nie boisz się wahań rynku. Chcesz maksymalnie wykorzystać procent składany na giełdzie.",
            ike: { type: 'Akcje / ETF', color: 'purple', limit: LIMITS.IKE }, // Purple for Stocks
            ikze: { type: 'Akcje / ETF', color: 'purple', limit: currentIkzeLimit }, // Purple for Stocks
            pros: "Historycznie najwyższe stopy zwrotu. Zerowe podatki od dywidend i zysków.",
            cons: "Ryzyko dużej zmienności w krótkim terminie."
        }
    };

    const currentStrategy = strategies[strategyLevel as keyof typeof strategies];
    
    // Calculations for the single bar visualization
    const totalLimit = LIMITS.IKE + currentIkzeLimit;
    const ikePercent = (LIMITS.IKE / totalLimit) * 100;
    const ikzePercent = (currentIkzeLimit / totalLimit) * 100;
    const progressClass = PARENTS_PROGRESS_CLASS[activeStepIndex] ?? PARENTS_PROGRESS_CLASS[0];
    const strategyFillClass = `strategy-fill-${strategyLevel}` as const;

    // Card Style for Step 5
    const cardStyle = "w-full bg-white p-6 md:p-8 rounded-[32px] border shadow-lg flex flex-col items-center text-center relative overflow-hidden group hover:shadow-xl cursor-pointer hover-card-crisp transition-all";

    return (
        <div className="min-h-screen bg-white animate-fade-in pb-20 relative">
            {/* 
                STICKY HEADER & NAV 
            */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
                {/* Row 1: Top Bar */}
                <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">
                    <button type="button" onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-primary transition font-bold group text-sm md:text-base">
                        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                        <span>Wróć</span>
                    </button>
                    <div className="font-display font-bold text-purple-900 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center"><i className="fas fa-user-shield"></i></span>
                        <span className="hidden sm:inline">Strefa Rodzica</span>
                    </div>
                </div>

                {/* Row 2: STEPPER PROGRESS BAR */}
                <div className="border-t border-gray-100 bg-white/50">
                    <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
                        {/* REMOVED LABEL "Kroki" for cleaner look */}
                        
                        <div className="flex-1 relative h-8 flex items-center">
                             {/* Background Line */}
                             <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 -z-10 rounded-full mx-2"></div>
                             
                             {/* Active Progress Line */}
                             <div 
                                className={`absolute left-0 top-1/2 h-0.5 bg-purple-600 -translate-y-1/2 -z-10 rounded-full mx-2 transition-all duration-500 ease-out ${progressClass}`}
                             ></div>

                             {/* Steps Circles */}
                             <div className="flex justify-between w-full relative">
                                {steps.map((step, index) => (
                                    <button type="button"
                                        key={step.id}
                                        onClick={() => scrollToSection(step.id)}
                                        aria-label={`Przejdź do kroku: ${step.label}`}
                                        className={`
                                            relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10
                                            ${index <= activeStepIndex 
                                                ? 'bg-purple-600 border-purple-600 text-white scale-110 shadow-md' 
                                                : 'bg-white border-gray-300 text-gray-400 hover:border-purple-300'
                                            }
                                        `}
                                    >
                                        {index + 1}
                                        {/* Optional Label below circle - hidden on mobile for cleaner look, visible on hover/desktop? 
                                            Let's keep it simple as requested: circles + bar.
                                        */}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero - Padding unified to pt-8 (less padding needed because nav is sticky and taller) */}
            <header className="bg-purple-900 text-white pt-12 pb-16 relative overflow-hidden">
                {/* CSS Pattern Background (Dots) */}
                <div className="absolute inset-0 parents-hero-pattern"></div>
                
                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50"></div>

                <div className="container mx-auto px-6 max-w-4xl text-center relative z-30">
                    <h1 className="font-display font-bold text-3xl md:text-5xl mb-6 leading-tight">
                        Zadbaj o swoją emeryturę, <br className="hidden md:block"/>
                        <span className="text-purple-300">to najlepszy prezent dla dzieci.</span>
                    </h1>
                    <p className="text-purple-100 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-0">
                         Dziecko do 16 r.ż. nie może mieć kont IKE/IKZE. Wykorzystaj <strong>swoje limity</strong>, aby budować majątek rodziny bez podatków.
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 max-w-5xl -mt-6 relative z-20 space-y-24">
                
                {/* STEP 1: COMPARISON */}
                <section id="step-1" className="relative scroll-mt-48 pt-10">
                    {/* Fioletowy Badge */}
                    <StepBadge step={1} label="Wybór Konta" colorClass="bg-gradient-to-r from-purple-700 to-purple-500" />
                    
                    <div className="text-center mb-10">
                        <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-800 mt-4">IKE czy IKZE?</h2>
                        <p className="text-gray-500 mt-2 max-w-xl mx-auto mb-6 text-base">
                            Możesz mieć oba, ale nie musisz. Wielu rodziców zaczyna tylko od jednego. Pamiętaj: <strong>limit 1 IKE i 1 IKZE na osobę</strong>.
                        </p>

                         {/* SELF EMPLOYED TOGGLE */}
                        <div className="inline-block bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            <label htmlFor={SELF_EMPLOYED_INPUT_ID} className="flex items-center gap-3 cursor-pointer select-none px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="relative">
                                    <input 
                                        id={SELF_EMPLOYED_INPUT_ID}
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={isSelfEmployed} 
                                        onChange={(e) => setIsSelfEmployed(e.target.checked)} 
                                    />
                                    <div className={`w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-300 ${isSelfEmployed ? 'bg-amber-400' : ''}`}></div>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isSelfEmployed ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <span className={`text-sm font-bold ${isSelfEmployed ? 'text-gray-800' : 'text-gray-500'}`}>Jestem Samozatrudniony</span>
                                <span className="tooltip-term w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-500 font-bold" data-tip="Dotyczy osób prowadzących pozarolniczą działalność gospodarczą, twórców, artystów oraz wspólników spółek osobowych. Przysługuje im wyższy limit wpłat na IKZE.">?</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        {/* IKE COLUMN */}
                        <div className="bg-white rounded-[32px] border border-purple-100 shadow-xl overflow-hidden flex flex-col hover:border-purple-300 transition-colors">
                            <div className="bg-purple-50 p-6 border-b border-purple-100 text-center">
                                <h2 className="text-3xl font-display font-bold text-purple-900 mb-2">IKE</h2>
                                <p className="text-purple-600 font-bold text-xs uppercase tracking-wider">Indywidualne Konto Emerytalne</p>
                                <div className="mt-4 inline-block bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100">
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Limit 2026</span>
                                    <span className="text-2xl font-bold text-purple-600">{formatCurrency(LIMITS.IKE)}</span>
                                </div>
                            </div>
                            
                            <div className="p-6 md:p-8 flex-1 flex flex-col gap-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-lg">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">Brak Podatku Belki</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Wypłacając po 60 r.ż., cały zysk jest Twój. Oszczędzasz 19%.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-lg">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">Elastyczność</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">Możesz wypłacić część lub całość w każdej chwili (tracisz wtedy tylko ulgę podatkową).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IKZE COLUMN */}
                        <div className="bg-white rounded-[32px] border border-amber-100 shadow-xl overflow-hidden flex flex-col hover:border-amber-300 transition-colors">
                            <div className="bg-amber-50 p-6 border-b border-amber-100 text-center">
                                <h2 className="text-3xl font-display font-bold text-amber-800 mb-2">IKZE</h2>
                                <p className="text-amber-600 font-bold text-xs uppercase tracking-wider">Konto Zabezpieczenia Emerytalnego</p>
                                <div className="mt-4 inline-block bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-100">
                                    <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Limit 2026 {isSelfEmployed && "(Samozatrudnieni)"}</span>
                                    <span className="text-2xl font-bold text-amber-600">{formatCurrency(currentIkzeLimit)}</span>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex-1 flex flex-col gap-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-lg">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">Zwrot z PIT</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            Wpłaty odliczasz od dochodu. Urząd Skarbowy oddaje Ci 12% lub 32% wpłaconej kwoty co roku.
                                        </p>
                                    </div>
                                </div>
                                 <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-lg">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">Ryczałt na koniec</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            Wypłacając po 65 r.ż., płacisz 10% podatku od całości. Opłaca się, bo wcześniej odliczałeś 12/32%.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 2: RULES */}
                <section id="step-2" className="relative pt-6 scroll-mt-48">
                    <StepBadge step={2} label="Zasady Gry" colorClass="bg-gradient-to-r from-purple-700 to-purple-500" />
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10 text-center md:text-left mt-10">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-20 h-20 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 text-3xl animate-pulse">
                                <i className="fas fa-traffic-light"></i>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Jeden PESEL = Jedno Konto</h3>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                    Możesz posiadać tylko <strong>jedno IKE</strong> i tylko <strong>jedno IKZE</strong> w danej chwili. 
                                    Nie musisz zakładać obu. Jeśli masz ograniczony budżet, zacznij od IKE (bardziej elastyczne). Jeśli płacisz wysokie podatki, rozważ IKZE.
                                    <br/><br/>
                                    <strong>Ważne:</strong> IKE i IKZE to tylko "opakowania". W środku mogą być obligacje (Bank) LUB akcje/ETF (Dom Maklerski).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 3: STRATEGY SLIDER */}
                <section id="step-3" className="relative pt-6 scroll-mt-48">
                    <StepBadge step={3} label="Twoja Strategia" colorClass="bg-gradient-to-r from-purple-700 to-purple-500" />
                    
                    <div className="text-center mt-10 mb-8">
                        <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-800">Skonfiguruj swój portfel</h2>
                        <p className="text-gray-500 mt-2 text-base">Przesuń suwak. Zobacz jak zmieniają się limity i ryzyko.</p>
                        
                        <div className="mt-6 bg-purple-50 inline-block px-6 py-4 rounded-xl border border-purple-100 text-left max-w-2xl">
                             <p className="text-sm text-purple-800 font-semibold mb-2">
                                <i className="fas fa-info-circle mr-1"></i> 
                                Nie musisz wykorzystywać całego limitu (ok. {formatCurrency(totalLimit)} łącznie), ale im więcej wpłacisz, tym większe korzyści podatkowe.
                            </p>
                            <p className="text-xs text-purple-600 leading-relaxed">
                                <strong>Pamiętaj:</strong> Limity są ustalane co roku i zależą od prognoz wynagrodzeń. Warto dokonywać wpłat regularnie, nie tylko pod koniec roku, aby spokojniej budować kapitał emerytalny.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-[40px] p-6 md:p-10 border border-gray-200">
                        {/* SLIDER UI */}
                        <div className="mb-12 px-2 md:px-6">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                                <span>Obligacje</span>
                                <span>Dywersyfikacja</span>
                                <span>Akcje/ETF</span>
                            </div>
                            
                            <div className="relative h-12 flex items-center">
                                {/* Track */}
                                <div className="absolute w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-gradient-to-r from-blue-400 via-purple-500 to-purple-800 transition-all duration-300 ${strategyFillClass}`}
                                    ></div>
                                </div>
                                
                                {/* Thumbs (Clickable Areas) */}
                                {[1, 2, 3, 4].map((level) => {
                                    const isActive = strategyLevel >= level;
                                    // Define color based on level ONLY if active
                                    let activeColor = '';
                                    if (isActive) {
                                        if (level === 1) activeColor = 'bg-blue-500';
                                        else if (level === 2) activeColor = 'bg-purple-500';
                                        else if (level === 3) activeColor = 'bg-purple-600';
                                        else if (level === 4) activeColor = 'bg-purple-800';
                                    } else {
                                        activeColor = 'bg-gray-300';
                                    }

                                    return (
                                        <button type="button"
                                            key={level}
                                            onClick={() => setStrategyLevel(level)}
                                            aria-label={`Ustaw poziom strategii ${level}`}
                                            title={`Ustaw poziom strategii ${level}`}
                                            className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full border-4 shadow-md transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 ring-purple-200
                                                ${isActive ? 'border-white scale-110' : 'border-gray-100 scale-90'}
                                                ${activeColor}
                                                ${level === 1 ? 'left-0' : ''}
                                                ${level === 2 ? 'left-[33%]' : ''}
                                                ${level === 3 ? 'left-[66%]' : ''}
                                                ${level === 4 ? 'right-0' : ''}
                                                ${level === 2 || level === 3 ? 'strategy-thumb-center' : ''}
                                            `}
                                        >
                                            {strategyLevel === level && <i className="fas fa-check text-white text-sm"></i>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* STRATEGY CARD DISPLAY */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-100 transition-all duration-500">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/2 space-y-5">
                                    <div className="inline-block px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide">
                                        Poziom {strategyLevel}/4
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">{currentStrategy.title}</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">{currentStrategy.desc}</p>
                                    
                                    <div className="pt-4 space-y-3">
                                        <div className="flex items-start gap-3 text-sm text-gray-600">
                                            <i className="fas fa-plus-circle text-purple-500 mt-1 text-base"></i>
                                            <span>{currentStrategy.pros}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-sm text-gray-600">
                                            <i className="fas fa-minus-circle text-red-400 mt-1 text-base"></i>
                                            <span>{currentStrategy.cons}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* VISUALIZATION - SINGLE BAR */}
                                <div className="md:w-1/2 flex flex-col justify-center">
                                    <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wide text-gray-400">
                                        <span>Alokacja kapitału (Łącznie: {formatCurrency(totalLimit)})</span>
                                    </div>
                                    
                                    <div className="w-full h-72 md:h-80 bg-gray-50 rounded-2xl overflow-hidden flex flex-col shadow-inner border border-gray-200">
                                        {/* IKE SEGMENT */}
                                        <div
                                            style={{ flexGrow: ikePercent, flexBasis: 0 }}
                                            className={`relative flex flex-col justify-center px-4 py-3 min-h-[4.5rem] transition-all duration-500 ${currentStrategy.ike.color === 'blue' ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'}`}
                                        >
                                            <div className={`absolute top-0 left-0 right-0 h-1.5 md:h-2 ${currentStrategy.ike.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="text-xs font-bold opacity-60 uppercase tracking-wide">IKE</span>
                                                <span className="text-xs font-bold opacity-60">{Math.round(ikePercent)}%</span>
                                            </div>
                                            <span className="font-bold text-base md:text-lg leading-tight mt-1">{currentStrategy.ike.type}</span>
                                            <span className="text-xs opacity-70 mt-0.5">{formatCurrency(LIMITS.IKE)}</span>
                                        </div>

                                        {/* IKZE SEGMENT */}
                                        <div
                                            style={{ flexGrow: ikzePercent, flexBasis: 0 }}
                                            className={`relative flex flex-col justify-center px-4 py-3 min-h-[4.5rem] transition-all duration-500 border-t border-white/50 ${currentStrategy.ikze.color === 'blue' ? 'bg-blue-100/50 text-blue-800' : 'bg-purple-100/50 text-purple-800'}`}
                                        >
                                            <div className={`absolute top-0 left-0 right-0 h-1.5 md:h-2 ${currentStrategy.ikze.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="text-xs font-bold opacity-60 uppercase tracking-wide">IKZE</span>
                                                <span className="text-xs font-bold opacity-60">{Math.round(ikzePercent)}%</span>
                                            </div>
                                            <span className="font-bold text-base md:text-lg leading-tight mt-1">{currentStrategy.ikze.type}</span>
                                            <span className="text-xs opacity-70 mt-0.5">{formatCurrency(currentIkzeLimit)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 flex gap-4 justify-center md:justify-start">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                            <span className="text-xs text-gray-500 font-semibold uppercase">Obligacje</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                            <span className="text-xs text-gray-500 font-semibold uppercase">Akcje / ETF</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP 4: SIMULATION */}
                <section id="step-4" className="relative pt-6 scroll-mt-48">
                    <StepBadge step={4} label="Symulacja" colorClass="bg-gradient-to-r from-purple-700 to-purple-500" />
                    <div className="mt-10">
                         <TaxSimulator customIkzeLimit={currentIkzeLimit} />
                    </div>
                </section>

                {/* STEP 5: BROKERS (NEW TILES LAYOUT) */}
                <section id="step-5" className="relative pt-6 scroll-mt-48">
                    <StepBadge step={5} label="Działanie" colorClass="bg-gradient-to-r from-purple-700 to-purple-500" />
                    <div className="mt-10 max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="font-display font-bold text-2xl text-gray-800">Jak wybrać miejsce do założenia konta?</h3>
                            <p className="text-gray-500 mt-2 text-base">
                                Na tym etapie najważniejsze jest porównanie kosztów, wygody aplikacji i zakresu wsparcia.
                            </p>
                        </div>

                        {!SHOW_PROVIDER_LISTS && (
                            <div className="mb-16 p-6 md:p-8 bg-white rounded-[32px] border border-gray-100 shadow-lg text-left">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                                        <i className="fas fa-info-circle"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-primary mb-3">Co warto porównać przed wyborem?</h4>
                                        <p className="text-gray-600 leading-relaxed mb-3">{PROVIDER_SELECTION_NOTE}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">{PROVIDER_SELECTION_DETAILS}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {SHOW_PROVIDER_LISTS && (
                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            {/* OBLIGACJE TILE - Reverted to button since TOC overlay is gone */}
                            <button type="button" onClick={() => setModalType('ike-bonds')} className={`${cardStyle} border-blue-100 shadow-blue-100/40 hover:border-blue-300 hover:shadow-blue-200/50`}>
                                <i className="fas fa-shield-alt absolute -bottom-5 -right-5 text-8xl md:text-9xl text-blue-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>
                                
                                <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">IKE / IKZE Obligacje</h3>
                                <p className="text-sm text-gray-600 mb-6 relative z-10 leading-relaxed">
                                    Najbezpieczniejsza opcja. Gwarantowane przez Skarb Państwa. Ochrona przed inflacją bez ryzyka rynkowego.
                                </p>
                                
                                <div className="mt-auto relative z-10 bg-blue-100 text-blue-700 font-bold px-6 py-3 rounded-full group-hover:bg-blue-200 transition-colors flex items-center gap-2 w-fit">
                                    Sprawdź kryteria wyboru <i className="fas fa-chevron-right text-xs"></i>
                                </div>
                            </button>

                            {/* AKCJE / ETF TILE - Reverted to button since TOC overlay is gone */}
                            <button type="button" onClick={() => setModalType('ike-stocks')} className={`${cardStyle} border-purple-100 shadow-purple-100/40 hover:border-purple-300 hover:shadow-purple-200/50`}>
                                <i className="fas fa-chart-line absolute -bottom-5 -right-5 text-8xl md:text-9xl text-purple-50 opacity-50 transition-transform duration-500 pointer-events-none"></i>

                                <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">IKE / IKZE Maklerskie</h3>
                                <p className="text-sm text-gray-600 mb-6 relative z-10 leading-relaxed">
                                    Dla szukających wyższych zysków. Inwestuj w akcje i ETFy z całego świata bez podatku Belki.
                                </p>
                                
                                <div className="mt-auto relative z-10 bg-purple-100 text-purple-700 font-bold px-6 py-3 rounded-full group-hover:bg-purple-200 transition-colors flex items-center gap-2 w-fit">
                                    Sprawdź kryteria wyboru <i className="fas fa-chevron-right text-xs"></i>
                                </div>
                            </button>
                        </div>
                        )}
                    </div>
                </section>

            </div>

            {SHOW_PROVIDER_LISTS && (
                <ProvidersModal 
                    isOpen={!!modalType} 
                    type={modalType} 
                    onClose={() => setModalType(null)} 
                />
            )}
        </div>
    );
};

export default ParentsGuide;
