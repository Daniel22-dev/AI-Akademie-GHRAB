# ETAPA D1 — inventura dokumentace a školení
**Datum:** 2026-10-08  
**Stav:** zdrojová inventura, nikoli certifikace obsahu nebo živého UI  
**Rozsah:** osm aplikací mimo pilot GIT, propojení s AI Akademií, PDF export

## 1. Zdrojová inventura (zjištěno z GitHub main)

| Aplikace | Verze aplikace | Umístění manuálu | Charakter obsahu | Stav školení Akademie |
|---|---|---|---|---|
| Diferenciátor | 1.3.51 | `src/manual/index.html` | statické HTML (~47 kB) | 1.3.50; **review-required** |
| Hodnotitel maturitních slohů | 1.5.30 | `src/manual/index.html` | statické HTML (~33 kB) | 1.5.30; revize nevyznačena |
| Korespondenční asistent | 5.10.34 | `src/manual/index.html` | statické HTML (~63 kB) | 5.10.32; **review-required** |
| LUDUS | 1.16.31 | `public/manual/index.html` | statické HTML (~45 kB) | 1.16.30; **review-required** |
| ACTIVA | 0.5.30 | `src/manual/index.html` | HTML (~25 kB), další dynamický obsah vyžaduje revizi | 0.5.30; revize nevyznačena |
| SORTIO | 1.1.23 | `src/manual/index.html` | statické HTML (~16 kB) | 1.1.22; **review-required** |
| Lesson Hub | 1.2.26 | `public/manual/index.html` + `public/manual/manual.js` | dynamicky sestavovaný manuál (~26 kB JS) | 1.2.26; revize nevyznačena |
| Maturita Desk | 1.0.6 | integrovaná nápověda aplikace | není samostatný `manual/index.html` dle původního auditu | 1.0.6; revize nevyznačena |

**Důležité:** Výskyt řetězce `pdf` v HTML **neprokazuje**, že existuje plnohodnotné přímé stažení PDF. Bez ověření skutečného výstupu jej neoznačovat jako funkční. Podobně shodné číslo verze neznamená věcně schválený návod.

## 2. Systémové nálezy

1. **D1-P0:** Centrální `AI-Studio-GHRAB/src/manualy/viewer.js` podmiňuje nabídku PDF konkrétní aplikací GIT (`currentApp.id === 'generator'`) a dostupností přímého DOM v rámci stejného originu. Ostatní aplikace zatím nemají centrálně ověřený úplný PDF export.
2. **D1-P0:** Lesson Hub musí do PDF dodat **obsah sestavený v JS**, nikoli jen krátký HTML bootstrap. Ověřit úplnost proti všem uživatelským sekcím.
3. **D1-P0:** Maturita Desk potřebuje samostatný kontrakt pro integrovanou nápovědu: export jen autorizovaného dokumentačního obsahu, bez provozních dat.
4. **D1-P1:** Akademie obsahuje neaktuální vazby školení na verze u Diferenciátoru (1.3.50 versus 1.3.51), Korespondence (5.10.32 versus 5.10.34), LUDUS (1.16.30 versus 1.16.31) a SORTIO (1.1.22 versus 1.1.23). Neopravovat je pouhým přepsáním verze — nejprve ověřit postupy v aplikaci.
5. **D1-P1:** Hlavní školicí kurz `ai-literacy` v Akademii je označen 0.21.133 a `review-required`, zatímco dnešní AI Studio je 0.21.197. Samostatné krátké kurzy `quick-studio` a `quick-api` jsou vedeny jako pilot pro 0.21.196.
6. **D1-P1:** Některé školicí moduly neudávají `reviewStatus`; bez doložené věcné revize je nutné stav chápat jako **unknown/review required**.
7. **D1-P1:** Úplná věcná revize vyžaduje porovnání každého návodu proti skutečnému kódu a role-based UI; inventura souborů samotná nestačí.

## 3. D2 – prováděcí pořadí

**Vlna 1:** SORTIO → Diferenciátor → LUDUS → Korespondenční asistent. U každého nejprve porovnat UI postupy, potom opravit manuál, vygenerovat/ověřit PDF a teprve následně školení.

**Vlna 2:** Hodnotitel → ACTIVA; přísně oddělit oprávnění a citlivý obsah.

**Vlna 3:** Lesson Hub (dynamický zdroj) → Maturita Desk (integrovaná nápověda). Řešit vlastní zdroj obsahu a bezpečné přímé PDF, ne nepřesný výpis DOM.

**Vlna 4:** Audit velkého školení GIT proti 7.1.99 a aktualizace společných školení Studio/AI. Ponechat AI Akademii jako režim školitele, Manuály jako samoobsluhu.

## 4. Akceptační kritéria (každá aplikace)

- [ ] Jako běžný učitel projdu první přístup a kompletní reálný úkol bez autora aplikace
- [ ] Úkoly, názvy tlačítek a oprávnění souhlasí s aktuálním produkčním UI
- [ ] Má přehled první nastavení / běžný úkol / řešení problémů
- [ ] HTML funguje na notebooku, telefonu a klávesnici
- [ ] PDF jedním kliknutím skutečně stáhne kompletní text se správnou češtinou, odkazy a datem revize
- [ ] Žádný PDF artefakt neobchází přístupovou bránu ani nevynáší tajné údaje
- [ ] Academy a Manuál se věcně shodují, ale mají oddělené účely a prezentérské poznámky
- [ ] Doc-revision a verifiedAppVersion jsou deklarované **odděleně**; není zde falešná certifikace
- [ ] Build, přístupové kontroly, PDF test a relevantní candidate → protected main CI úspěšně prošly
- [ ] Přesný produkční SHA a živá dostupnost jsou ověřené

## 5. Hranice tohoto dokumentu

Tato D1 inventura je úvodní podklad. **Nevydává ani necertifikuje** manuály všech osmi aplikací; nesmí být prezentována jako dokončená Etapa D. Žádné aplikační logiky ani produkční runtime není touto dokumentační větví měněn.
