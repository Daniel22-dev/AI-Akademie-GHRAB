# AI Akademie GHRAB 1.4.4 — propojení s AI Studiem

Datum: 2026-09-11

- Po ověření platného full-admin přístupu se v horní navigaci Akademie zobrazí tlačítko **AI Studio**.
- Ověření používá existující `access/access-control.js` ze Studia na stejném originu; nevzniká druhá kopie rolí ani paralelní seznam administrátorů.
- Učitel a role `operator` tlačítko neuvidí.
- Přechod ze Studia předává pouze návratovou URL. Permit/token se do query stringu nevkládá.
- Verze PWA cache je zvýšena na 1.4.4.
