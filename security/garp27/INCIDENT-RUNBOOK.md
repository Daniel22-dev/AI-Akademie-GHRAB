# AI Akademie — GARP 2.7 incident/recovery runbook

## Scope
Tento runbook pokrývá zdrojový kód, CI/release řetězec a veřejný statický artefakt AI Akademie. Školní serverová fáze je `DEFERRED_BY_OWNER_DECISION`; serverové identity, revokace, Fortinet, runtime monitoring a server recovery zde nejsou deklarovány jako ověřené.

## DETECT
Za incident považuj zejména: selhání GARP/N5/architecture-integrity gate; neočekávaný soubor v `dist-pages`; změnu runtime schopností mimo schválený inventář; cross-origin egress; neověřenou změnu release workflow; tajný údaj v repozitáři nebo artefaktu; neplatný release digest; selhání admin bridge, které by zpřístupnilo návrat ne-adminovi.

## DECIDE
Při FAIL/HARNESS_ERROR nevydávat kandidáta. `NOT_TESTED` u server-dependent controlu nezměnit na PASS. Změna capability inventáře nebo architecture policy vyžaduje explicitní review a nové relevantní mutation testy.

## CONTAIN
Zastavit promotion/deploy daného kandidáta. Neoslabovat kontrolu, aby pipeline prošla. Pokud už byl veřejný statický release nasazen a je bezpečnostně vadný, použít poslední známý čistý release přes stávající GitHub release/deploy proces; nevytvářet ad-hoc bypass.

## PRESERVE
Uchovat source SHA, P5/Deploy run ID, `qa-results/garp27/`, aktuální SBOM, digest `dist-pages` a relevantní GitHub workflow logy. Do evidence neukládat tokeny ani osobní údaje.

## RECOVER
Oprava musí projít `candidate -> P5/GARP/N5/GARP2.7 -> PR -> trusted admission -> protected main -> main P5 -> verified deploy`. Po opravě zopakovat pozitivní test i mutation test vztahující se k příčině. Školní server recovery zůstává NOT_TESTED do samostatné serverové fáze.

## Escalation boundary
Lokální/CI nález řeší garant aplikace a release vlastník. Infrastrukturní nebo školní serverový incident se bez samostatného schválení nepovažuje za automaticky řešitelný touto aplikací.
