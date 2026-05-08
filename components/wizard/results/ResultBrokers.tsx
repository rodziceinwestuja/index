import React from 'react';
import BrokerList from '../BrokerList';
import {
  BROKERS,
  PROVIDER_SELECTION_DETAILS,
  PROVIDER_SELECTION_NOTE,
  SHOW_PROVIDER_LISTS,
} from '../../../constants';

interface ResultBrokersProps {
  variant?: 'green' | 'gold' | 'blue';
  id?: string;
}

const ResultBrokers: React.FC<ResultBrokersProps> = ({ variant = 'green', id = 'brokers-list' }) => {
  const badgeColors = {
    green: 'bg-emerald-100 text-emerald-600',
    gold: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto scroll-mt-24" id={id}>
      <div className="text-center mb-10">
        <span className={`${badgeColors[variant]} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest`}>
          Krok finałowy
        </span>
        <h4 className="text-3xl font-display font-bold text-primary mt-6">Jak wybrać konto i platformę?</h4>
        <p className="text-gray-500 mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
          To ostatni krok Twojej ścieżki. Na razie nie pokazujemy gotowej listy firm, ale warto porównać
          koszty, wygodę aplikacji, dostępność pomocy i ofertę instrumentów.
        </p>
      </div>

      {SHOW_PROVIDER_LISTS && (
        <BrokerList
          list={BROKERS}
          title="Kryteria wyboru platformy"
          isHighlight={false}
          variant={variant}
          actionLabel="Otwórz konto online"
        />
      )}

      <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100 text-sm text-gray-500 flex items-start gap-4 italic">
        <i className="fas fa-info-circle text-primary mt-1"></i>
        <p>
          {PROVIDER_SELECTION_NOTE} {PROVIDER_SELECTION_DETAILS}
        </p>
      </div>
    </div>
  );
};

export default ResultBrokers;
