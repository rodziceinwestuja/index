import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Line,
  ComposedChart
} from 'recharts';
import { ChartDataPoint } from '../types';

const ComparisonChart: React.FC = () => {
  const data = useMemo(() => {
    const points: ChartDataPoint[] = [];
    const monthlyPayment = 800;
    const yearsTotal = 18;
    const rateInvest = 0.07;
    const rateInflation = 0.025;

    for (let y = 0; y <= yearsTotal; y += 2) {
      const months = y * 12;
      const saved = monthlyPayment * months;
      
      let invested = 0;
      if (y > 0) {
        const r = rateInvest / 12;
        invested = monthlyPayment * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      } else {
        invested = 0;
      }

      const realValue = saved / Math.pow(1 + rateInflation, y);

      points.push({
        name: `${y} l.`,
        invested: Math.round(invested),
        saved: Math.round(saved),
        realValue: Math.round(realValue),
      });
    }
    return points;
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ADDED min-w-0 to fix Recharts width calculation in flex container */}
      <div className="h-[280px] md:h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              fontSize={11} 
              tick={{ fill: '#9CA3AF' }} 
              interval={0}
              dy={10}
            />
            <YAxis 
              fontSize={11} 
              tick={{ fill: '#9CA3AF' }} 
              tickFormatter={(val) => `${val/1000}k`} 
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="invested" 
              name="Inwestycja (7%)" 
              stroke="#33C18C" 
              fill="#33C18C" 
              fillOpacity={0.1} 
              strokeWidth={3} 
            />
            <Line 
              type="monotone" 
              dataKey="saved" 
              name="Skarbonka (0%)" 
              stroke="#9CA3AF" 
              strokeDasharray="5 5" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
            />
            <Line 
              type="monotone" 
              dataKey="realValue" 
              name="Wartość realna (-2.5%)" 
              stroke="#EF4444" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom HTML Legend to prevent text overlapping */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4 text-xs md:text-sm text-gray-600">
          {[
            { dotClass: 'bg-accent', label: 'Inwestycja (7%)' },
            { dotClass: 'bg-gray-400', label: 'Skarbonka (0%)' },
            { dotClass: 'bg-red-500', label: 'Wartość realna (-2.5%)' },
          ].map((entry) => (
            <div key={entry.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${entry.dotClass}`}></span>
              <span className="font-semibold">{entry.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ComparisonChart;