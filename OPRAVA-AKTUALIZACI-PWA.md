# Oprava načítání nové verze PWA

Tato varianta opravuje situaci, kdy se po nasazení nové verze z GitHub Pages nejprve zobrazila stará verze a nová se načetla až po `Ctrl + Shift + R`.

## Provedené změny

- nová cache `ghrab-academy-v1.3.2-cache-hotfix-1`,
- při instalaci service workeru se klíčové soubory stahují bez použití staré HTTP cache,
- HTML, JavaScript, CSS a manifest používají při online provozu strategii `network first`,
- po aktivaci nového service workeru se otevřené okno aplikace samo jednou obnoví,
- registrace používá `updateViaCache: 'none'` a při spuštění výslovně kontroluje aktualizaci,
- offline režim zůstává zachován.

## Nasazení

Nahraj obsah této složky do kořene stejného GitHub repozitáře a původní soubory přepiš. Nezakládej další vnořenou složku.

U zařízení, která mají právě aktivní starou verzi 1.3.1, může být při prvním otevření po nasazení vidět krátké automatické obnovení. Poté se další verze mají přepínat bez ručního tvrdého obnovení.
