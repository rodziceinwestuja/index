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
 * OBLIGACJE SKARBOWE - Wykorzystywane w modalu "Gdzie kupić Obligacje"
 */
export const BOND_PLATFORMS: Broker[] = [
  { 
    name: "Obligacje Skarbowe w banku PKO BP", 
    desc: "Jedyny sposób na zakup obligacji rodzinnych (800+).", 
    link: "https://www.obligacjeskarbowe.pl/punkty-sprzedazy/" 
  },
  {
    name: "Obligacje Skarbowe w Biurze Maklerskim PKO BP",
    desc: "Obligacje możesz nabyć również za pośrednictwem BM PKO BP",
    link: "https://www.obligacjeskarbowe.pl/punkty-sprzedazy/"
  }
];