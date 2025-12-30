import React, { useState, useMemo } from 'react';

const Calculator: React.FC = () => {
  const [age, setAge] = useState(0);
  const [deposit, setDeposit] = useState(800);
  const [rate, setRate] = useState(7);

  const results = useMemo(() => {
    const years = 18 - age;
    const months = years * 12;
    const r = rate / 100 / 12;
    
    let fv = 0;
    if (r > 0) {
      fv = deposit * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    } else {
      fv = deposit * months;
    }

    const totalDeposits = deposit * months;
    const totalInterest = fv - totalDeposits;

    const formatter = new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      maximumFractionDigits: 0
    });

    return {
      fv: formatter.format(fv),
      totalDeposits: formatter.format(totalDeposits),
      totalInterest: formatter.format(totalInterest),
      yearsInvesting: years
    };
  }, [age, deposit, rate]);

  return (
    <section className="pb-12 pt-2 bg-bgLight">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-primary">Kalkulator Przyszłości</h2>
          <p className="text-gray-600 mt-2">Sprawdź, ile możesz uzbierać do 18. urodzin dziecka.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="p-8 md:p-10 md:w-1/2 md:border-r border-gray-100 bg-white">
            <div className="mb-10">
              <label htmlFor="age-slider" className="block text-sm font-bold text-gray-700 mb-2">
                Wiek dziecka (teraz): <span className="text-primary text-xl font-display">{age} lat</span>
              </label>
              <input 
                id="age-slider"
                type="range" 
                min="0" max="17" 
                value={age} 
                onChange={(e) => setAge(parseInt(e.target.value))}
                aria-label="Wiek dziecka"
              />
              <p className="text-xs text-gray-400 mt-4 font-semibold uppercase tracking-wider">Czas inwestycji: {results.yearsInvesting} lat</p>
            </div>
            
            <div className="mb-10">
              <label htmlFor="deposit-slider" className="block text-sm font-bold text-gray-700 mb-2">
                Wpłata miesięczna: <span className="text-primary text-xl font-display">{deposit} zł</span>
              </label>
              <input 
                id="deposit-slider"
                type="range" 
                min="100" max="2000" step="50" 
                value={deposit} 
                onChange={(e) => setDeposit(parseInt(e.target.value))}
                aria-label="Miesięczna wpłata"
              />
            </div>

            <div className="mb-12 relative">
              <label htmlFor="rate-slider" className="block text-sm font-bold text-gray-700 mb-4">
                Zakładany zysk roczny: <span className="text-primary text-xl font-display">{rate.toFixed(1)}%</span>
              </label>
              <div className="relative w-full pb-8">
                <input 
                  id="rate-slider"
                  type="range" 
                  min="0" max="12" step="0.5" 
                  value={rate} 
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="relative z-10 w-full"
                  aria-label="Stopa zwrotu"
                />
                <div className="absolute top-2 w-0.5 h-3 bg-gray-200" style={{ left: '0%' }}></div>
                <div className="absolute top-8 text-[9px] uppercase tracking-widest text-gray-400 font-bold -translate-x-1/2" style={{ left: '0%' }}>skarpeta</div>
                
                <div className="absolute top-2 w-0.5 h-3 bg-gray-200" style={{ left: '33.3%' }}></div>
                <div className="absolute top-8 text-[9px] uppercase tracking-widest text-gray-400 font-bold -translate-x-1/2" style={{ left: '33.3%' }}>obligacje</div>
                
                <div className="absolute top-2 w-0.5 h-3 bg-gray-200" style={{ left: '58.3%' }}></div>
                <div className="absolute top-8 text-[9px] uppercase tracking-widest text-gray-400 font-bold -translate-x-1/2" style={{ left: '58.3%' }}>akcje</div>
                
                <div className="absolute top-2 w-0.5 h-3 bg-gray-200" style={{ left: '100%' }}></div>
                <div className="absolute top-8 text-[9px] uppercase tracking-widest text-gray-400 font-bold -translate-x-full text-right leading-tight" style={{ left: '100%' }}>
                  super<br className="sm:hidden" /> inwestor
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 md:w-1/2 bg-primary text-white flex flex-col justify-center text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 hero-pattern pointer-events-none"></div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Szacowany kapitał na start</p>
            <div className="text-5xl md:text-6xl font-display font-bold text-white mb-8 relative z-10 drop-shadow-md">{results.fv}</div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left space-y-4 relative z-10 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Twoje wpłaty:</span>
                <span className="font-bold">{results.totalDeposits}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-accent">
                <span className="font-bold text-sm">Zysk z inwestycji:</span>
                <span className="font-bold text-2xl">{results.totalInterest}</span>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-4 relative z-10 leading-relaxed italic opacity-80">
              * To tylko symulacja. Oprocentowanie i inflacja zmieniają się w czasie, a historyczny wynik giełdy (~7%) nie gwarantuje zysków w przyszłości.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;