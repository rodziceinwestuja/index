import React, { useState, useEffect } from 'react';
import { WizardStep } from './wizard/WizardTypes';
import { 
  StepApproach, 
  StepSafeCheck, 
  StepGrowthType, 
  StepGrowthMarket, 
  StepRisk 
} from './wizard/WizardSelectionSteps';
import ResultFamilyBonds from './wizard/results/ResultFamilyBonds';
import ResultStandardBonds from './wizard/results/ResultStandardBonds';
import ResultMetals from './wizard/results/ResultMetals';
import ResultMix from './wizard/results/ResultMix';
import ResultBrokers from './wizard/results/ResultBrokers';

interface InvestmentWizardProps {
  onBack: () => void;
}

const InvestmentWizard: React.FC<InvestmentWizardProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('step1');
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep]);

  const navigateTo = (step: WizardStep, p: number) => {
    setCurrentStep(step);
    setProgress(p);
  };

  const handleHeaderBack = () => {
    switch (currentStep) {
      case 'step1': onBack(); break;
      case 'step2-safe-bonds': navigateTo('step1', 10); break;
      case 'step2-growth-type': navigateTo('step1', 10); break;
      case 'step2-growth-market': navigateTo('step2-growth-type', 40); break;
      case 'step3-risk': navigateTo('step2-growth-market', 60); break;
      case 'result-family-bonds': navigateTo('step2-safe-bonds', 50); break;
      case 'result-standard-bonds': navigateTo('step2-safe-bonds', 50); break;
      case 'result-etf': navigateTo('step3-risk', 75); break;
      case 'result-active': navigateTo('step2-growth-market', 60); break;
      case 'result-mix': navigateTo('step3-risk', 75); break;
      case 'result-metals': navigateTo('step2-growth-type', 40); break;
      default: onBack();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in" key="wizard-root">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button onClick={handleHeaderBack} className="text-gray-400 hover:text-primary p-2 transition-colors flex items-center gap-2 font-bold group">
              <i className="fas fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
            </button>
          </div>
          <div className="text-center">
            <h1 className="font-display font-bold text-primary text-sm md:text-base">Kreator Inwestycji</h1>
          </div>
          <div className="flex justify-end">
            <button onClick={onBack} className="text-gray-400 hover:text-primary p-2 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-1.5 overflow-hidden">
          <div className="bg-accent h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 w-full">
          {/* 
            CRITICAL FIX: 
            1. Added key={currentStep} to force full unmount/mount on step change.
            2. Changed className from 'fade-in' to 'animate-fade-in' (Tailwind) to match App.tsx.
          */}
          <div key={currentStep} className="animate-fade-in w-full">
            {currentStep === 'step1' && <StepApproach onNavigate={navigateTo} />}
            {currentStep === 'step2-safe-bonds' && <StepSafeCheck onNavigate={navigateTo} />}
            {currentStep === 'step2-growth-type' && <StepGrowthType onNavigate={navigateTo} />}
            {currentStep === 'step2-growth-market' && <StepGrowthMarket onNavigate={navigateTo} />}
            {currentStep === 'step3-risk' && <StepRisk onNavigate={navigateTo} />}
            
            {currentStep === 'result-family-bonds' && <ResultFamilyBonds />}
            {currentStep === 'result-standard-bonds' && <ResultStandardBonds />}
            {currentStep === 'result-metals' && <ResultMetals />}
            {currentStep === 'result-mix' && <ResultMix />}
            {currentStep === 'result-etf' && <ResultBrokers variant="green" />}
            {currentStep === 'result-active' && <ResultBrokers variant="green" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentWizard;