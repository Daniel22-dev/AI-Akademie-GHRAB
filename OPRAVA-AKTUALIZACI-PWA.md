# Aktualizace PWA — řízený model od verze 1.4.3

Tento dokument nahrazuje dřívější postup s automatickým obnovením otevřených oken.

## Aktuální chování

- nový service worker se stáhne na pozadí, ale otevřenou prezentaci sám neobnoví;
- aplikace mimo prezentační režim nabídne oznámení **Aktualizace je připravena**;
- teprve kliknutí na tlačítko odešle čekajícímu service workeru pokyn `SKIP_WAITING` a provede jedno řízené obnovení;
- v prezentačním režimu se výzva odloží až do jeho ukončení;
- chyba při ukládání konkrétního souboru do precache se vypíše čitelně do konzole;
- HTML, JavaScript, CSS a manifest používají při online provozu strategii network-first, ostatní soubory runtime cache.

Tento model chrání živé školení před nečekaným restartem při nasazení nové verze na GitHub Pages.
