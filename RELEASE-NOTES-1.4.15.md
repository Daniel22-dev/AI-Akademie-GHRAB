# AI Akademie GHRAB 1.4.15 — výkon a úklid bez změny chování

Datum: 2026-09-27

## Změny

- Bezeztrátová komprese 15 používaných PNG: 655 740 -> 476 394 B (-27,4 %). Pixely i doplňkové části PNG jsou shodné.
- Rozcestník při každém otevření stahuje o 173 kB (14,5 %) méně. Service worker dál vše načítá ze sítě bez mezipaměti, takže úspora platí pro první i každou další návštěvu.
- Samostatné HTML prezentace: 1 394 362 -> 1 154 342 B (-17,2 %), protože obsahují ikonu kurzu přímo v sobě.
- `scripts/build-exports.mjs` je čitelný. CSS a běhový skript exportu jsou v `scripts/export-template/`. Před kompresí PNG bylo všech 10 exportů bajtově shodných s 1.4.14.
- Sestavení exportů odmítne nebezpečné zalomení řádků šablony a syntakticky neplatný běhový skript.

## Beze změny

Service worker (kromě verze cache), úložiště, síťové schopnosti, capability inventory, KD-01 až KD-05 a trust-critical control-plane soubory. School-server a LIVE zůstávají `NOT_TESTED` / `DEFERRED_BY_OWNER_DECISION`.
