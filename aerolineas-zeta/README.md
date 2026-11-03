# Aerolíneas Zeta — còpia completa del web

Exportació del 21 d’octubre de 2026.

## Què inclou

- `web/index.html`: web en català.
- `web/es/index.html`: web en castellà.
- `web/en/index.html`: web en anglès.
- `web/gracies.html`, `web/es/gracies.html`, `web/en/gracies.html`: confirmacions del formulari.
- `web/assets/`: totes les fotografies i els logos utilitzats pel web, inclosos els recursos disponibles al projecte.
- `sites/hosting.json`: configuració d’allotjament actual a Sites, sense credencials.
- `MANIFEST.json`: llista i empremtes SHA-256 dels fitxers del projecte exportats.

Els estils CSS i el JavaScript estan integrats dins dels HTML. El projecte actual no té fitxers PHP ni necessita executar PHP. Aquest README és la documentació Markdown de l’exportació.

## Obrir-lo al teu ordinador

Descomprimeix el ZIP. Des de la carpeta `aerolineas-zeta`, executa:

```bash
python3 -m http.server 8000 --directory web
```

Obre `http://localhost:8000/` al navegador. El servidor local és necessari perquè els enllaços a `/assets/`, `/es/` i `/en/` funcionin correctament. Obrir l’HTML directament amb doble clic no és suficient per revisar tots els recursos.

## Publicar-lo en un altre allotjament

Puja el contingut de `web/` a l’arrel pública del domini, conservant les carpetes. No cal compilar ni instal·lar dependències.

El web inclou el selector CA / ES / EN, les caràtules, els reproductors integrats, l’agenda de sessions, Merchandising i el formulari de booking.

## Formulari de contacte

- Destinatari: `booking@aerolineaszeta.com`.
- Servei d’enviament: FormSubmit, amb `method="POST"`.
- Cal fer un primer enviament i confirmar el correu d’activació de FormSubmit abans de donar la recepció per activada. La recepció final no s’ha verificat en aquesta exportació.
- Els camps `_next` apunten a les pàgines de confirmació de `https://aerolineas-zeta.apthorse.chatgpt.site`. Si publiques en un altre domini, canvia `_next` als tres `index.html` perquè apuntin al domini nou.
- També hi ha un enllaç directe de correu electrònic.

## Edició

Els tres `index.html` són versions independents: quan canviïs cançons, textos, dates o enllaços, actualitza les tres versions. Els noms de cançons i artistes es mantenen en la llengua original.

Els àudios continuen allotjats a SoundCloud; aquesta còpia inclou els reproductors i els enllaços, però no els fitxers d’àudio. Les tipografies es carreguen des de Google Fonts. SoundCloud, Google Fonts i FormSubmit requereixen connexió a Internet.

## Estat exportat

Aquesta còpia correspon al commit indicat al manifest i conserva tots els fitxers públics del web. No inclou historial Git, credencials, missatges rebuts ni dades privades de visitants.
