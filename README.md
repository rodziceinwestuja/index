# Rodzice Inwestują - Dokumentacja Techniczna

Platforma edukacyjna pomagająca rodzicom budować kapitał dla dzieci poprzez regularne inwestycje.

## 🚀 Stos Technologiczny

Aplikacja została zbudowana jako nowoczesna **SPA (Single Page Application)** z wykorzystaniem:

*   **Framework:** React 19 (ES6+ Modules)
*   **Język:** TypeScript (silne typowanie dla bezpieczeństwa danych)
*   **Stylizacja:** Tailwind CSS (Utility-first CSS)
*   **Wykresy:** Recharts (SVG-based responsive charts)
*   **Ikony:** FontAwesome 6.4.0
*   **Typografia:** Google Fonts (Montserrat & Open Sans)

## 🎨 System Projektowy (Design System)

### Kolorystyka
Aplikacja opiera się na profesjonalnej, budzącej zaufanie palecie barw, z podziałem na kategorie produktowe:

*   **Główne:**
    *   `Primary (#0F4C5C)` - Ciemny morski, używany w nagłówkach i nawigacji.
    *   `Accent (#33C18C)` - Energetyczna zieleń, kolor akcji i sukcesu.
    *   **Background Light (#F7FAFC)** - Delikatna szarość tła sekcji.

*   **Tematyczne (Kategorie Inwestycji):**
    *   🔵 **Niebieski (Blue):** Obligacje Skarbowe (bezpieczeństwo, Państwo).
    *   🟢 **Zielony (Green):** Giełda i ETF (wzrost, nowoczesność).
    *   🟡 **Złoty (Gold/Amber):** Metale szlachetne (trwałość, kruszce).

### Typografia
*   **Montserrat:** Wykorzystywany dla nagłówków (`font-display`). Grubości: 600, 700, 800. Nadaje nowoczesny i zdecydowany charakter.
*   **Open Sans:** Wykorzystywany dla tekstów ciągłych i interfejsu (`font-sans`). Zapewnia doskonałą czytelność na urządzeniach mobilnych.

## 🏗️ Architektura Komponentów

### 1. Logika Kalkulatorów
*   **Calculator.tsx:** Klasyczny kalkulator procentu składanego. Oblicza wartość końcową (FV) na podstawie wieku dziecka i miesięcznej wpłaty.
*   **BondSimulator.tsx:** Specjalistyczny symulator obligacji EDO/Rodzinnych. Uwzględnia zmienną strukturę oprocentowania (1. rok stały, kolejne: inflacja + marża).

### 2. Kreator Inwestycji (Immersive State-Driven View)
Kreator (`InvestmentWizard.tsx`) nie jest zaimplementowany jako modal, overlay czy oddzielna podstrona w rozumieniu routingu URL. Jest to **dedykowany widok pełnoekranowy**, zarządzany stanem aplikacji.

*   **Mechanizm działania:** W głównym komponencie `App.tsx` stan `currentPage` decyduje o tym, co jest renderowane w głównym drzewie DOM. Gdy użytkownik uruchamia kreator, następuje całkowite odmontowanie layoutu strony głównej (Nawigacja, Hero, Sekcje, Footer), a w jego miejsce montowany jest komponent Kreatora.
*   **Cel biznesowy i UX:** Takie podejście (tzw. *Immersive View*) eliminuje wszelkie elementy rozpraszające (distractions). Użytkownik znajduje się w izolowanym środowisku, co sprzyja skupieniu na procesie decyzyjnym.
*   **Zarządzanie stanem:** Wewnątrz Kreatora stan jest przekazywany w dół, a nawigacja odbywa się poprzez zmianę wewnętrznego kroku (`step`), co zapewnia płynne przejścia bez przeładowań.

### 3. System Modali (React Portals)
Wszystkie okna dialogowe (Listy brokerów, Regulaminy, Kroki) wykorzystują zaawansowany wzorzec **React Portals**.

*   **Implementacja:** Komponenty te (np. `ProvidersModal.tsx`), mimo że są zadeklarowane logicznie głęboko w strukturze komponentów rodziców, są renderowane fizycznie poza głównym drzewem aplikacji – bezpośrednio w węźle `document.body`.
*   **Zastosowanie `createPortal`:**
    ```tsx
    return createPortal(<div className="modal">...</div>, document.body);
    ```
*   **Korzyści techniczne:**
    *   **Stacking Context (z-index):** Gwarantuje, że modal zawsze znajdzie się na wierzchu, niezależnie od `z-index` ustawionego na kontenerach rodziców.
    *   **Izolacja stylów:** Uniezależnia modal od stylów rodzica takich jak `overflow: hidden` czy transformacji CSS (`transform`), które mogłyby uciąć zawartość modala lub zaburzyć jego pozycjonowanie `fixed`.

## 📊 Dane i Stałe (constants.ts)
Wszystkie informacje o instytucjach finansowych są scentralizowane w jednym pliku. Pozwala to na błyskawiczną aktualizację linków lub opisów brokerów (XTB, mBank, PKO BP, Mennica Skarbowa) w całej aplikacji jednocześnie.

## 🔄 Animacje i UX
*   **Interaktywność:** Kafelki brokerów posiadają kolorowe cienie (`shadow-500/10`), które reagują na `hover` zwiększając intensywność i przesuwając kafel w górę.
*   **Tooltipy:** Autorski system podpowiedzi CSS dla trudnych terminów (np. inflacja, marża), aktywowany po najechaniu na podkreślony tekst.
*   **Płynność:** Zastosowano `framer-motion`-like CSS keyframes dla animacji `slide-up` i `fade-in`, zapewniając płynne przejścia między krokami kreatora.

## 🌍 Wdrożenie na GitHub Pages (Metoda Przeglądarkowa)

Poniżej znajduje się instrukcja umieszczenia aplikacji w Internecie, korzystając **wyłącznie ze strony internetowej GitHub** (bez instalowania programów i używania konsoli).

**Dane konta:**
*   Użytkownik: `rodziceinwestuja`
*   Repozytorium: `rodziceinwestuja`

### Krok 1: Utworzenie repozytorium na GitHub
1.  Zaloguj się na konto `rodziceinwestuja` na GitHub.
2.  Kliknij **New repository** (lub `+` w prawym górnym rogu).
3.  W polu **Repository name** wpisz: `rodziceinwestuja`.
4.  Ustaw widoczność na **Public**.
5.  **Ważne:** Zaznacz opcję **Add a README file**.
6.  Kliknij **Create repository**.

### Krok 2: Wgranie plików przez przeglądarkę
1.  Będąc w nowo utworzonym repozytorium, kliknij przycisk **Add file** (znajdziesz go nad listą plików po prawej stronie).
2.  Z rozwijanego menu wybierz **Upload files**.
3.  Otwórz folder ze swoim projektem na komputerze.
4.  Zaznacz **wszystkie pliki i foldery** swojego projektu (`index.html`, folder `components`, `App.tsx` itd.).
5.  Przeciągnij je i upuść w szarym polu na stronie GitHub ("Drag files here...").
6.  Poczekaj, aż wszystkie paski ładowania zmienią się na zielone.
7.  Na dole strony w polu "Commit changes" kliknij zielony przycisk **Commit changes**.

### Krok 3: Włączenie GitHub Pages
1.  Będąc w repozytorium, kliknij zakładkę **Settings** (Ustawienia) na górnym pasku menu (ikona koła zębatego).
2.  W menu po lewej stronie, w sekcji "Code and automation", kliknij **Pages**.
3.  W sekcji **Build and deployment**:
    *   **Source:** Upewnij się, że wybrane jest `Deploy from a branch`.
    *   **Branch:** Wybierz `main` (lub `master`) oraz folder `/ (root)`.
4.  Kliknij przycisk **Save**.

### Krok 4: Weryfikacja
Po kliknięciu Save, odczekaj około 1-2 minuty. Odśwież stronę ustawień Pages.

Na samej górze tej strony pojawi się komunikat z linkiem:
> Your site is live at **https://rodziceinwestuja.github.io/rodziceinwestuja/**

Gratulacje! Twoja aplikacja jest dostępna online.

---
*Dokumentacja wygenerowana dla projektu "Rodzice Inwestują".*