import React from 'react';
import { Broker } from '../../types';

interface BrokerListProps {
  list: Broker[];
  title: string;
  id?: string;
  isHighlight?: boolean;
  variant?: 'green' | 'gold' | 'blue';
  actionLabel?: string;
}

const BrokerList: React.FC<BrokerListProps> = ({ 
  list, 
  title, 
  id, 
  isHighlight = false, 
  variant = 'green',
  actionLabel = "Otwórz konto"
}) => {
  const colorMap = {
    green: { 
      container: 'bg-emerald-50/60 border-emerald-100', 
      title: 'text-emerald-600', 
      iconBox: 'bg-emerald-100 text-emerald-600 shadow-emerald-100', 
      actionButton: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100',
      itemBorder: 'border-emerald-100',
      itemHoverBorder: 'hover:border-emerald-400',
      itemHoverBg: 'hover:bg-emerald-50/20',
      itemShadow: 'shadow-xl shadow-emerald-500/10',
      itemHoverShadow: 'hover:shadow-2xl hover:shadow-emerald-500/20',
      iconClass: 'fa-chart-line'
    },
    gold: { 
      container: 'bg-amber-50/60 border-amber-100', 
      title: 'text-amber-600', 
      iconBox: 'bg-amber-100 text-amber-600 shadow-amber-100', 
      actionButton: 'bg-amber-50 text-amber-700 group-hover:bg-amber-100',
      itemBorder: 'border-amber-100',
      itemHoverBorder: 'hover:border-amber-400',
      itemHoverBg: 'hover:bg-amber-50/20',
      itemShadow: 'shadow-xl shadow-amber-500/10',
      itemHoverShadow: 'hover:shadow-2xl hover:shadow-amber-500/20',
      iconClass: 'fa-coins'
    },
    blue: { 
      container: 'bg-blue-50/60 border-blue-100', 
      title: 'text-blue-600', 
      iconBox: 'bg-blue-100 text-blue-600 shadow-blue-100', 
      actionButton: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100',
      itemBorder: 'border-blue-100',
      itemHoverBorder: 'hover:border-blue-400',
      itemHoverBg: 'hover:bg-blue-50/20',
      itemShadow: 'shadow-xl shadow-blue-500/10',
      itemHoverShadow: 'hover:shadow-2xl hover:shadow-blue-500/20',
      iconClass: 'fa-university'
    }
  };
  const colors = colorMap[variant];

  return (
    <div className={`w-full scroll-mt-24 ${isHighlight ? `p-6 md:p-8 rounded-[40px] border ${colors.container} shadow-2xl ${colors.itemShadow.replace('500/10', '500/20')}` : ''}`} id={id}>
      <p className={`text-sm font-bold uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-2 ${isHighlight ? colors.title : 'text-gray-400'}`}>
        {isHighlight && <i className="fas fa-shopping-bag"></i>} {title}
      </p>
      <div className="grid gap-6 max-w-2xl mx-auto">
        {list.map((b, idx) => {
          return (
            <a 
              key={idx} 
              href={b.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                flex items-center justify-between p-5 md:p-6 rounded-[24px] md:rounded-[28px] group border bg-white
                ${colors.itemBorder}
                ${colors.itemShadow}
                ${colors.itemHoverBorder}
                ${colors.itemHoverShadow}
                ${colors.itemHoverBg}
                hover-card-crisp
              `}
            >
              <div className="flex items-start gap-4 md:gap-5 flex-1 min-w-0">
                {/* IKONA INSTYTUCJI */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-sm transition-transform duration-300 ${colors.iconBox}`}>
                  <i className={`fas ${colors.iconClass} text-xl md:text-2xl`}></i>
                </div>
                
                <div className="text-left min-w-0">
                  <span className="block font-bold text-primary text-base md:text-lg leading-tight mb-2 break-words">{b.name}</span>
                  <span className="block text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">{b.desc}</span>
                </div>
              </div>

              {/* PRZYCISK AKCJI - tylko zmiana koloru, bez ruchu */}
              <div className={`
                flex items-center gap-2 font-bold text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-xl ml-2 shrink-0 self-center shadow-sm
                transition-colors duration-300 ease-out
                ${colors.actionButton}
              `}>
                <span className="hidden md:inline whitespace-nowrap">{actionLabel}</span>
                <span className="md:hidden">Otwórz</span>
                <i className="fas fa-chevron-right text-[10px] md:text-xs"></i>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default BrokerList;