import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { LIMITS } from '../constants';

interface TaxSimulatorProps {
    customIkzeLimit?: number;
}

const TaxSimulator: React.FC<TaxSimulatorProps> = ({ customIkzeLimit }) => {
  const [mode, setMode] = useState<'IKE' | 'IKZE'>('IKE');

  const actualIkzeLimit = customIkzeLimit ?? LIMITS.IKZE;

  const [years, setYears] = useState(20);
  const [ikeContribution, setIkeContribution] = useState(LIMITS.IKE);
  const [ikzeContribution, setIkzeContribution] = useState(actualIkzeLimit);
  const [returnRate, setReturnRate] = useState(7);

  const [taxBracket, setTaxBracket] = useState<12 | 32>(12);

  const currentLimit = mode === 'IKE' ? LIMITS.IKE : actualIkzeLimit;
  const annualContribution = mode === 'IKE' ? ikeContribution : ikzeContribution;
  const setAnnualContribution = (value: number) => {
    if (mode === 'IKE') setIkeContribution(value);
    else setIkzeContribution(value);
  };

  // Clamp the IKZE contribution if the limit changes (e.g. self-employed toggle).
  useEffect(() => {
    setIkzeContribution((prev) => Math.min(prev, actualIkzeLimit));
  }, [actualIkzeLimit]);

  const data = useMemo(() => {
    // Formula for Annuity Due (Wpłata na początku roku)
    // FV = P * ( ( (1+r)^n - 1 ) / r ) * (1+r)
    // P = annualContribution
    // r = annual rate
    // n = years
    
    const r = returnRate / 100;
    
    let fv = 0;
    if (r > 0) {
      fv = annualContribution * ((Math.pow(1 + r, years) - 1) / r) * (1 + r);
    } else {
      fv = annualContribution * years;
    }

    const totalInvested = annualContribution * years;
    const totalProfit = fv - totalInvested;

    // IKE Logic (Capital Gains Tax Shield)
    if (mode === 'IKE') {
        const belkaTax = totalProfit * 0.19;
        return {
            mainValue: Math.round(fv),
            secondaryValue: Math.round(fv - belkaTax), // Normal account
            benefit: Math.round(belkaTax),
            labelMain: 'IKE (0% podatku)',
            labelSecondary: 'Zwykłe konto',
            benefitLabel: 'Zaoszczędzony Podatek Belki'
        };
    } 
    // IKZE Logic (Income Tax Shield)
    else {
        // Benefit is the tax return you get EACH YEAR.
        // Simplified: Sum of tax returns over years (not reinvested in this simple view, just cash in pocket)
        const totalTaxReturn = totalInvested * (taxBracket / 100);
        
        // At the end of IKZE you pay 10% flat tax on the WHOLE amount
        const ikzeExitTax = fv * 0.10;
        const netIkze = fv - ikzeExitTax;

        // On normal account you pay 19% on PROFIT
        const normalExitTax = totalProfit * 0.19;
        const netNormal = fv - normalExitTax;

        // Real benefit = (Net IKZE + Cash returns) - Net Normal
        const totalBenefit = (netIkze + totalTaxReturn) - netNormal;

        return {
            mainValue: Math.round(netIkze + totalTaxReturn),
            secondaryValue: Math.round(netNormal),
            benefit: Math.round(totalBenefit),
            labelMain: 'IKZE (zysk + zwroty z PIT)',
            labelSecondary: 'Zwykłe konto',
            benefitLabel: 'Korzyść łącznie (Zwroty PIT - ryczałt 10%)'
        };
    }

  }, [years, annualContribution, returnRate, mode, taxBracket]);

  const chartData = [
    {
      name: data.labelSecondary,
      value: data.secondaryValue,
      benefit: 0,
      color: '#9CA3AF' // gray
    },
    {
      name: mode === 'IKE' ? 'Twoje IKE' : 'Twoje IKZE',
      value: data.secondaryValue, // base
      benefit: data.benefit, // stacked benefit
      color: mode === 'IKE' ? '#8B5CF6' : '#F59E0B' // violet for IKE, amber for IKZE
    }
  ];

  const formatPLN = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);
  
  // Dynamic Styles
  const accentText = mode === 'IKE' ? 'text-purple-600' : 'text-amber-600';
  const contributionInputId = `${mode.toLowerCase()}-annual-contribution`;
  const yearsInputId = `${mode.toLowerCase()}-years`;
  const returnInputId = `${mode.toLowerCase()}-return-rate`;
  const sliderClass = mode === 'IKE' ? 'range-purple' : 'range-amber';

  return (
    <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
      {/* Controls */}
      <div className={`p-6 md:p-8 lg:w-5/12 border-r border-gray-100 flex flex-col justify-center ${mode === 'IKE' ? 'bg-purple-50/50' : 'bg-amber-50/50'}`}>
        
        {/* Switcher */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-8">
            <button type="button" 
                onClick={() => setMode('IKE')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'IKE' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                IKE
            </button>
            <button type="button" 
                onClick={() => setMode('IKZE')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'IKZE' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                IKZE
            </button>
        </div>

        <h3 className={`font-display font-bold text-xl mb-6 ${mode === 'IKE' ? 'text-purple-900' : 'text-amber-900'}`}>
            {mode === 'IKE' ? 'Symulacja (Wpłata Roczna)' : 'Symulacja (Wpłata Roczna)'}
        </h3>
        
        <div className="space-y-8">
            <div>
              <label htmlFor={contributionInputId} className="block text-sm font-bold text-gray-600 mb-2 flex justify-between items-end">
                <span>Roczna wpłata:</span>
                <span className={`${accentText} text-xl font-display`}>{formatPLN(annualContribution)}</span>
              </label>
              <input 
                id={contributionInputId}
                aria-label="Roczna wpłata"
                title="Roczna wpłata"
                type="range" min="1000" max={currentLimit} step="100"
                value={annualContribution} 
                onChange={(e) => setAnnualContribution(parseInt(e.target.value))}
                className={`w-full ${mode === 'IKE' ? 'accent-purple-600' : 'accent-amber-500'} ${sliderClass}`}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">
                  <span>1 000 zł</span>
                  <span>Limit: {formatPLN(currentLimit)}</span>
              </div>
            </div>

            <div>
              <label htmlFor={yearsInputId} className="block text-sm font-bold text-gray-600 mb-2 flex justify-between items-end">
                <span>Czas oszczędzania:</span>
                <span className={`${accentText} text-xl font-display`}>{years} lat</span>
              </label>
              <input 
                id={yearsInputId}
                aria-label="Czas oszczędzania"
                title="Czas oszczędzania"
                type="range" min="5" max="40" step="1"
                value={years} 
                onChange={(e) => setYears(parseInt(e.target.value))}
                className={`w-full ${mode === 'IKE' ? 'accent-purple-600' : 'accent-amber-500'} ${sliderClass}`}
              />
            </div>

            <div>
              <label htmlFor={returnInputId} className="block text-sm font-bold text-gray-600 mb-2 flex justify-between items-end">
                <span>Średni zysk roczny:</span>
                <span className={`${accentText} text-xl font-display`}>{returnRate}%</span>
              </label>
              <input 
                id={returnInputId}
                aria-label="Średni zysk roczny"
                title="Średni zysk roczny"
                type="range" min="2" max="12" step="0.5"
                value={returnRate} 
                onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                className={`w-full ${mode === 'IKE' ? 'accent-purple-600' : 'accent-amber-500'} ${sliderClass}`}
              />
            </div>

            {mode === 'IKZE' && (
                 <div className="bg-white/50 p-4 rounded-2xl border border-amber-200/50">
                 <label className="block text-sm font-bold text-gray-600 mb-3">Twój próg podatkowy (PIT)</label>
                 <div className="flex gap-2">
                     <button type="button" 
                        onClick={() => setTaxBracket(12)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-all whitespace-nowrap ${taxBracket === 12 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-200 text-gray-500'}`}
                     >
                         12% (I próg)
                     </button>
                     <button type="button" 
                        onClick={() => setTaxBracket(32)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-all whitespace-nowrap ${taxBracket === 32 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-200 text-gray-500'}`}
                     >
                         32% (II próg)
                     </button>
                 </div>
                 <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                     *Co roku odzyskujesz {taxBracket}% wpłaty ({formatPLN(annualContribution * taxBracket / 100)}). W tej symulacji kwota ta jest Twoim "ekstra" zyskiem w kieszeni.
                 </p>
               </div>
            )}
        </div>
      </div>

      {/* Results & Chart */}
      <div className="p-8 lg:w-7/12 flex flex-col items-center justify-center relative bg-white">
        <div className="absolute top-4 right-6 text-right z-10">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{data.benefitLabel}</span>
             <span className={`text-3xl md:text-4xl font-display font-bold ${accentText}`}>{formatPLN(data.benefit)}</span>
        </div>

        <div className="w-full h-[320px] mt-12 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={60} margin={{top: 20}}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#4B5563', fontWeight: 600}} dy={10} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}
                        formatter={(value: number) => formatPLN(value)}
                    />
                    <Bar dataKey="value" stackId="a" fill="#E5E7EB" name="Podstawa (Netto)" />
                    <Bar dataKey="benefit" stackId="a" fill="#8B5CF6" name="Korzyść" radius={[10, 10, 0, 0]}>
                        {
                            chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-8 text-center px-4">
            {mode === 'IKE' ? (
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                    Wpłacając <strong>rocznie</strong> limit, maksymalizujesz efekt procentu składanego. Podatek 19% zostaje w Twojej kieszeni.
                </p>
            ) : (
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                    Przy IKZE kluczem jest zwrot podatku "tu i teraz". Płacisz ryczałt 10% na końcu, ale przez lata obracasz większym kapitałem (dzięki zwrotom).
                </p>
            )}
            <p className="text-xs text-gray-300 mt-4 italic">
                * Symulacja zakłada wpłatę jednorazową na początku każdego roku (Annuity Due).
            </p>
        </div>
      </div>
    </div>
  );
};

export default TaxSimulator;
