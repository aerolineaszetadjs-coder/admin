
(async () => {
  try {
    const response = await fetch('/content/typography.json', { cache: 'no-store' });
    if (!response.ok) return;

    const typography = await response.json();
    const groups = {
      hero: 'h1',
      headings: 'h2',
      subtitles: '.eyebrow, .kicker, .card-type, .track-type, .section-label',
      body: 'main p:not(.kicker):not(.eyebrow), main li, .collection-intro, .listen-note',
      navigation: 'header nav a, nav a, .languages a, .brand',
      buttons: '.pill, button, .btn, a.button, .listen-btn'
    };

    const safeFont = value =>
      /^(Barlow Condensed|DM Sans|Arial|Georgia|Verdana|Helvetica)$/i.test(value || '');

    const safeSize = value => typeof value === 'string' &&
      (/^\d+(?:\.\d+)?(px|rem|em|vw)$/i.test(value.trim()) ||
       /^clamp\(\s*\d+(?:\.\d+)?(px|rem|em|vw)\s*,\s*\d+(?:\.\d+)?(px|rem|em|vw)\s*,\s*\d+(?:\.\d+)?(px|rem|em|vw)\s*\)$/i.test(value.trim()));

    const safeColor = value => typeof value === 'string' &&
      (/^#[0-9a-f]{3,8}$/i.test(value.trim()) ||
       /^var\(--(?:pink|orange|ink|paper)\)$/.test(value.trim()));

    const rules = [];

    for (const [group, selector] of Object.entries(groups)) {
      const settings = typography[group];
      if (!settings || typeof settings !== 'object') continue;

      const declarations = [];

      if (safeFont(settings.font))
        declarations.push(`font-family: "${settings.font}", sans-serif !important`);

      if (safeSize(settings.size))
        declarations.push(`font-size: ${settings.size} !important`);

      const weight = Number(settings.weight);
      if (Number.isInteger(weight) && weight >= 100 && weight <= 900 && weight % 100 === 0)
        declarations.push(`font-weight: ${weight} !important`);

      if (safeColor(settings.color))
        declarations.push(`color: ${settings.color} !important`);

      if (declarations.length)
        rules.push(`${selector} { ${declarations.join('; ')}; }`);
    }

    if (rules.length) {
      const style = document.createElement('style');
      style.id = 'cms-typography';
      style.textContent = rules.join('\n');
      document.head.appendChild(style);
    }
  } catch (error) {
    console.warn('CMS: tipografia original conservada', error);
  }
})();
