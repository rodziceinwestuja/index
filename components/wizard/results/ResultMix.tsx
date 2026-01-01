import React, { useState, useEffect } from 'react';
import ProvidersModal, { ProviderType } from '../../ProvidersModal';

const ResultMix: React.FC = () => {
  const [modalType, setModalType] = useState<ProviderType>(null);
  const [safetySlider, setSafetySlider] = useState(40); // Default 40% Safety (Bonds) => 60% Stocks (Classic 60/40)
  const [includeGold, setIncludeGold] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number | string>(800);
  const [isMounted, setIsMounted] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Logic calculation
  const goldPct = includeGold ? 10 : 0;
  const remainder = 100 - goldPct;
  
  // Calculate shares based on remainder
  const bondPct = Math.round((safetySlider / 100) * remainder);
  const stockPct = remainder - bondPct;

  const numericAmount = typeof investmentAmount === 'string' ? (investmentAmount === '' ? 0 : parseInt(investmentAmount)) : investmentAmount;

  const calculateAmount = (pct: number) => {
    if (pct === 0) return 0;
    const val = (numericAmount * pct) / 100;
    return Math.round(val / 10) * 10;
  };

  const stockAmount = calculateAmount(stockPct);
  const bondAmount = calculateAmount(bondPct);
  const goldAmount = calculateAmount(goldPct);

  // Helper to generate dynamic styles based on activity
  const getCardStyle = (isActive: boolean, variant: 'emerald' | 'blue' | 'amber') => {
    const colorClasses = {
      emerald: 'border-emerald-100 shadow-emerald-100/40 hover:border-emerald-300 hover:shadow-emerald-200/50',
      blue: 'border-blue-100 shadow-blue-100/40 hover:border-blue-300 hover:shadow-blue-200/50',
      amber: 'border-amber-100 shadow-amber-100/40 hover:border-amber-300 hover:shadow-amber-200/50',
    };

    if (isActive) {
      return `w-full text-left bg-white p-6 rounded-3xl border shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full relative overflow-hidden group cursor-pointer active:opacity-95 opacity-100 scale-100 ${colorClasses[variant]}`;
    } else {
      // Inactive State: Grayscale, Faded, Non-interactive, Slightly smaller
      return `w-full text-left bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-none transition-all duration-300 ease-out flex flex-col h-full relative overflow-hidden cursor-not-allowed opacity-40 grayscale scale-95`;
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="text-center mb-6">
        <span className="bg-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Twoja Strategia</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mt-6 mb-2">Portfel Hybrydowy</h2>
        <p className="text-gray-500 text-sm md:text-base mt-2">
            Dopasuj proporcje do swoich <span className="tooltip-term font-bold text-gray-600 border-b-2 border-dotted border-gray-400 cursor-help" data-tip="Ryzyko w czasie hossy jest pożądane, bo buduje zysk. Obligacje dają schronienie w gorszych czasach. To właśnie dywersyfikacja.">nerwów</span> (standard to 60/40).
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 mb-8 relative z-20 max-w-4xl mx-auto">
        
        {/* Investment Amount Input */}
        <div className="flex justify-center mb-8">
            <div className="bg-gray-50 rounded-2xl p-3 md:p-4 border border-gray-100 flex flex-col items-center min-w-[200px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kwota do podziału</label>
                <div className="flex items-center gap-1 relative">
                    <input 
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min="0"
                        value={investmentAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setInvestmentAmount('');
                          } else {
                            const num = parseInt(val);
                            if (num >= 0 && num <= 1000000) {
                              setInvestmentAmount(num);
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        step="50"
                        className="text-2xl md:text-3xl font-bold text-primary bg-transparent text-center w-28 outline-none border-b-2 border-dashed border-gray-300 focus:border-accent transition-colors p-0 m-0"
                    />
                    <span className="text-lg md:text-xl font-bold text-gray-400">PLN</span>
                    <i className="fas fa-pen text-xs text-gray-300 absolute -right-4 top-2"></i>
                </div>
            </div>
        </div>
        
        {/* Live Stats Row */}
        <div className="flex justify-between items-end mb-6 select-none relative">
            <div className={`text-left group cursor-default w-1/3 transition-opacity duration-500 ${stockPct === 0 ? 'opacity-30' : 'opacity-100'}`}>
                <div className="mb-1">
                     <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Akcje / ETF</span>
                </div>
                {/* Zmniejszono z text-4xl md:text-5xl na text-3xl md:text-4xl */}
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 leading-none transition-all tabular-nums tracking-tight mb-1">{stockPct}%</div>
                <div className="inline-block bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg text-sm border border-emerald-100">
                    {stockAmount} zł
                </div>
            </div>
            
            {/* Gold Stats */}
            <div className={`text-center absolute left-1/2 -translate-x-1/2 bottom-0 animate-fade-in w-1/3 flex flex-col items-center justify-end h-full pb-1 transition-all duration-500 ${includeGold ? 'opacity-100 transform-none' : 'opacity-30 grayscale'}`}>
                <div className="hidden sm:flex items-center justify-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kruszce</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-amber-500 leading-none tabular-nums mb-1">{goldPct}%</div>
                <div className="inline-block bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-lg text-xs md:text-sm border border-amber-100 whitespace-nowrap">
                    {goldAmount} zł
                </div>
            </div>

            <div className={`text-right group cursor-default w-1/3 ml-auto transition-opacity duration-500 ${bondPct === 0 ? 'opacity-30' : 'opacity-100'}`}>
                <div className="mb-1">
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Obligacje</span>
                </div>
                {/* Zmniejszono z text-4xl md:text-5xl na text-3xl md:text-4xl */}
                <div className="text-3xl md:text-4xl font-bold text-blue-600 leading-none transition-all tabular-nums tracking-tight mb-1">{bondPct}%</div>
                <div className="inline-block bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-lg text-sm border border-blue-100">
                    {bondAmount} zł
                </div>
            </div>
        </div>

        {/* Visual Bar */}
        <div className="h-4 md:h-6 w-full rounded-full bg-gray-100 overflow-hidden flex mb-8 shadow-inner ring-1 ring-gray-200/50">
             <div style={{ width: isMounted ? `${stockPct}%` : '0%' }} className="h-full bg-emerald-500 transition-all duration-1000 ease-out relative"></div>
             {includeGold && <div style={{ width: isMounted ? `${goldPct}%` : '0%' }} className="h-full bg-amber-500 transition-all duration-1000 ease-out"></div>}
             <div style={{ width: isMounted ? `${bondPct}%` : '0%' }} className="h-full bg-blue-500 transition-all duration-1000 ease-out"></div>
        </div>

        {/* Slider Controls */}
        <div className="mb-8 px-1">
            <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                value={safetySlider} 
                onChange={(e) => setSafetySlider(parseInt(e.target.value))}
                className="w-full h-8 bg-transparent rounded-lg appearance-none cursor-pointer relative z-10 touch-none"
                aria-label="Suwak proporcji portfela"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-widest px-1">
                <span>Ryzykowny</span>
                <span>Bezpieczny</span>
            </div>
        </div>

        {/* Bottom Options Row */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-t border-gray-100 pt-6">
            <div 
                onClick={() => setIncludeGold(!includeGold)}
                className={`
                    flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none w-full md:w-auto
                    ${includeGold ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${includeGold ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                    <i className="fas fa-coins"></i>
                </div>
                <div className="flex-1">
                    <span className={`block font-bold text-sm leading-tight ${includeGold ? 'text-amber-800' : 'text-gray-600'}`}>Złoto (10%)</span>
                    <span className="text-[10px] text-gray-400">Dodatek dywersyfikujący</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${includeGold ? 'bg-amber-500 justify-end' : 'bg-gray-200 justify-start'}`}>
                    <div className="bg-white w-4 h-4 rounded-full shadow-sm"></div>
                </div>
            </div>
        </div>
      </div>

      {/* 
         Dynamic Cards Grid 
         Uses Flexbox to maintain equal widths.
         All 3 slots are ALWAYS rendered to prevent layout jumps.
         Inactive slots just change visual state.
      */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch justify-center">
        
        {/* ETF Card (Stocks) - LEFT */}
        <div className="flex-1 min-w-0">
            <button 
                onClick={() => setModalType('etf')} 
                disabled={stockPct === 0}
                className={getCardStyle(stockPct > 0, 'emerald')}
            >
                <i className="fas fa-chart-line absolute -bottom-5 -right-5 text-8xl md:text-8xl text-emerald-50 opacity-40 transition-transform pointer-events-none"></i>
                
                <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                    <div className="max-w-[65%]">
                        <h3 className="text-lg font-bold text-primary leading-tight mb-2">ETF Globalny</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Silnik wzrostu. Inwestycja w największe światowe firmy dla maksymalizacji zysku.
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="block text-3xl font-bold text-emerald-600">{stockPct}%</span>
                        <span className="block text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md mt-1">{stockAmount} zł</span>
                    </div>
                </div>
                
                <div className="mt-auto w-full bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl group-hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 text-sm relative z-10">
                        Gdzie kupić <i className="fas fa-chevron-right text-xs"></i>
                </div>
            </button>
        </div>
        
        {/* Bonds Card (Safety) - RIGHT/MIDDLE */}
        <div className="flex-1 min-w-0">
            <button 
                onClick={() => setModalType('bonds-standard')} 
                disabled={bondPct === 0}
                className={getCardStyle(bondPct > 0, 'blue')}
            >
                <i className="fas fa-shield-alt absolute -bottom-5 -right-5 text-8xl md:text-8xl text-blue-50 opacity-50 transition-transform pointer-events-none"></i>

                <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                    <div className="max-w-[65%]">
                        <h3 className="text-lg font-bold text-primary leading-tight mb-2">Obligacje</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Fundament bezpieczeństwa. Chroni przed inflacją i zapewnia stabilność portfela.
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="block text-3xl font-bold text-blue-600">{bondPct}%</span>
                        <span className="block text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md mt-1">{bondAmount} zł</span>
                    </div>
                </div>
                
                <div className="mt-auto w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl group-hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm relative z-10">
                        Gdzie kupić <i className="fas fa-chevron-right text-xs"></i>
                </div>
            </button>
        </div>

        {/* Gold Card (Conditional Content, Fixed Slot) */}
        <div className="flex-1 min-w-0">
            <button 
                onClick={() => setModalType('metals')}
                disabled={!includeGold}
                className={getCardStyle(includeGold, 'amber')}
            >
                <i className="fas fa-coins absolute -bottom-5 -right-5 text-8xl md:text-8xl text-amber-50 opacity-50 transition-transform pointer-events-none"></i>

                <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                    <div className="max-w-[65%]">
                        <h3 className="text-lg font-bold text-primary leading-tight mb-2">Złoto / Srebro</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Ubezpieczenie. Wartość, która przetrwa każdy kryzys.
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="block text-3xl font-bold text-amber-600">{goldPct}%</span>
                        <span className="block text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md mt-1">{goldAmount} zł</span>
                    </div>
                </div>
                
                <div className="mt-auto w-full bg-amber-50 text-amber-600 font-bold py-3 rounded-xl group-hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 text-sm relative z-10">
                        Gdzie kupić <i className="fas fa-chevron-right text-xs"></i>
                </div>
            </button>
        </div>

      </div>
      
      <ProvidersModal 
        isOpen={!!modalType} 
        type={modalType} 
        onClose={() => setModalType(null)} 
      />
    </div>
  );
};

export default ResultMix;
