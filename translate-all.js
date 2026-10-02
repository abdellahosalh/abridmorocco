const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const esDir = path.join(baseDir, 'es');

const files = [
  'blog-chefchaouen.html',
  'blog-driving-safety.html',
  'blog-essaouira.html',
  'blog-essaouira-bus-vs-tour.html',
  'blog-agoudal.html',
  'blog-imilchil.html',
  'blog-lakes-isli-tislit.html',
  'blog-high-atlas-packing.html',
  'blog-marrakech-top10.html',
  'blog-rich-ziz.html',
  'blog-sahara-erg-chebbi.html',
  'blog-sahara-packing.html'
];

function translateFile(filename) {
  let content = fs.readFileSync(path.join(baseDir, filename), 'utf8');

  // --- SEO identity: canonical / hreflang / og:url -----------------------
  // These are rewritten ONLY inside their own tags, are idempotent (safe to
  // re-run) and never touch another page's self-canonical. The previous
  // global URL substitution could rewrite the hreflang="en" target to /es/
  // and, on a second run, produce /es/es/ URLs.
  const SITE = 'https://www.abridmorocco.com';
  const enUrl = `${SITE}/${filename}`;
  const esUrl = `${SITE}/es/${filename}`;
  const frUrl = `${SITE}/fr/${filename}`;
  const hasFr = fs.existsSync(path.join(baseDir, 'fr', filename));

  // lang attribute (scoped, not a global lang="en" -> lang="es" sweep)
  content = content.replace(/<html lang="[a-z]{2}"/, '<html lang="es"');

  // 1) canonical -> this page, exactly one tag
  if (!/<link rel="canonical"/.test(content)) {
    throw new Error(`canonical tag missing in ${filename} - aborting`);
  }
  content = content.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${esUrl}" />`
  );

  // 2) hreflang cluster rebuilt from scratch: en always, fr only when the
  //    fr/ file exists, es = self, x-default = en. Cannot duplicate on re-run.
  content = content.replace(
    /\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/?>/g,
    ''
  );
  const cluster = [
    `  <link rel="alternate" hreflang="en" href="${enUrl}" />`,
    hasFr ? `  <link rel="alternate" hreflang="fr" href="${frUrl}" />` : null,
    `  <link rel="alternate" hreflang="es" href="${esUrl}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${enUrl}" />`
  ].filter(Boolean).join('\n');
  content = content.replace(
    /(<link rel="canonical"[^>]*\/?>)/,
    (m) => `${m}\n${cluster}`
  );

  // 3) og:url must equal the canonical
  content = content.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    (m, a, z) => `${a}${esUrl}${z}`
  );

  // 4) post-conditions - fail loudly instead of writing a broken page
  const canCount = (content.match(/<link rel="canonical"/g) || []).length;
  const hlCount = (content.match(/hreflang="/g) || []).length;
  if (canCount !== 1) throw new Error(`${filename}: ${canCount} canonical tags`);
  if (hlCount < 3) throw new Error(`${filename}: only ${hlCount} hreflang tags`);
  if (content.includes('/es/es/')) throw new Error(`${filename}: /es/es/ produced`);

  // Update pageLanguage in Google Translate
  content = content.replace(/pageLanguage:'en'/g, "pageLanguage:'es'");

  // Update footer language link
  content = content.replace(
    new RegExp(`<a href="${filename.replace(/\./g, '\\.')}" class="current" aria-current="true">([^<]+)</a>`, 'g'),
    `<a href="../${filename}" class="current" aria-current="true">🇪🇸 Español</a>`
  );

  // Update footer langs label
  content = content.replace(/Languages \/ Langues \/ Idiomas/g, 'Idiomas / Languages / Langues');

  // Common navigation translations
  content = content.replace(/>Skip to main content</g, '>Saltar al contenido principal<');
  content = content.replace(/>Search Abrid Morocco</g, '>Buscar en Abrid Morocco<');
  content = content.replace(/>Reserve a tour</g, '>Reservar un tour<');
  content = content.replace(/>Reserve</g, '>Reservar<');
  content = content.replace(/>Open menu</g, '>Abrir menú<');
  content = content.replace(/>Close</g, '>Cerrar<');
  content = content.replace(/>Search</g, '>Buscar<');
  content = content.replace(/>Chat with Abrid Morocco on WhatsApp</g, '>Chatea con Abrid Morocco en WhatsApp<');
  content = content.replace(/>Chat with Abrid on WhatsApp</g, '>Chatea con Abrid en WhatsApp<');

  // Navigation menu items
  content = content.replace(/>Destinations </g, '>Destinos <');
  content = content.replace(/>All Destinations</g, '>Todos los Destinos<');
  content = content.replace(/>Sahara Desert</g, '>Desierto del Sahara<');
  content = content.replace(/>Atlas Mountains</g, '>Montañas del Atlas<');
  content = content.replace(/>Essaouira &amp; Coast</g, '>Essaouira y Costa<');
  content = content.replace(/>Ways to Travel </g, '>Formas de Viajar <');
  content = content.replace(/>Travel styles</g, '>Estilos de viaje<');
  content = content.replace(/>All Trips</g, '>Todos los Viajes<');
  content = content.replace(/>Private Tours</g, '>Tours Privados<');
  content = content.replace(/>Small-Group Tours</g, '>Tours en Grupo Pequeño<');
  content = content.replace(/>Tailor-Made Trips</g, '>Viajes a Medida<');
  content = content.replace(/>Airport Transfers</g, '>Traslados al Aeropuerto<');
  content = content.replace(/>Morocco Guide </g, '>Guía de Marruecos <');
  content = content.replace(/>Guides</g, '>Guías<');
  content = content.replace(/>All Guides</g, '>Todas las Guías<');
  content = content.replace(/>Sahara Guide</g, '>Guía del Sahara<');
  content = content.replace(/>Best Time to Visit</g, '>Mejor Época para Visitar<');
  content = content.replace(/>Chefchaouen Guide</g, '>Guía de Chefchaouen<');
  content = content.replace(/>Desert Guide</g, '>Guía del Desierto<');
  content = content.replace(/>About </g, '>Nosotros <');
  content = content.replace(/>Company</g, '>Empresa<');
  content = content.replace(/>About Us</g, '>Sobre Nosotros<');
  content = content.replace(/>Reviews</g, '>Reseñas<');
  content = content.replace(/>Contact</g, '>Contacto<');
  content = content.replace(/>Plan My Trip</g, '>Planifica Tu Viaje<');
  content = content.replace(/>Chat on WhatsApp</g, '>Chat en WhatsApp<');
  content = content.replace(/>Destinations</g, '>Destinos<');
  content = content.replace(/>Ways to Travel</g, '>Formas de Viajar<');
  content = content.replace(/>Morocco Guide</g, '>Guía de Marruecos<');
  content = content.replace(/>About</g, '>Nosotros<');

  // Footer translations
  content = content.replace(/>Morocco travel platform</g, '>Plataforma de viajes por Marruecos<');
  content = content.replace(/A Morocco travel platform built by people who know Morocco\. Sahara, Atlas, Imperial Cities — private guides and characterful stays since 2022\./g, 'Una plataforma de viajes por Marruecos creada por personas que conocen Marruecos. Sahara, Atlas, Ciudades Imperiales — guías privados y alojamientos con encanto desde 2022.');
  content = content.replace(/>Booking</g, '>Reservas<');
  content = content.replace(/>How Booking Works</g, '>Cómo Funcionan las Reservas<');
  content = content.replace(/>Cancellation Policy</g, '>Política de Cancelación<');
  content = content.replace(/>Terms of Service</g, '>Términos del Servicio<');
  content = content.replace(/>Airport Transfer</g, '>Traslado al Aeropuerto<');
  content = content.replace(/>Trips</g, '>Viajes<');
  content = content.replace(/>Gallery</g, '>Galería<');
  content = content.replace(/>Get in Touch</g, '>Ponte en Contacto<');
  content = content.replace(/>Live Chat on WhatsApp</g, '>Chat en Vivo por WhatsApp<');
  content = content.replace(/>FAQ</g, '>Preguntas Frecuentes<');
  content = content.replace(/>Email Us</g, '>Escríbenos<');
  content = content.replace(/>Purpose</g, '>Propósito<');
  content = content.replace(/>Responsible Travel</g, '>Viaje Responsable<');
  content = content.replace(/>Community Journey</g, '>Viaje Comunitario<');
  content = content.replace(/>Traveller Reviews</g, '>Reseñas de Viajeros<');
  content = content.replace(/>Leave a Google Review</g, '>Deja una Reseña en Google<');
  content = content.replace(/>Terms</g, '>Términos<');
  content = content.replace(/>Privacy</g, '>Privacidad<');
  content = content.replace(/>Cookies</g, '>Cookies<');
  content = content.replace(/>Made in Morocco</g, '>Hecho en Marruecos<');
  content = content.replace(/All rights reserved\./g, 'Todos los derechos reservados.');

  // Cookie banner
  content = content.replace(/We use cookies to improve your experience and analyse site traffic\. Read our /g, 'Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. Lee nuestra ');
  content = content.replace(/>Accept</g, '>Aceptar<');
  content = content.replace(/>Decline</g, '>Rechazar<');

  // Search placeholder
  content = content.replace(/placeholder="Search trips, destinations, guides/g, 'placeholder="Buscar viajes, destinos, guías');

  // Newsletter popup
  content = content.replace(/>Morocco in your inbox</g, '>Marruecos en tu correo<');
  content = content.replace(/One short letter a month — routes, seasons, secret spots\. No spam, ever\./g, 'Una carta corta al mes — rutas, temporadas, lugares secretos. Sin spam, nunca.');
  content = content.replace(/>Your name</g, '>Tu nombre<');
  content = content.replace(/>Email address</g, '>Dirección de correo electrónico<');
  content = content.replace(/>I'm dreaming of/g, '>Estoy soñando con');
  content = content.replace(/>Anywhere in Morocco</g, '>Cualquier lugar de Marruecos<');
  content = content.replace(/>Sahara desert</g, '>Desierto del Sahara<');
  content = content.replace(/>High Atlas</g, '>Alto Atlas<');
  content = content.replace(/>Imperial cities</g, '>Ciudades imperiales<');
  content = content.replace(/>Subscribe free</g, '>Suscribirse gratis<');
  content = content.replace(/Unsubscribe anytime with one click\./g, 'Date de baja en cualquier momento con un solo clic.');
  content = content.replace(/>You are in!</g, '>¡Ya estás dentro!<');
  content = content.replace(/Welcome aboard — your first Morocco letter is on its way\./g, 'Bienvenido a bordo — tu primera carta de Marruecos está en camino.');
  content = content.replace(/>Continue exploring</g, '>Continuar explorando<');

  // Back to all guides
  content = content.replace(/>← All guides</g, '>← Todas las guías<');
  content = content.replace(/>← Back to all Blog Posts</g, '>← Volver a todos los artículos<');

  // Keep exploring
  content = content.replace(/>Keep exploring</g, '>Sigue explorando<');
  content = content.replace(/>Keep exploring the route</g, '>Sigue explorando la ruta<');

  // View details
  content = content.replace(/>View details /g, '>Ver detalles ');
  content = content.replace(/>View the journey /g, '>Ver el viaje ');
  content = content.replace(/>View Imilchil Tour Details /g, '>Ver detalles del tour de Imilchil ');

  // Byline
  content = content.replace(/>By Abdellah | Local Tour Expert</g, '>Por Abdellah | Experto en Tours Locales<');

  // Write the translated file
  fs.writeFileSync(path.join(esDir, filename), content, 'utf8');
  console.log(`Translated: ${filename}`);
}

files.forEach(translateFile);
console.log('All files translated successfully!');
