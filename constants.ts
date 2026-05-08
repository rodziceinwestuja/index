import { Broker } from './types';

export const SUPPORT_EMAIL = 'rodziceinwestuja@gmail.com';
export const CURRENT_YEAR = new Date().getFullYear();
export const SHOW_PROVIDER_LISTS = false;
export const PROVIDER_SELECTION_NOTE =
  'Wybór zależy od Twoich preferencji, kosztów transakcyjnych, dostępności aplikacji, pomocy, wygody obsługi i minimalnych kwot zakupu.';
export const PROVIDER_SELECTION_DETAILS =
  'Porównaj opłaty, ofertę instrumentów, jakość aplikacji, obsługę klienta i wygodę całego procesu. To te elementy najczęściej decydują, które rozwiązanie będzie dla Ciebie najlepsze.';
export const FAMILY_BOND_SELECTION_NOTE =
  'Wybór między ROS i ROD zależy przede wszystkim od czasu inwestycji. Jeśli pieniądze mają pracować długo i nie spieszy Ci się z wypłatą, 12-letnie ROD mocniej wykorzystują wyższą marżę oraz procent składany. Jeśli zakładasz krótszy horyzont albo chcesz większej elastyczności, 6-letnie ROS mogą być prostszym wyborem.';
export const STANDARD_BOND_SELECTION_NOTE =
  'Wybór między COI i EDO zależy głównie od horyzontu oraz tego, czy potrzebujesz odsetek po drodze. COI wypłacają odsetki co roku, więc dają większą bieżącą płynność. Jeśli nie spieszy Ci się z wypłatą, 10-letnie EDO pozwalają odsetkom pracować dalej, a procent składany ma więcej czasu, żeby zrobić różnicę.';

export const LIMITS = {
  IKE: 28260, // Limit na 2026
  IKZE: 11304, // Limit na 2026
  IKZE_SELF_EMPLOYED: 16956, // Limit dla samozatrudnionych 2026
};

/**
 * HELPER: Placeholder dla brokerów. Wpisy mają flagę `comingSoon` — `BrokerList`
 * renderuje je jako nieklikalny stan "Już wkrótce".
 */
const PLACEHOLDER_LIST: Broker[] = [
  {
    name: 'Już wkrótce',
    desc: 'Szukamy najlepszego partnera i najkorzystniejszej oferty',
    link: '#',
    comingSoon: true,
  },
  {
    name: 'Już wkrótce',
    desc: 'Szukamy najlepszego partnera i najkorzystniejszej oferty',
    link: '#',
    comingSoon: true,
  },
  {
    name: 'Już wkrótce',
    desc: 'Szukamy najlepszego partnera i najkorzystniejszej oferty',
    link: '#',
    comingSoon: true,
  },
];

/**
 * KONFIGURACJA OBLIGACJI
 * Aktualna oferta: maj 2026, Ministerstwo Finansów.
 */
export const BOND_DATA = {
  // Rodzinne 6-letnie
  ROS: {
    firstYear: 5.00,
    margin: 2.00,
    link: 'https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-6-letnie-ros/ros0532/',
  },
  // Rodzinne 12-letnie
  ROD: {
    firstYear: 5.60,
    margin: 2.50, // Wartość domyślna dla symulatora rodzinnego
    link: 'https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-12-letnie-rod/rod0538/',
  },
  // Skarbowe 4-letnie (COI)
  COI: {
    firstYear: 4.75,
    margin: 1.50,
    link: 'https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-4-letnie-coi/coi0530/',
  },
  // Skarbowe 10-letnie (EDO)
  EDO: {
    firstYear: 5.35,
    margin: 2.00, // Wartość domyślna dla symulatora standardowego
    link: 'https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-10-letnie-edo/edo0536/',
  },
};

/**
 * GIEŁDA I ETF - Wykorzystywane w kreatorze (wynik ETF) oraz w modalu "Konta Maklerskie"
 */
export const BROKERS: Broker[] = [...PLACEHOLDER_LIST];

/**
 * METALE SZLACHETNE - Wykorzystywane w modalu "Dealerzy Metali"
 */
export const METAL_DEALERS: Broker[] = [...PLACEHOLDER_LIST];

/**
 * OBLIGACJE RODZINNE (800+) - Tylko PKO BP
 */
export const BOND_PLATFORMS_FAMILY: Broker[] = [
  {
    name: 'PKO Bank Polski',
    desc: 'Wyłączny dystrybutor obligacji rodzinnych (ROS, ROD). Zakup przez serwis iPKO lub w oddziale.',
    link: 'https://www.obligacjeskarbowe.pl/punkty-sprzedazy/',
  },
  {
    name: 'Biuro Maklerskie PKO BP',
    desc: 'Alternatywny dostęp do oferty obligacji rodzinnych.',
    link: 'https://www.obligacjeskarbowe.pl/punkty-sprzedazy/',
  },
];

/**
 * OBLIGACJE STANDARDOWE - PKO BP + Pekao S.A.
 */
export const BOND_PLATFORMS_STANDARD: Broker[] = [
  {
    name: 'PKO Bank Polski',
    desc: 'Dostęp przez serwis iPKO, aplikację mobilną oraz w oddziałach.',
    link: 'https://www.obligacjeskarbowe.pl/punkty-sprzedazy/',
  },
  {
    name: 'Bank Pekao S.A.',
    desc: 'Dostęp przez serwis Pekao24, aplikację PeoPay oraz w oddziałach.',
    link: 'https://www.pekao.com.pl/klient-indywidualny/oszczedzanie-i-inwestowanie/obligacje-skarbowe.html',
  },
];

/**
 * DOSTAWCY IKE / IKZE - OBLIGACJE
 */
export const IKE_BONDS_BROKERS: Broker[] = [
  {
    name: 'IKE Obligacje (PKO BP)',
    desc: 'Jedyna instytucja w Polsce oferująca Obligacje Skarbowe w ramach IKE. Brak podatku Belki przy wypłacie.',
    link: 'https://www.bm.pkobp.pl/oferta/konta-emerytalne/ike-obligacje',
  },
  {
    name: 'IKZE Obligacje (PKO BP)',
    desc: 'Jedyna instytucja oferująca Obligacje Skarbowe w IKZE. Odliczasz wpłaty od podatku PIT.',
    link: 'https://www.bm.pkobp.pl/oferta/konta-emerytalne/ikze-obligacje',
  },
];

/**
 * DOSTAWCY IKE / IKZE - AKCJE / ETF
 */
export const IKE_STOCKS_BROKERS: Broker[] = [...PLACEHOLDER_LIST];
