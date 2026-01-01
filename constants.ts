import { Broker } from './types';

/**
 * KONFIGURACJA OBLIGACJI
 * Tutaj zmienisz oprocentowanie i marże dla wszystkich widoków i symulatorów.
 */
export const BOND_DATA = {
  // Rodzinne 6-letnie
  ROS: {
    firstYear: 5.20,
    margin: 2.00,
    link: "https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-6-letnie-ros/ros1231/"
  },
  // Rodzinne 12-letnie
  ROD: {
    firstYear: 5.85,
    margin: 2.50, // Wartość domyślna dla symulatora rodzinnego
    link: "https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-12-letnie-rod/rod1237/"
  },
  // Skarbowe 4-letnie (COI)
  COI: {
    firstYear: 5.00,
    margin: 1.50,
    link: "https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-4-letnie-coi/coi1229/"
  },
  // Skarbowe 10-letnie (EDO)
  EDO: {
    firstYear: 5.60,
    margin: 2.00, // Wartość domyślna dla symulatora standardowego
    link: "https://www.obligacjeskarbowe.pl/oferta-obligacji/obligacje-10-letnie-edo/edo1235/"
  }
};

/**
 * GIEŁDA I ETF - Wykorzystywane w kreatorze (wynik ETF) oraz w modalu "Konta Maklerskie"
 */
export const BROKERS: Broker[] = [
  { 
    name: "Już wkrótce", 
    desc: "Szukamy najlepszego partnera i najkorzystniejszej oferty", 
    link: "#"
  },
  { 
    name: "Już wkrótce", 
    desc: "Szukamy najlepszego partnera i najkorzystniejszej oferty", 
    link: "#"
  },
  { 
    name: "Już wkrótce", 
    desc: "Szukamy najlepszego partnera i najkorzystniejszej oferty", 
    link: "#" 
  }
];

/**
 * METALE SZLACHETNE - Wykorzystywane w modalu "Dealerzy Metali"
 */
export const METAL_DEALERS: Broker[] = [
  { 
    name: "Już wkrótce", 
    desc: "Szukamy najlepszego partnera i najkorzystniejszej oferty", 
    link: "#" 
  },
  { 
    name: "Już wkrótce", 
    desc: "Szukamy najlepszego partnera i najkorzystniejszej oferty", 
    link: "#" 
  },
  { 
    name: "Już wkrótce", 
    desc: "Szukamy najlepszego partnera i najkorzystniejszej oferty", 
    link: "#" 
  }
];

/**
 * OBLIGACJE RODZINNE (800+) - Tylko PKO BP
 */
export const BOND_PLATFORMS_FAMILY: Broker[] = [
  { 
    name: "PKO Bank Polski", 
    desc: "Wyłączny dystrybutor obligacji rodzinnych (ROS, ROD). Zakup przez serwis iPKO lub w oddziale.", 
    link: "https://www.obligacjeskarbowe.pl/punkty-sprzedazy/" 
  },
  {
    name: "Biuro Maklerskie PKO BP",
    desc: "Alternatywny dostęp do oferty obligacji rodzinnych.",
    link: "https://www.obligacjeskarbowe.pl/punkty-sprzedazy/"
  }
];

/**
 * OBLIGACJE STANDARDOWE - PKO BP + Pekao S.A.
 */
export const BOND_PLATFORMS_STANDARD: Broker[] = [
  { 
    name: "PKO Bank Polski", 
    desc: "Dostęp przez serwis iPKO, aplikację mobilną oraz w oddziałach.", 
    link: "https://www.obligacjeskarbowe.pl/punkty-sprzedazy/" 
  },
  {
    name: "Bank Pekao S.A.",
    desc: "Dostęp przez serwis Pekao24, aplikację PeoPay oraz w oddziałach.",
    link: "https://www.pekao.com.pl/klient-indywidualny/oszczedzanie-i-inwestowanie/obligacje-skarbowe.html"
  }
];
