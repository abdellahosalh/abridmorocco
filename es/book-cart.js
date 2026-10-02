/* ═══════════════════════════════════════════════════════════════════
   ABRID MOROCCO — Shared tour reservation cart
   On any tour page listed in TOURS below, a floating "Reserve" button
   opens a cart modal. On submit it builds a reservation PDF (tour
   picture + details + thank-you letter) and emails everything — cart,
   letter and PDF — straight to the owner for a personal reply.
   No per-page configuration needed: the tour is detected from the URL.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  var OWNER_EMAIL = "hello@abridmorocco.com";
  var WA_NUMBER = "212762934488";

  /* ═══════════════════════════════════════════════════════════════════
     HOW THE CLIENT RECEIVES THE CARD — flip this switch
     ─────────────────────────────────────────────────────────────────
     false  (default)  You get the booking card in your own inbox and
                       forward the email to the client yourself. Nothing
                       goes to the guest automatically. Safest option:
                       a mistyped address can never leak a card to a
                       stranger.
     true             The card is carbon-copied to the guest's own email
                       the moment they submit. Note the guest then
                       receives a copy of YOUR notification, so it also
                       contains the internal-looking field table.
     ═══════════════════════════════════════════════════════════════════ */
  var AUTO_SEND_CARD = false;

  var LANG = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
  function T(en, fr, es) { return LANG === "fr" ? fr : (LANG === "es" ? es : en); }
  var FR = LANG === "fr";
  var ES = LANG === "es";

  var TOURS = {
    "marrakech.html": { name: "Marrakech Day Tour", dur: "1 Day", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&auto=format&fit=crop", price: "€50 pp" },
    "atlas.html": { name: "Atlas Mountains & Ourika Valley", dur: "1 Day", img: "https://i.postimg.cc/NfvKF7Rj/vincenzo-montagna-pd-Z9t-Nbpztw-unsplash.jpg", price: "€100 pp" },
    "essaouira.html": { name: "Essaouira Day Trip", dur: "1 Day", img: "https://images.unsplash.com/photo-1613057157282-cc3cbe630b26?w=600&auto=format&fit=crop", price: "€150 pp" },
    "air-balloon.html": { name: "Hot Air Balloon over Marrakech", dur: "Half Day", img: "https://i.postimg.cc/fRhRWzns/1788783065964.jpg", price: "€150 pp" },
    "ouzoud-camel-ride.html": { name: "Ouzoud Camel Ride", dur: "Half Day", img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop", price: "Quote on request" },
    "merzouga.html": { name: "Merzouga Desert Adventure", dur: "3 Days", img: "https://images.unsplash.com/photo-1593350058052-cc6636c9facd?w=600&auto=format&fit=crop", price: "€180 pp" },
    "imilchil.html": { name: "Imilchil, Lakes & Summit", dur: "3 Days", img: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=600&auto=format&fit=crop/YNqJlL3B9gIRgqnp/untitled-2-3-AoPepbZODoTZZDk2.jpg", price: "€1,500 pp" },
    "chefchaouen.html": { name: "Chefchaouen Day Trip", dur: "Day Trip", img: "https://i.postimg.cc/vTjVBp7p/Untitled-design.jpg", price: "€200 pp" },
    "fes.html": { name: "Fes Medina Guided Tour", dur: "Day Tour", img: "https://images.unsplash.com/photo-1512958789358-4effcbe171a0?w=600&auto=format&fit=crop", price: "€50 pp" },
    "ouzoud.html": { name: "Ouzoud Waterfalls", dur: "Day Trip", img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop", price: "€150 pp" },
    "zagora.html": { name: "Zagora Desert Express", dur: "2 Days", img: "https://images.unsplash.com/photo-1593350058052-cc6636c9facd?w=600&auto=format&fit=crop", price: "€1,000 pp" },
    "toubkal.html": { name: "Mount Toubkal Trek", dur: "2 Days", img: "images/toubkal/toubkal-massif.jpg", price: "€700 pp" },
    "agafay.html": { name: "Agafay Desert Evening", dur: "Evening", img: "images/agafay/agafay-camp.jpg", price: "€200 pp" },
    "high-atlas-azilal-imilchil-rich.html": { name: "Across the High Atlas", dur: "5 Days", img: "images/high-atlas/imilchil/imilchil-01.jpg", price: "€3,000 pp" },
    "imperial.html": { name: "Imperial Cities Circuit", dur: "8 Days", img: "https://images.unsplash.com/photo-1559925523-10de9e23cf90?w=600&auto=format&fit=crop", price: "€3,000 pp" },
    "6-day-christmas-morocco.html": { name: "6-Day Morocco Christmas Itinerary", dur: "6 Days", img: "https://i.postimg.cc/vTjVBp7p/Untitled-design.jpg", price: "€2,500 pp" },
    "classic-morocco.html": { name: "Classic Morocco Grand Tour", dur: "13 Days", img: "https://images.unsplash.com/photo-1512958789358-4effcbe171a0?w=600&auto=format&fit=crop", price: "€3,000 pp" },
    "small-group-tour.html": { name: "Small Group Morocco Tour", dur: "11 Days", img: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=600&auto=format&fit=crop", price: "€2,000 pp" },
    "private.html": { name: "Private Custom Morocco Tour", dur: "Any Length", img: "https://images.unsplash.com/photo-1526994387180-9557a434b046?w=600&auto=format&fit=crop", price: "€1,200 pp" }
  };

  var file = (location.pathname.split("/").pop() || "index.html").split("?")[0].toLowerCase();
  var tour = TOURS[file] || TOURS["private.html"];
  if (!tour) return;
  var currentTour = tour;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function absUrl(u) {
    if (/^https?:/i.test(u)) return u;
    var a = document.createElement("a");
    a.href = u;
    return a.href;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Booking card — helpers
     The card emailed to the guest is rendered as a PDF so it needs no
     HTML in the mail and opens correctly everywhere, including phones.
     ═══════════════════════════════════════════════════════════════════ */
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v == null ? "" : v).trim());
  }
  function moneyNum(s) {
    var m = String(s == null ? "" : s).replace(/[,\s]/g, "").match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : null;
  }
  function money(n) {
    return "€" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  function niceDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso == null ? "" : iso).trim());
    if (!m) return String(iso || "—");
    var MO = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
    return parseInt(m[3], 10) + " " + MO[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  /* Labels on the card, in the language of the page. */
  var CARD_L = (function () {
    var en = {
      brandSub: "Private tours & tailor-made journeys",
      tour: "Tour", tail: "Tailor-made",
      price: "Price", per: "Per person", tot: "Indicative total",
      ref: "Reference", date: "Preferred date", lead: "Lead traveller",
      trav: "Travellers", email: "Email", phone: "Phone", req: "Requests",
      doc: "Private client document",
      subj: "Prices per person and subject to final itinerary confirmation.",
      note: "Thank you for choosing Abrid Morocco. Your reservation is now with Abdellah and Karim, and we reply personally within 2 hours (9:00–21:00, Morocco time) to confirm availability and shape the final details with you. Nothing is due until the day of departure. Reply to this email or reach us on WhatsApp — whichever is easier."
    };
    var fr = {
      brandSub: "Circuits privés et voyages sur mesure",
      tour: "Circuit", tail: "Sur mesure",
      price: "Prix", per: "Par personne", tot: "Total indicatif",
      ref: "Référence", date: "Date souhaitée", lead: "Voyageur principal",
      trav: "Voyageurs", email: "E-mail", phone: "Téléphone", req: "Précisions",
      doc: "Document client privé",
      subj: "Prix par personne, soumis à confirmation finale de l'itinéraire.",
      note: "Merci d'avoir choisi Abrid Morocco. Votre réservation est maintenant entre les mains d'Abdellah et Karim, et nous répondons personnellement sous 2 heures (9h00–21h00, heure du Maroc) pour confirmer la disponibilité et finaliser les détails avec vous. Aucun paiement n'est dû avant le jour du départ. Répondez à cet e-mail ou écrivez-nous sur WhatsApp — comme vous préférez."
    };
    var es = {
      brandSub: "Viajes privados y a medida",
      tour: "Viaje", tail: "A medida",
      price: "Precio", per: "Por persona", tot: "Total orientativo",
      ref: "Referencia", date: "Fecha preferida", lead: "Viajero principal",
      trav: "Viajeros", email: "Correo", phone: "Teléfono", req: "Solicitudes",
      doc: "Documento privado del cliente",
      subj: "Precios por persona y sujetos a la confirmación final del itinerario.",
      note: "Gracias por elegir Abrid Morocco. Tu reserva ya está en manos de Abdellah y Karim, y respondemos personalmente en 2 horas (9:00–21:00, hora de Marruecos) para confirmar la disponibilidad y cerrar los detalles contigo. No se debe ningún pago hasta el día de salida. Responde a este correo o escríbenos por WhatsApp — como prefieras."
    };
    return FR ? fr : (ES ? es : en);
  })();

  /* Floating reserve button */
  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "cart-fab";
  fab.id = "cartFab";
  fab.setAttribute("aria-label", T("Reserve this tour", "Réserver ce circuit", "Reservar este viaje"));
  fab.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span>' + T("Reserve", "Réserver", "Reservar") + '</span>';
  document.body.appendChild(fab);

  /* Modal */
  var overlay = document.createElement("div");
  overlay.className = "cart-overlay";
  overlay.id = "cartOverlay";
  overlay.setAttribute("hidden", "");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", T("Reserve this tour", "Réserver ce circuit"));
  var today = new Date().toISOString().slice(0, 10);
  overlay.innerHTML =
    '<div class="cart-box">' +
    '<button type="button" class="cart-close" id="cartClose" aria-label="' + T("Close", "Fermer", "Cerrar") + '">✕</button>' +
    '<div class="cart-tour"><img id="cartThumb" src="" alt="" loading="lazy">' +
    '<div><strong id="cartTourName"></strong><span id="cartTourMeta"></span></div></div>' +
    '<div id="cartFormWrap">' +
    '<form id="cartForm">' +
    '<div class="cart-grid">' +
    '<div><label for="cartName">' + T("Full name", "Nom complet", "Nombre completo") + '</label><input id="cartName" name="name" required autocomplete="name" placeholder="' + T("Sara", "Sara") + '"></div>' +
    '<div><label for="cartEmail">' + T("Email", "E-mail", "Correo electrónico") + '</label><input id="cartEmail" name="email" type="email" required autocomplete="email" placeholder="' + T("you@example.com", "vous@exemple.com", "tu@ejemplo.com") + '"></div>' +
    '<div><label for="cartPhone">' + T("Phone / WhatsApp", "Téléphone / WhatsApp", "Teléfono / WhatsApp") + '</label><input id="cartPhone" name="phone" autocomplete="tel" placeholder="+33 …"></div>' +
    '<div><label for="cartDate">' + T("Preferred date", "Date souhaitée", "Fecha preferida") + '</label><input id="cartDate" name="date" type="date" min="' + today + '" required></div>' +
    '<div><label for="cartPax">' + T("Travelers", "Voyageurs", "Viajeros") + '</label><input id="cartPax" name="travelers" type="number" min="1" max="30" value="2" required></div>' +
    '<div><label for="cartMsg">' + T("Anything we should know?", "Précisions ?", "¿Algo que debamos saber?") + '</label><input id="cartMsg" name="requests" placeholder="' + T("Hotel, diet, pace…", "Hôtel, régime, rythme…", "Hotel, dieta, ritmo…") + '"></div>' +
    '</div>' +
    '<button type="submit" class="btn btn-primary" id="cartSubmit" style="width:100%;">' + T("Send reservation →", "Envoyer la réservation →", "Enviar reserva →") + '</button>' +
    '<p class="fine">' + T("No payment now — Abdellah or Karim replies personally within 2 hours.", "Aucun paiement maintenant — Abdellah ou Karim répond personnellement sous 2 heures.", "Sin pago ahora — Abdellah o Karim responde personalmente en 2 horas.") + '</p>' +
    '<p class="fine"><a href="plan-my-trip.html" style="color:var(--terracotta,#E4002B);font-weight:700;">' + T("Prefer a fully custom trip? Plan it here →", "Un voyage sur mesure ? Planifiez ici →", "¿Un viaje a medida? Planifícalo aquí →") + '</a></p>' +
    '</form></div></div>';
  document.body.appendChild(overlay);

  function open() { overlay.removeAttribute("hidden"); document.body.style.overflow = "hidden"; }
  function close() { overlay.setAttribute("hidden", ""); document.body.style.overflow = ""; }
  function setTour(key) {
    var t = TOURS[key] || TOURS["private.html"] || tour;
    currentTour = t;
    document.getElementById("cartThumb").src = t.img;
    document.getElementById("cartTourName").textContent = t.name;
    document.getElementById("cartTourMeta").textContent = t.dur + " · " + (t.price || "Quote on request");
    overlay.setAttribute("aria-label", T("Reserve ", "Réserver ", "Reservar ") + t.name);
  }
  setTour(file in TOURS ? file : "private.html");
  fab.addEventListener("click", function () { setTour(file in TOURS ? file : "private.html"); open(); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-reserve-tour]") : null;
    if (!b) return;
    e.preventDefault();
    setTour(b.getAttribute("data-reserve-tour"));
    open();
  });
  overlay.querySelector("#cartClose").addEventListener("click", close);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !overlay.hasAttribute("hidden")) close(); });

  /* Inline "Reserve" buttons (data-open-cart) replace the floating pill where present */
  function refreshPill() {
    var inlineVisible = document.querySelectorAll("[data-open-cart]");
    var anyVisible = false;
    inlineVisible.forEach(function (b) { if (b.offsetParent !== null) anyVisible = true; });
    fab.style.display = anyVisible ? "none" : "";
  }
  refreshPill();
  var rT = false;
  window.addEventListener("resize", function () {
    if (!rT) { rT = true; setTimeout(function () { refreshPill(); rT = false; }, 250); }
  });
  document.querySelectorAll("[data-open-cart]").forEach(function (b) { b.addEventListener("click", open); });

  function loadImageData(url) {
    return fetch(absUrl(url), { mode: "cors" }).then(function (r) {
      if (!r.ok) throw new Error("img " + r.status);
      return r.blob();
    }).then(function (blob) {
      return new Promise(function (res, rej) {
        var fr = new FileReader();
        fr.onload = function () { res({ dataUrl: fr.result, type: blob.type }); };
        fr.onerror = rej;
        fr.readAsDataURL(blob);
      });
    });
  }

  function buildPdf(img, ref) {
    var NS = window.jspdf;
    var doc = new NS.jsPDF({ unit: "mm", format: "a4" });
    var W = 210, y = 0;
    doc.setFillColor(228, 0, 43);
    doc.rect(0, 0, W, 34, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Abrid Morocco", 14, 14);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Tour reservation", 14, 23);
    y = 44;
    if (img && img.dataUrl) {
      try {
        var fmt = img.type.indexOf("png") !== -1 ? "PNG" : "JPEG";
        doc.addImage(img.dataUrl, fmt, 14, y, 60, 40);
      } catch (e) { /* picture optional in PDF */ }
    }
    ref = ref || ("ABR-" + Date.now().toString().slice(-6));
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    var tx = (img && img.dataUrl) ? 80 : 14;
    var title = doc.splitTextToSize(currentTour.name, W - tx - 14);
    doc.text(title, tx, y + 8);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(currentTour.dur + "  ·  Ref " + ref, tx, y + 8 + title.length * 7);
    y = Math.max(y + 46, y + 14 + title.length * 7 + 8);
    function row(k, v) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      doc.text(k + ":", 14, y);
      doc.setFont("helvetica", "normal");
      var lines = doc.splitTextToSize(String(v || "—"), W - 70);
      doc.text(lines, 62, y);
      y += Math.max(7, lines.length * 6) + 2;
    }
    var g = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
    row("Name", g("cartName"));
    row("Email", g("cartEmail"));
    row("Phone", g("cartPhone"));
    row("Date", g("cartDate"));
    row("Travelers", g("cartPax"));
    row("Price", currentTour.price || "Quote on request");
    row("Requests", g("cartMsg"));
    row("Received", new Date().toLocaleString());
    y += 6;
    doc.setDrawColor(228, 0, 43);
    doc.line(14, y, W - 14, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("A little letter for our guest", 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    var letterFR = "Merci d'avoir choisi Abrid Morocco ! Votre réservation pour \"" + currentTour.name + "\" (" + ref + ") est entre les mains d'Abdellah et Karim. Nous répondons personnellement sous 2 heures (9h00-21h00, heure du Maroc) pour confirmer la disponibilité et régler les derniers détails. Aucun paiement n'est dû avant le jour du départ. Nous avons hâte de vous faire découvrir notre Maroc.";
    var letterES = "Gracias por elegir Abrid Morocco. Tu reserva de \"" + currentTour.name + "\" (" + ref + ") está en manos de Abdellah y Karim. Respondemos personalmente en 2 horas (9:00-21:00, hora de Marruecos) para confirmar disponibilidad y ultimar detalles. No se debe ningún pago hasta el día de salida. Estamos deseando mostrarte nuestro Marruecos.";
    var letterEN = "Thank you for choosing Abrid Morocco! Your reservation for \"" + currentTour.name + "\" (" + ref + ") is with Abdellah and Karim now. We reply personally within 2 hours (9:00-21:00 Morocco time) to confirm availability and shape the final details. No payment is due until tour day. We cannot wait to show you our Morocco.";
    var letter = doc.splitTextToSize(FR ? letterFR : (ES ? letterES : letterEN), W - 28);
    doc.text(letter, 14, y);
    y += letter.length * 5 + 10;
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text("Abrid Morocco · +212 762 934 488 · hello@abridmorocco.com · abridmorocco.com", 14, 287);
    return { doc: doc, ref: ref };
  }

  /* ═══════════════════════════════════════════════════════════════════
     buildCardPdf — the same card as booking-card-*.html, drawn in PDF.
     Status drives the badge and the top ribbon so the two never
     disagree. Colours are the web brand: #E4002B on #141414.
     ═══════════════════════════════════════════════════════════════════ */
  function buildCardPdf(d) {
    var NS = window.jspdf;
    var doc = new NS.jsPDF({ unit: "mm", format: "a4" });
    var W = 210, M = 14, LH = 7.5;

    var RED = [228, 0, 43], INK = [20, 20, 20], GREY = [107, 107, 112];
    var LINE = [231, 228, 224], SAND = [246, 241, 234];

    var STATUS = {
      pending:   { t: "PENDING REVIEW",    fg: [255, 194, 75],  bg: [58, 44, 20],  bd: [120, 90, 35] },
      confirmed: { t: "CONFIRMED",         fg: [95, 227, 161],  bg: [18, 48, 36],  bd: [40, 110, 78] },
      deposit:   { t: "DEPOSIT RECEIVED",  fg: [143, 192, 255], bg: [20, 36, 62],  bd: [55, 100, 160] },
      cancelled: { t: "CANCELLED",         fg: [255, 143, 160], bg: [60, 22, 30],  bd: [140, 55, 70] }
    };
    var RIBBON = {
      pending:   [[228, 0, 43], [255, 106, 77], [233, 185, 73]],
      confirmed: [[15, 157, 88], [95, 227, 161], [233, 185, 73]],
      deposit:   [[27, 95, 191], [143, 192, 255], [233, 185, 73]],
      cancelled: [[176, 0, 32], [255, 143, 160], [138, 138, 143]]
    };
    var key = STATUS[d.status] ? d.status : "pending";
    var st = STATUS[key], rb = RIBBON[key];

    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function ink(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function line(c, w) { doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(w || 0.3); }

    /* top ribbon */
    for (var i = 0; i < 3; i++) { fill(rb[i]); doc.rect(i * 70, 0, 70, 2.4, "F"); }

    /* dark header */
    fill(INK); doc.rect(0, 2.4, W, 34, "F");

    fill(RED); doc.roundedRect(M, 11, 12, 12, 3, 3, "F");
    ink([255, 255, 255]); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("A", M + 6, 19.2, { align: "center" });

    doc.setFontSize(11.5);
    doc.text("ABRID MOROCCO TRIP", M + 17, 16.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(6.6); ink([150, 150, 155]);
    doc.text(CARD_L.brandSub, M + 17, 21.6);

    /* status badge, right aligned */
    doc.setFont("helvetica", "bold"); doc.setFontSize(7);
    var stW = doc.getTextWidth(st.t) + 9;
    fill(st.bg); line(st.bd, 0.3);
    doc.roundedRect(W - M - stW, 12, stW, 7, 3.5, 3.5, "FD");
    ink(st.fg);
    doc.text(st.t, W - M - stW / 2, 16.7, { align: "center" });

    doc.setFont("helvetica", "normal"); doc.setFontSize(6); ink([120, 120, 125]);
    doc.text("BOOKING CARD", W - M, 24, { align: "right" });

    /* tour + price */
    var y = 46;
    doc.setFont("helvetica", "bold"); doc.setFontSize(7); ink(GREY);
    doc.text(CARD_L.tour.toUpperCase(), M, y);

    doc.setFontSize(17); ink(INK);
    var nameLines = doc.splitTextToSize(d.tour || "—", 104).slice(0, 4);
    doc.text(nameLines, M, y + 8);
    var nameBottom = y + 8 + (nameLines.length - 1) * LH;

    /* chips */
    var cy = nameBottom + 6;
    var chips = [];
    if (d.dur) chips.push(d.dur);
    if (d.pax) chips.push(d.pax + " " + CARD_L.trav);
    chips.push(CARD_L.tail);
    var cxp = M;
    for (var k = 0; k < chips.length; k++) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(7);
      var w = doc.getTextWidth(chips[k]) + 8;
      if (cxp + w > W - M - 52) break;
      fill(SAND); line([239, 230, 218], 0.3);
      doc.roundedRect(cxp, cy, w, 6.4, 3.2, 3.2, "FD");
      ink([92, 70, 50]);
      doc.text(chips[k], cxp + 4, cy + 4.4);
      cxp += w + 2.5;
    }
    var chipsBottom = cy + 6.4;

    doc.setFont("helvetica", "bold"); doc.setFontSize(7); ink(GREY);
    doc.text(CARD_L.price.toUpperCase(), W - M, y, { align: "right" });
    /* keep a long price string clear of the tour title on the left */
    var priceTxt = d.price || "—";
    var pfs = 18;
    doc.setFontSize(pfs);
    while (pfs > 10 && doc.getTextWidth(priceTxt) > 80) {
      pfs -= 0.5;
      doc.setFontSize(pfs);
    }
    ink(INK);
    doc.text(priceTxt, W - M, y + 9, { align: "right" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(6.4); ink(GREY);
    doc.text(CARD_L.per.toUpperCase(), W - M, y + 14.5, { align: "right" });
    var priceBottom = y + 14.5;

    var per = moneyNum(d.price);
    if (per && d.paxNum > 1) {
      var totTxt = CARD_L.tot + " · " + money(per * d.paxNum);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7);
      line(LINE, 0.2);
      doc.setLineDashPattern([0.6, 0.6], 0);
      doc.line(W - M - doc.getTextWidth(totTxt), y + 17.5, W - M, y + 17.5);
      doc.setLineDashPattern([], 0);
      ink(GREY);
      doc.text(totTxt, W - M, y + 22.5, { align: "right" });
      priceBottom = y + 22.5;
    }

    line(LINE, 0.3);
    var divY = Math.max(chipsBottom, priceBottom) + 7;
    doc.line(M, divY, W - M, divY);

    /* detail rows, two columns */
    var rows = [
      [CARD_L.ref.toUpperCase(),   d.ref,     RED],
      [CARD_L.date.toUpperCase(),  d.dateText, INK],
      [CARD_L.lead.toUpperCase(),  d.name,    INK],
      [CARD_L.trav.toUpperCase(),  d.paxText, INK],
      [CARD_L.email.toUpperCase(), d.email,   INK],
      [CARD_L.phone.toUpperCase(), d.phone,   INK]
    ];
    var colW = (W - 2 * M - 12) / 2;
    var rx1 = M + colW + 12;
    var ry = divY + 11, ROWH = 17;

    for (var ri = 0; ri < rows.length; ri++) {
      var cx = (ri % 2 === 0) ? M : rx1;
      var ry2 = ry + Math.floor(ri / 2) * ROWH;

      fill([253, 236, 238]);
      doc.roundedRect(cx, ry2 - 3.4, 6, 6, 1.6, 1.6, "F");
      fill(RED); doc.circle(cx + 3, ry2 - 0.4, 1, "F");

      doc.setFont("helvetica", "bold"); doc.setFontSize(6); ink(GREY);
      doc.text(rows[ri][0], cx + 9, ry2);

      /* Shrink an over-long value (a long email address, say) to fit on
         one line rather than clipping it — a truncated address is far
         worse than a slightly smaller one. */
      var val = rows[ri][1] || "—";
      doc.setFontSize(9.5);
      var vLines = doc.splitTextToSize(val, colW - 9);
      if (vLines.length > 1) {
        var fs = 9.5;
        while (fs > 6.4) {
          fs -= 0.25;
          doc.setFontSize(fs);
          vLines = doc.splitTextToSize(val, colW - 9);
          if (vLines.length === 1) break;
        }
      }
      ink(rows[ri][2]);
      doc.text(vLines.slice(0, 1), cx + 9, ry2 + 5);
    }
    var gridBottom = ry + Math.ceil(rows.length / 2) * ROWH;

    /* requests — the font must be set BEFORE measuring, otherwise the wrap is
       computed at one size and drawn at another and the line runs off
       the page. */
    var qy = gridBottom + 2;
    doc.setFont("helvetica", "bolditalic"); doc.setFontSize(11);
    var reqLines = doc.splitTextToSize(d.requests || "—", W - 2 * M - 16);
    var boxH = 12 + reqLines.length * 6;
    fill([253, 246, 240]);
    doc.roundedRect(M, qy, W - 2 * M, boxH, 3, 3, "F");
    fill(RED); doc.rect(M, qy, 1.6, boxH, "F");

    doc.setFont("helvetica", "bold"); doc.setFontSize(6); ink(RED);
    doc.text(CARD_L.req.toUpperCase(), M + 8, qy + 6.5);
    doc.setFont("helvetica", "bolditalic"); doc.setFontSize(11); ink(INK);
    doc.text(reqLines, M + 8, qy + 13);

    /* personal note */
    var ny = qy + boxH + 13;
    line(LINE, 0.3);
    doc.line(M, ny, W - M, ny);
    doc.setFont("helvetica", "bold"); doc.setFontSize(6); ink(RED);
    doc.text(T("A LITTLE NOTE FOR YOU", "UN MOT POUR VOUS", "UNA NOTA PARA TI"), M, ny + 7);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); ink([72, 72, 78]);
    var noteLines = doc.splitTextToSize(CARD_L.note, W - 2 * M);
    doc.text(noteLines, M, ny + 14);

    /* footer */
    line(LINE, 0.3);
    doc.line(M, 277, W - M, 277);
    doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); ink([140, 140, 145]);
    doc.text("Abrid Morocco  ·  +212 762 934 488  ·  hello@abridmorocco.com  ·  abridmorocco.com", M, 283);
    doc.text(CARD_L.doc + "  ·  " + CARD_L.ref + " " + (d.ref || ""), W - M, 283, { align: "right" });
    doc.text(CARD_L.subj, M, 288);

    return doc;
  }

  /* ---------------------------------------------------------------- card
     Hands the finished PDFs to /api/booking, which mails them with Resend.
     FormSubmit cannot do this job — see the note at the call site. Every
     failure is swallowed on purpose: the notification has already been sent
     by then, so a broken card path must never surface to the guest. */
  function deliverCard(d, cardPdf, resvPdf) {
    return fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tour: d.tour, dur: d.dur, price: d.price, ref: d.ref,
        name: d.name, email: d.email, phone: d.phone,
        dateText: d.dateText, paxText: d.paxText, requests: d.requests,
        cardPdf: cardPdf, reservationPdf: resvPdf
      })
    }).then(function (r) {
      return r.json().catch(function () { return {}; });
    }).catch(function () {
      return {};
    });
  }

  overlay.querySelector("#cartForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var btn = document.getElementById("cartSubmit");
    btn.disabled = true;
    btn.textContent = "Sending…";
    var g = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
    var name = g("cartName"), email = g("cartEmail");
    var paxNum = parseInt(g("cartPax"), 10) || 1;
    /* One reference for the whole submission so the mail, the reservation
       PDF and the booking card all all quote the same number. */
    var ref = "ABR-" + Date.now().toString().slice(-6);
    var guestMail = isEmail(email);
    loadImageData(currentTour.img).catch(function () { return null; }).then(function (img) {
      var out = buildPdf(img, ref);
      var cardDoc = buildCardPdf({
        status: "pending",
        ref: ref,
        tour: currentTour.name,
        dur: currentTour.dur,
        price: currentTour.price,
        name: name,
        email: email,
        phone: g("cartPhone"),
        date: g("cartDate"),
        dateText: niceDate(g("cartDate")),
        pax: g("cartPax"),
        paxNum: paxNum,
        paxText: g("cartPax") + " " + CARD_L.trav,
        requests: g("cartMsg")
      });
      var fd = new FormData();
      fd.append("_subject", "New tour reservation – " + currentTour.name + " (" + ref + ")");
      fd.append("_template", "table");
      /* Reply lands straight in the guest's inbox if anything is unclear. */
      if (guestMail) fd.append("_replyto", email);
      /* Guest copy of the card. Off by default — see AUTO_SEND_CARD at the
         top of this file. FormSubmit's own _autoresponse is documented as
         not working over AJAX, so an automatic send has to ride along as a
         carbon copy of this notification. */
      if (AUTO_SEND_CARD && guestMail) fd.append("_cc", email);
      fd.append("Tour", currentTour.name);
      fd.append("Duration", currentTour.dur);
      fd.append("Price", currentTour.price || "Quote on request");
      fd.append("Reference", ref);
      fd.append("Name", name);
      fd.append("Email", email);
      fd.append("Phone", g("cartPhone"));
      fd.append("Preferred date", g("cartDate"));
      fd.append("Travelers", g("cartPax"));
      fd.append("Requests", g("cartMsg"));

      /* The PDFs go to /api/booking, never to FormSubmit. That endpoint is
         verified to drop every file attachment while still answering
         {"success":"true"}, so sending them there achieves nothing but a
         bigger request. */
      var cardPdf = null, resvPdf = null;
      try { resvPdf = out.doc.output("datauristring"); } catch (e) {}
      try { cardPdf = cardDoc.output("datauristring"); } catch (e) {}

      return fetch("https://formsubmit.co/ajax/" + OWNER_EMAIL, { method: "POST", body: fd })
        .then(function (r) {
          /* Only now that the notification is safely away do we chase the
             card. Fire and forget: nothing here can cost a lead, and the
             guest is never blocked waiting on it. */
          if (cardPdf || resvPdf) {
            deliverCard({
              tour: currentTour.name,
              dur: currentTour.dur,
              price: currentTour.price || "Quote on request",
              ref: ref,
              name: name,
              email: email,
              phone: g("cartPhone"),
              dateText: niceDate(g("cartDate")),
              paxText: g("cartPax") + " " + CARD_L.trav,
              requests: g("cartMsg")
            }, cardPdf, resvPdf);
          }
          return r;
        });
    }).then(function (r) {
      if (!r.ok) throw new Error("send failed");
      document.getElementById("cartFormWrap").innerHTML =
        '<div class="abrid-popup-ok" style="text-align:center;padding:18px 6px;">' +
        '<div style="font-size:2.4rem;">🎉</div>' +
        "<h3>" + T("Reservation received!", "Réservation reçue !", "¡Reserva recibida!") + "</h3>" +
        '<p style="font-weight:700;letter-spacing:.06em;margin:2px 0 10px;">' +
        T("Reference ", "Référence ", "Referencia ") + esc(ref) + "</p>" +
        "<p style=\"color:var(--muted);\">" + T("Thank you, ", "Merci, ", "Gracias, ") + esc(name.split(" ")[0]) +
        /* Only promise a card in the guest's inbox when one is really sent. */
        ((AUTO_SEND_CARD && guestMail)
          ? T(" — your booking card is on its way to this email address. Abdellah or Karim replies personally within 2 hours.",
              " — votre carte de réservation est en route vers cette adresse e-mail. Abdellah ou Karim répond personnellement sous 2 heures.",
              " — tu tarjeta de reserva va en camino a esta dirección de correo. Abdellah o Karim responde personalmente en 2 horas.")
          : T(" — we have your request. Abdellah or Karim replies personally within 2 hours with your booking card.",
              " — nous avons bien reçu votre demande. Abdellah ou Karim répond personnellement sous 2 heures avec votre carte de réservation.",
              " — hemos recibido tu solicitud. Abdellah o Karim te responde personalmente en 2 horas con tu tarjeta de reserva."))
        + "</p>" +
        '<button type="button" class="btn btn-secondary" id="cartDone">' + T("Continue exploring", "Continuer à explorer", "Seguir explorando") + '</button></div>';
      document.getElementById("cartDone").addEventListener("click", close);
    }).catch(function () {
      var text = encodeURIComponent("Hello Abrid Morocco! I would like to reserve: " + currentTour.name +
        " (" + currentTour.dur + "). Name: " + name + ", Email: " + email);
      document.getElementById("cartFormWrap").innerHTML =
        '<div style="text-align:center;padding:18px 6px;"><h3>' + T("Sending hiccup", "Petit problème d'envoi", "Problema de envío") + '</h3>' +
        '<p style="color:var(--muted);">' + T("Please send your reservation directly:", "Veuillez envoyer votre réservation directement :", "Envía tu reserva directamente:") + '</p>' +
        '<a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/' + WA_NUMBER + "?text=" + text + '">' + T("Send via WhatsApp", "Envoyer via WhatsApp", "Enviar por WhatsApp") + '</a></div>';
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = T("Send reservation →", "Envoyer la réservation →");
    });
  });
})();
