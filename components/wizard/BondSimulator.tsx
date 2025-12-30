import React, { useState, useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  Line
} from 'recharts';

interface BondSimulatorProps {
  defaultMargin?: number;
  defaultFirstYear?: number;
  title?: string;
  onScrollToPurchase?: () => void;
  variant?: 'green' | 'blue';
}

const BondSimulator: React.FC<BondSimulatorProps> = ({ 
  defaultMargin = 2, 
  defaultFirstYear = 5.85,
  title = "Symulator Twoich obligacji", 
  onScrollToPurchase,
  variant = 'green'
}) => {
  const [margin, setMargin] = useState(defaultMargin);
  const [inflation, setInflation] = useState(2.5);
  const [firstYearRate, setFirstYearRate] = useState(defaultFirstYear);
  const monthlyDeposit = 800;
  const years = 18;

  const data = useMemo(() => {
    const points = [{ year: '0 l.', nominal: 0, invested: 0 }];
    let currentBalance = 0;

    for (let y = 1; y <= years; y++) {
      const yearRate = y === 1 ? firstYearRate : (inflation + margin);
      const monthlyRate = yearRate / 100 / 12;

      for (let m = 0; m < 12; m++) {
        currentBalance += monthlyDeposit; 
        currentBalance *= (1 + monthlyRate);
      }

      points.push({
        year: `${y} l.`,
        nominal: Math.round(currentBalance),
        invested: monthlyDeposit * 12 * y
      });
    }
    return points;
  }, [margin, inflation, firstYearRate]);

  const finalNominal = data[data.length - 1].nominal;
  const totalDeposited = monthlyDeposit * 12 * years;
  const profit = finalNominal - totalDeposited;

  const formatPLN = (val: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(val);

  // Styles based on variant
  const isBlue = variant === 'blue';
  const mainColor = isBlue ? '#2563EB' : '#33C18C'; // blue-600 : accent
  const styles = {
    icon: isBlue ? 'text-blue-600' : 'text-accent',
    bgLight: isBlue ? 'bg-blue-50' : 'bg-accent/10',
    borderLight: isBlue ? 'border-blue-100' : 'border-accent/20',
    slider: isBlue ? 'accent-blue-600' : 'accent-accent',
    textMain: isBlue ? 'text-blue-600' : 'text-accent',
    bgFooter: isBlue ? 'bg-blue-50/50' : 'bg-accent/5',
    borderFooter: isBlue ? 'border-blue-100' : 'border-accent/10',
    badge: isBlue ? 'text-blue-600 bg-blue-100' : 'text-accent bg-accent/10',
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden mb-10 text-left animate-fade-in relative">
      <div className="p-6 md:p-8 border-b border-gray-50 bg-bgLight/50 relative z-10">
        <h3 className="font-display font-bold text-xl text-primary mb-6 flex items-start gap-3">
          <i className={`fas fa-calculator ${styles.icon} mt-1`}></i>
          <span>{title}</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-6 mb-8 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
                <span>Oprocentowanie w pierwszym roku</span>
                <span className={`${styles.badge} px-3 py-1 rounded-full`}>{firstYearRate.toFixed(2)}%</span>
              </label>
              <input 
                type="range" min="0" max="10" step="0.05" 
                value={firstYearRate} 
                onChange={(e) => setFirstYearRate(parseFloat(e.target.value))}
                className={`w-full ${styles.slider}`}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
                <span>Marża (kolejne lata)</span>
                <span className={`${styles.badge} px-3 py-1 rounded-full`}>{margin.toFixed(2)}%</span>
              </label>
              <input 
                type="range" min="0" max="5" step="0.05" 
                value={margin} 
                onChange={(e) => setMargin(parseFloat(e.target.value))}
                className={`w-full ${styles.slider}`}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
                <span>Zakładana inflacja (średnia)</span>
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{inflation.toFixed(1)}%</span>
              </label>
              <input 
                type="range" min="0" max="15" step="0.5" 
                value={inflation} 
                onChange={(e) => setInflation(parseFloat(e.target.value))}
                className="w-full accent-gray-400"
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
             <div className="absolute right-2 bottom-2 opacity-10"><i className="fas fa-wallet text-4xl"></i></div>
            <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Suma wpłat (Kapitał)</span>
            <span className="text-xl font-bold text-gray-600 block">{formatPLN(totalDeposited)}</span>
          </div>
          <div className={`${styles.bgLight} p-5 rounded-2xl border ${styles.borderLight} shadow-sm flex flex-col justify-center relative overflow-hidden`}>
             <div className="absolute right-2 bottom-2 opacity-10"><i className="fas fa-coins text-4xl"></i></div>
            <span className={`text-xs uppercase font-bold ${styles.textMain} block mb-1`}>Kapitał z odsetkami</span>
            <span className={`text-xl font-bold ${styles.textMain} block`}>{formatPLN(finalNominal)}</span>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
             <div className="absolute right-2 bottom-2 opacity-10"><i className="fas fa-chart-line text-4xl text-emerald-600"></i></div>
            <span className="text-xs uppercase font-bold text-emerald-600 block mb-1">Zysk po 18l (przed podatkiem)</span>
            <span className="text-xl font-bold text-emerald-600 block">{formatPLN(profit)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 h-[300px] w-full bg-white">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={mainColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="year" fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
            <Tooltip 
              formatter={(value: number, name: string) => [formatPLN(value), name === 'nominal' ? 'Wartość razem' : 'Wpłacony kapitał']}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="nominal" 
              name="nominal" 
              stroke={mainColor} 
              fillOpacity={1} 
              fill="url(#colorNominal)" 
              strokeWidth={3} 
            />
            <Line 
              type="monotone" 
              dataKey="invested" 
              name="invested" 
              stroke="#9CA3AF" 
              strokeDasharray="5 5" 
              strokeWidth={2} 
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`p-6 ${styles.bgFooter} border-t ${styles.borderFooter} flex flex-col md:flex-row justify-between items-center gap-4`}>
        <p className="text-xs text-gray-500 leading-relaxed font-medium text-center md:text-left max-w-lg">
          <i className={`fas fa-info-circle ${styles.icon} mr-2`}></i>
          Mechanizm: W pierwszym roku zysk jest stały. W kolejnych latach zysk to: <span className="font-bold text-gray-700">inflacja + marża</span>.
        </p>
        {onScrollToPurchase && (
          <button 
            onClick={onScrollToPurchase}
            className="bg-primary text-white font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all px-6 py-3 rounded-full shadow-lg whitespace-nowrap"
          >
            Przejdź do zakupu <i className="fas fa-shopping-cart text-xs"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default BondSimulator;