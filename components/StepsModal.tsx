import React, { useState, useEffect } from 'react';

interface StepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWizard: () => void;
}

const steps = [
  {
    title: "Budżet to fundament",
    description: "Zanim zaczniesz, ustal kwotę, którą możesz co miesiąc zainwestować w przyszłość swojego dziecka. Może to być 100 zł, a może całe 800+.",
    tip: "Kluczem nie jest duża kwota, ale regularność. Nawet 100 zł miesięcznie dzięki magii procentu składanego (zobacz kalkulator) po 18 latach zamieni się w konkretny kapitał.",
    icon: "fa-piggy-bank"
  },
  {
    title: "Twój komfort psychiczny",
    description: "Zdecyduj, co jest ważniejsze: absolutny brak ryzyka i ochrona przed inflacją czy szansa na większy zysk, ale przy akceptacji większego ryzyka.",
    tip: "Pamiętaj, inwestujesz w długim horyzoncie, to maraton, a nie sprint.",
    icon: "fa-heart"
  },
  {
    title: "Wybór inwestycji",
    description: "Dla ceniących spokój: obligacje. Dla szukających wzrostu: tanie fundusze ETF na cały świat lub fundusze indeksowe / złoto / srebro czy indywidualne akcje",
    tip: "Alternatywnie złoto czy srebro fizyczne w formie monet bulionowych lub małych sztabek to świetny sposób na fizyczne przekazanie majątku dziecku w przyszłości.",
    icon: "fa-drafting-compass"
  },
  {
    title: "Działaj regularnie",
    description: "Otwórz konto i co najważniejsze – inwestuj regularnie.",
    tip: "Twoim największym sprzymierzeńcem jest czas i procent składany. Pamiętaj o tym i nie poddawaj się. Robisz to dla swojego dziecka.",
    icon: "fa-magic"
  }
];

const StepsModal: React.FC<StepsModalProps> = ({ isOpen, onClose, onOpenWizard }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isRendered, setIsRendered] = useState(false);

  // Handle animation lifecycle
  useEffect(() => {
    if (isOpen) setIsRendered(true);
    else setTimeout(() => setIsRendered(false), 300); // Wait for fade out
  }, [isOpen]);

  if (!isRendered) return null;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setDirection('next');
      setActiveStep(activeStep + 1);
    } else {
      onClose();
      onOpenWizard();
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setDirection('prev');
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (index === activeStep) return;
    setDirection(index > activeStep ? 'next' : 'prev');
    setActiveStep(index);
  };

  const progressPercent = ((activeStep + 1) / steps.length) * 100;
  const animationClass = direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  // Animation classes for the modal container itself
  // Mobile: slide-up from bottom. Desktop: fade-in centered.
  const modalEntryAnimation = isOpen 
    ? 'animate-slide-up md:animate-fade-in' 
    : 'animate-slide-down md:animate-fade-out';

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>

      {/* 
        Modal Panel (Bottom Sheet style on Mobile) 
        - rounded-t-[32px] for mobile bottom sheet look
        - rounded-[32px] for desktop modal look
      */}
      <div className={`
        bg-white w-full max-w-xl 
        rounded-t-[32px] md:rounded-[32px] 
        shadow-2xl overflow-hidden flex flex-col 
        pointer-events-auto relative z-10
        ${modalEntryAnimation}
      `}>
        
        {/* Header */}
        <div className="bg-bgLight p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-display font-bold text-primary">Krok po kroku</h2>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary flex items-center justify-center transition-colors shadow-sm"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Progress Bar & Stepper */}
          <div className="relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
            <div className="relative flex justify-between">
              {steps.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 cursor-pointer focus:outline-none ${
                    index <= activeStep 
                        ? 'bg-accent text-white scale-110 shadow-md ring-4 ring-bgLight' 
                        : 'bg-white text-gray-400 border-2 border-gray-200 hover:border-accent hover:text-accent'
                  }`}
                  aria-label={`Przejdź do kroku ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 
            FIXED HEIGHT CONTAINER (h-[400px])
            This effectively eliminates layout shifts.
            The content is centered vertically inside this fixed box.
        */}
        <div className="h-[400px] md:h-[380px] w-full relative overflow-hidden bg-white">
            <div 
                key={activeStep} 
                className={`w-full h-full flex flex-col justify-center px-8 md:px-12 text-center absolute inset-0 ${animationClass}`}
            >
                <div className="w-20 h-20 bg-accent/10 text-accent rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm flex-shrink-0">
                <i className={`fas ${steps[activeStep].icon} text-4xl`}></i>
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-4">{steps[activeStep].title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                {steps[activeStep].description}
                </p>
                <div className="bg-primary/5 p-4 rounded-2xl text-left border border-primary/10 flex gap-4 mx-auto w-full">
                <i className="fas fa-lightbulb text-accent mt-1 text-xl flex-shrink-0"></i>
                <p className="text-sm text-primary/80 leading-relaxed italic">
                    {steps[activeStep].tip}
                </p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center pb-8 md:pb-6">
          <button 
            onClick={handlePrev}
            className={`px-4 py-3 font-bold transition flex items-center gap-2 rounded-xl text-sm md:text-base ${
              activeStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
            }`}
            disabled={activeStep === 0}
          >
            <i className="fas fa-arrow-left text-xs"></i> Wstecz
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-primary hover:bg-opacity-95 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 group text-sm md:text-base"
          >
            {activeStep === steps.length - 1 ? 'Rozpocznij kreator' : 'Dalej'}
            <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepsModal;