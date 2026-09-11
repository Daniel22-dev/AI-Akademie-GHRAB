# AI Akademie GHRAB 1.4.5 — PWA-safe návrat do AI Studia

Datum: 2026-09-11

## Změny

- Tlačítko **AI Studio** už nenaviguje nainstalovanou Akademii mimo její vlastní PWA scope.
- Pokud byla Akademie otevřena ze Studia (`from=ai-studio`), návrat se nejprve pokusí zavřít pomocnou kartu/okno a tím uživatele vrátit k původnímu Studiu.
- Pokud prohlížeč zavření nepovolí, Studio se otevře v samostatném bezpečném kontextu.
- Při samostatném otevření Akademie se Studio otevírá v nové kartě/okně s `noopener noreferrer`.
- Full-admin ověření, same-origin allowlist a zákaz přenosu permitu/tokenu zůstávají zachovány.
- PWA cache je zvýšena na **1.4.5**, aby staré chování nezůstalo v service-worker cache.
