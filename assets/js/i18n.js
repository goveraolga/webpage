/* =========================================================
   i18n.js — language toggle (EN / PL) with circular flags
   ---------------------------------------------------------
   - Translates any element carrying a data-i18n* attribute:
       data-i18n            → textContent
       data-i18n-html       → innerHTML
       data-i18n-placeholder→ placeholder attribute
       data-i18n-aria-label → aria-label attribute
   - Page <title> comes from <body data-i18n-title="KEY">
   - Choice is saved in localStorage and shared across pages.
   - The circular flag shows the CURRENTLY selected language;
     clicking it switches to the other language.
   ========================================================= */
(function () {
  "use strict";

  const STRINGS = {
    en: {
      title_home:    "Govera — Handmade Luxury Dresses",
      title_gallery: "Gallery — Govera Handmade Luxury Dresses",
      title_contact: "Contact — Govera Handmade Luxury Dresses",

      nav_home: "Home", nav_gallery: "Gallery", nav_contact: "Contact",

      hero_eyebrow: "Handmade · Bespoke · Timeless",
      hero_title:   "Handmade luxury dresses",
      hero_desc:    "Each dress is carefully designed and sewn by hand, created individually for women who appreciate elegance and uniqueness.",
      hero_cta:     "View Collection",

      about_eyebrow: "The Maker",
      about_title:   "Sewn by hand, made for you",
      about_p1:      "I create handmade dresses with attention to every detail. Every piece is sewn personally and can be customized according to the client's wishes.",
      about_p2:      "What began as a passion for craftsmanship has become a small atelier devoted to elegance — slow fashion, made to last, made to feel like yours alone.",
      about_cta:     "Request a custom piece",

      feat_eyebrow: "Selected Pieces",
      feat_title:   "Featured dresses",
      feat_desc:    "A rotating selection from the collection. Tap any dress to view it up close.",
      feat_cta:     "View Full Collection",

      gallery_eyebrow: "The Collection",
      gallery_title:   "Gallery",
      gallery_desc:    "Every dress is handmade and one of a kind. Tap any piece to view it full screen — swipe or use the arrows to browse.",
      gallery_cta:     "Enquire or order a custom piece",

      contact_eyebrow: "Say Hello",
      contact_title:   "Let's create together",
      contact_desc:    "For orders, custom designs or any question, reach out.",
      contact_phone:   "Phone",
      contact_email:   "Email",
      contact_ig:      "Instagram",
      form_name:       "Name",
      form_email:      "Email",
      form_message:    "Message",
      form_placeholder:"Tell me about the dress you have in mind…",
      form_submit:     "Send message",
      form_hint_html:  "To enable this form, create a free form at formspree.io and replace <code>your-form-id</code> in the form action.",

      footer_home: "Home",
      footer_tagline: "Handmade luxury dresses",
      prev: "Previous", next: "Next", menu: "Menu",
      switch_lang: "Zmień język na polski",
    },
    pl: {
      title_home:    "Govera — Ręcznie szyte luksusowe sukienki",
      title_gallery: "Galeria — Govera Ręcznie szyte luksusowe sukienki",
      title_contact: "Kontakt — Govera Ręcznie szyte luksusowe sukienki",

      nav_home: "Strona główna", nav_gallery: "Galeria", nav_contact: "Kontakt",

      hero_eyebrow: "Ręcznie szyte · Na zamówienie · Ponadczasowe",
      hero_title:   "Ręcznie szyte luksusowe sukienki",
      hero_desc:    "Każda sukienka jest starannie zaprojektowana i uszyta ręcznie, tworzona indywidualnie dla kobiet, które cenią elegancję i wyjątkowość.",
      hero_cta:     "Zobacz kolekcję",

      about_eyebrow: "Twórczyni",
      about_title:   "Szyte ręcznie, tworzone dla Ciebie",
      about_p1:      "Tworzę ręcznie szyte sukienki z dbałością o każdy detal. Każdy egzemplarz szyję osobiście i mogę dostosować go do życzeń klientki.",
      about_p2:      "To, co zaczęło się jako pasja do rzemiosła, stało się małą pracownią poświęconą elegancji — moda powściągliwa, tworzona na lata, tworzona tak, by była tylko Twoja.",
      about_cta:     "Zamów projekt na miarę",

      feat_eyebrow: "Wybrane modele",
      feat_title:   "Wyróżnione sukienki",
      feat_desc:    "Zmieniający się wybór z kolekcji. Dotknij dowolną sukienkę, aby zobaczyć ją z bliska.",
      feat_cta:     "Zobacz całą kolekcję",

      gallery_eyebrow: "Kolekcja",
      gallery_title:   "Galeria",
      gallery_desc:    "Każda sukienka jest szyta ręcznie i jedyna w swoim rodzaju. Dotknij dowolny model, aby zobaczyć go na pełnym ekranie — przesuwaj palcem lub używaj strzałek.",
      gallery_cta:     "Zapytaj lub zamów projekt na miarę",

      contact_eyebrow: "Napisz do mnie",
      contact_title:   "Stwórzmy coś razem",
      contact_desc:    "W sprawie zamówień, projektów indywidualnych lub jakichkolwiek pytań — napisz.",
      contact_phone:   "Telefon",
      contact_email:   "E-mail",
      contact_ig:      "Instagram",
      form_name:       "Imię",
      form_email:      "E-mail",
      form_message:    "Wiadomość",
      form_placeholder:"Opisz sukienkę, o której myślisz…",
      form_submit:     "Wyślij wiadomość",
      form_hint_html:  "Aby uruchomić formularz, utwórz darmowy formularz na formspree.io i zamień <code>your-form-id</code> w polu action.",

      footer_home: "Home",
      footer_tagline: "Ręcznie szyte luksusowe sukienki",
      prev: "Poprzednia", next: "Następna", menu: "Menu",
      switch_lang: "Switch language to English",
    },
  };

  /* ---------- circular flag SVGs ---------- */
  const FLAGS = {
    // Poland — shown when Polish is the active language
    pl: `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <defs><clipPath id="plc"><circle cx="18" cy="18" r="18"/></clipPath></defs>
           <g clip-path="url(#plc)">
             <rect width="36" height="18" fill="#ffffff"/>
             <rect y="18" width="36" height="18" fill="#dc143c"/>
           </g>
           <circle cx="18" cy="18" r="17.4" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="1.2"/>
         </svg>`,
    // United Kingdom — shown when English is the active language
    en: `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <defs><clipPath id="gbc"><circle cx="18" cy="18" r="18"/></clipPath></defs>
           <g clip-path="url(#gbc)">
             <svg x="0" y="0" width="36" height="36" viewBox="15 0 30 30" preserveAspectRatio="xMidYMid slice">
               <clipPath id="ujt"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
               <clipPath id="ujs"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
               <g clip-path="url(#ujt)">
                 <rect width="60" height="30" fill="#012169"/>
                 <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                 <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#ujs)" stroke="#C8102E" stroke-width="4"/>
                 <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
                 <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
               </g>
             </svg>
           </g>
           <circle cx="18" cy="18" r="17.4" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="1.2"/>
         </svg>`,
  };

  const KEY = "olga-lang";

  function detect() {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "pl") return saved;
    return (navigator.language || "en").toLowerCase().startsWith("pl") ? "pl" : "en";
  }

  let lang = detect();

  function t(key) {
    return (STRINGS[lang] && STRINGS[lang][key]) || (STRINGS.en[key] || "");
  }

  function apply() {
    document.documentElement.lang = lang;

    // page title
    const tkey = document.body.getAttribute("data-i18n-title");
    if (tkey) document.title = t(tkey);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n-html"));
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n-placeholder"));
      if (v) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n-aria-label"));
      if (v) el.setAttribute("aria-label", v);
    });

    // flag toggle reflects the CURRENT language
    const btn = document.querySelector("[data-lang-toggle]");
    if (btn) {
      btn.innerHTML = FLAGS[lang];
      btn.setAttribute("aria-label", t("switch_lang"));
      btn.setAttribute("title", t("switch_lang"));
    }
  }

  function toggle() {
    lang = lang === "en" ? "pl" : "en";
    localStorage.setItem(KEY, lang);
    apply();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("[data-lang-toggle]");
    if (btn) btn.addEventListener("click", toggle);
    apply();
  });
})();
