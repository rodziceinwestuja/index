import React from 'react';
import { WizardStep } from './WizardTypes';

interface StepProps {
  onNavigate: (step: WizardStep, progress: number) => void;
}

// Mobile Audit & Blur Fix:
// 1. Removed 'hover:-translate-y-1', 'transform-gpu', 'will-change-transform'. 
//    Moving the container caused sub-pixel rendering issues (blur) on text.
// 2. Kept 'active:scale-[0.98]' for tactile feedback without layout shift.
const cardStyle = "p-6 md:p-8 border-2 rounded-[24px] md:rounded-[32px] bg-white text-left block w-full group transition-all duration-300 ease-out relative overflow-hidden active:scale-[0.98]";

export const StepApproach: React.FC<StepProps> = ({ onNavigate }) => (
  <div className="animate-fade-in text-center max-w-3xl mx-auto">
    <h2 className="text-2xl md:text-5xl font-display font-bold text-primary mb-6 md:mb-8">Jakie jest Twoje podejście?</h2>
    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
      <button onClick={() => onNavigate('step2-safe-bonds', 50)} className={`${cardStyle} border-blue-100 hover:border-blue-500 shadow-lg shadow-blue-100/40 hover:shadow-xl hover:shadow-blue-200/50`}>
        <i className="fas fa-shield-alt absolute -bottom-5 -right-5 text-8xl md:text-9xl text-blue-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <h3 className="font-bold text-xl md:text-2xl text-primary mb-2 md:mb-3">Pełne Bezpieczeństwo</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Ochrona przed inflacją bez ryzyka straty dzięki obligacjom skarbowym (Gwarancje Państwa).</p>
        </div>
      </button>
      <button onClick={() => onNavigate('step2-growth-type', 40)} className={`${cardStyle} border-emerald-100 hover:border-emerald-500 shadow-lg shadow-emerald-100/40 hover:shadow-xl hover:shadow-emerald-200/50`}>
          <i className="fas fa-chart-line absolute -bottom-5 -right-5 text-8xl md:text-9xl text-emerald-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <h3 className="font-bold text-xl md:text-2xl text-primary mb-2 md:mb-3">Budowanie Majątku</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Chcę zyskać więcej niż na obligacjach i akceptuje ryzyko.</p>
        </div>
      </button>
    </div>
  </div>
);

export const StepSafeCheck: React.FC<StepProps> = ({ onNavigate }) => (
  <div className="animate-fade-in text-center max-w-xl mx-auto">
    <h2 className="text-2xl md:text-4xl font-display font-bold text-primary mb-6 md:mb-8">Czy pobierasz 800+?</h2>
    <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
      <button onClick={() => onNavigate('result-family-bonds', 100)} className={`${cardStyle} border-gray-100 hover:border-pink-300 shadow-lg shadow-gray-100/40 hover:shadow-xl hover:shadow-pink-100/50 text-center flex flex-col items-center justify-center min-h-[160px]`}>
        <i className="fas fa-baby-carriage text-3xl md:text-4xl text-pink-400 mb-4 md:mb-6"></i>
        <span className="font-bold text-lg md:text-xl text-primary">Tak</span>
      </button>
      <button onClick={() => onNavigate('result-standard-bonds', 100)} className={`${cardStyle} border-gray-100 hover:border-blue-300 shadow-lg shadow-gray-100/40 hover:shadow-xl hover:shadow-blue-100/50 text-center flex flex-col items-center justify-center min-h-[160px]`}>
        <i className="fas fa-times text-3xl md:text-4xl text-gray-300 mb-4 md:mb-6"></i>
        <span className="font-bold text-lg md:text-xl text-primary">Nie</span>
      </button>
    </div>
  </div>
);

export const StepGrowthType: React.FC<StepProps> = ({ onNavigate }) => (
  <div className="animate-fade-in text-center max-w-3xl mx-auto">
    <h2 className="text-2xl md:text-4xl font-display font-bold text-primary mb-6 md:mb-8">W co chcesz zainwestować?</h2>
    <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
      <button onClick={() => onNavigate('step2-growth-market', 60)} className={`${cardStyle} border-emerald-100 hover:border-emerald-500 shadow-lg shadow-emerald-100/40 hover:shadow-xl hover:shadow-emerald-200/50`}>
          <i className="fas fa-globe absolute -bottom-5 -right-5 text-8xl md:text-9xl text-emerald-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <h3 className="font-bold text-xl md:text-2xl text-primary mb-2 md:mb-3">Akcje, Fundusze i ETFy</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Polskie i globalne rynki akcji, fundusze indeksowe oraz fundusze ETF. Najszerszy wybór inwestycji.</p>
        </div>
      </button>
      <button onClick={() => onNavigate('result-metals', 100)} className={`${cardStyle} border-amber-100 hover:border-amber-500 shadow-lg shadow-amber-100/40 hover:shadow-xl hover:shadow-amber-200/50`}>
          <i className="fas fa-gem absolute -bottom-5 -right-5 text-8xl md:text-9xl text-amber-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <h3 className="font-bold text-xl md:text-2xl text-primary mb-2 md:mb-3">Złoto i Srebro</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Królewskie kruszce. Fizyczne zabezpieczenie wartości Twojego kapitału na pokolenia.</p>
        </div>
      </button>
    </div>
  </div>
);

export const StepGrowthMarket: React.FC<StepProps> = ({ onNavigate }) => (
  <div className="animate-fade-in text-center max-w-3xl mx-auto">
    <h2 className="text-2xl md:text-4xl font-display font-bold text-primary mb-6 md:mb-8">Ile czasu masz na zajmowanie się finansami i rynkami?</h2>
    <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12 text-left">
      <button onClick={() => onNavigate('step3-risk', 75)} className={`${cardStyle} border-emerald-100 hover:border-emerald-500 shadow-lg shadow-emerald-100/40 hover:shadow-xl hover:shadow-emerald-200/50`}>
        <i className="fas fa-hourglass-half absolute -bottom-5 -right-5 text-8xl md:text-9xl text-emerald-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-primary mb-2">Mam mało czasu na zajmowanie się finansami</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Wybieram strategię pasywną (ETF/Fundusze Indeksowe). Chcę "ustawić i zapomnieć".</p>
        </div>
      </button>
      <button onClick={() => onNavigate('result-active', 100)} className={`${cardStyle} border-orange-100 hover:border-orange-500 shadow-lg shadow-orange-100/40 hover:shadow-xl hover:shadow-orange-200/50`}>
          <i className="fas fa-search-dollar absolute -bottom-5 -right-5 text-8xl md:text-9xl text-orange-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-primary mb-2">Chcę i mogę poświęcać czas na finanse</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Interesuję się rynkiem. Chcę samodzielnie dobierać spółki do portfela.</p>
        </div>
      </button>
    </div>
  </div>
);

export const StepRisk: React.FC<StepProps> = ({ onNavigate }) => (
  <div className="animate-fade-in text-center max-w-xl mx-auto">
    <h2 className="text-2xl md:text-4xl font-display font-bold text-primary mb-6 md:mb-8">Test Emocji</h2>
    <p className="text-gray-600 mb-8 md:mb-12">Inwestycje tracą 25%. Co robisz?</p>
    <div className="space-y-4">
      <button onClick={() => onNavigate('result-mix', 100)} className={`${cardStyle} border-red-100 hover:border-red-500 shadow-lg shadow-red-100/40 hover:shadow-xl hover:shadow-red-200/50`}>
        <i className="fas fa-face-angry absolute -bottom-5 -right-5 text-8xl md:text-9xl text-red-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <strong className="block text-primary text-lg md:text-xl mb-2">Denerwuję się...</strong>
          <span className="text-sm text-gray-500 leading-relaxed">...ale nie chcę rezygnować z zysków całkowicie. Szukam złotego środka.</span>
        </div>
      </button>
      <button onClick={() => onNavigate('result-etf', 100)} className={`${cardStyle} border-emerald-100 hover:border-emerald-500 shadow-lg shadow-emerald-100/40 hover:shadow-xl hover:shadow-emerald-200/50`}>
        <i className="fas fa-chart-line absolute -bottom-5 -right-5 text-8xl md:text-9xl text-emerald-50 opacity-50 transition-transform duration-500"></i>
        <div className="relative z-10">
          <strong className="block text-primary text-lg md:text-xl mb-2">Spokojnie trzymam dalej</strong>
          <span className="text-sm text-gray-500 leading-relaxed">Rozumiem, że rynek faluje, a w długim terminie zakładam, że rośnie. Dokupuję.</span>
        </div>
      </button>
    </div>
  </div>
);