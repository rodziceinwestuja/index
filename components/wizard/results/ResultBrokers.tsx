import React from 'react';
import BrokerList from '../BrokerList';
import { BROKERS } from '../../../constants';

interface ResultBrokersProps {
  variant?: 'green' | 'gold' | 'blue';
  id?: string;
}

const ResultBrokers: React.FC<ResultBrokersProps> = ({ variant = 'green', id = 'brokers-list' }) => {
  const badgeColors = {
    green: 'bg-emerald-100 text-emerald-600',
    gold: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto scroll-mt-24" id={id}>
      <div className="text-center mb-10">
        <span className={`${badgeColors[variant]} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest`}>Krok Finałowy</span>
        <h4 className="text-3xl font-display font-bold text-primary mt-6">Gdzie otworzyć konto i kupić?</h4>
        <p className="text-gray-500 mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
            To ostatni krok Twojej ścieżki. Poniżej znajdziesz <strong>listę zweryfikowanych instytucji</strong>, które oferują najlepsze warunki (niskie opłaty i polski interfejs). Konto otworzysz całkowicie przez internet.
        </p>
      </div>
      
      {/* 
        Wykorzystujemy ten sam komponent co w modalu (BrokerList), 
        z tą samą listą danych (BROKERS), co gwarantuje 100% spójności.
      */}
      <BrokerList 
        list={BROKERS} 
        title="Rekomendowane platformy" 
        isHighlight={false} 
        variant={variant} 
        actionLabel="Otwórz konto online"
      />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100 text-sm text-gray-500 flex items-start gap-4 italic">
          <i className="fas fa-info-circle text-primary mt-1"></i>
          <p>Wybór brokera zależy od Twoich preferencji. Weź pod uwagę koszty transakcyjne czy minimalne kwoty zakupów. Nie chcemy, aby prowizje zjadły lwią część pieniędzy, co w długim terminie ma kolosalne znaczenie.</p>
      </div>
    </div>
  );
};

export default ResultBrokers;