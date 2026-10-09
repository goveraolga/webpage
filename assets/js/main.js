/* =========================================================
   main.js — navigation, placeholders, carousel, gallery, lightbox
   Depends on products.js (PRODUCTS array) being loaded first.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* Elegant inline SVG placeholder used when a photo file is missing,
     so the site looks complete before real photos are added. */
  function placeholder(name) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#efe7dd"/>
            <stop offset="1" stop-color="#e0d2c1"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#g)"/>
        <rect x="14" y="14" width="272" height="372" fill="none"
              stroke="#b08d57" stroke-opacity="0.5" stroke-width="1"/>
        <text x="150" y="186" text-anchor="middle" fill="#8c6d3f"
              font-family="Georgia, serif" font-size="15"
              letter-spacing="3">HANDMADE</text>
        <text x="150" y="214" text-anchor="middle" fill="#211c18"
              font-family="Georgia, serif" font-size="22"
              font-style="italic">${(name || "Dress").replace(/&/g, "&amp;")}</text>
      </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim());
  }

  /* Build an <img> that falls back to a placeholder on load error. */
  function makeImg(p, eager) {
    const img = document.createElement("img");
    img.alt = p.name + " — handmade dress";
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    img.dataset.fallback = placeholder(p.name);
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      img.src = img.dataset.fallback;
    });
    img.src = p.img;
    return img;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* =========================================================
     1. Navigation (hamburger + sticky)
     ========================================================= */
  function initNav() {
    const nav = $(".nav");
    const toggle = $(".nav__toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // close menu when a link is tapped (mobile)
    $$(".nav__links a", nav).forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* =========================================================
     2. Reveal-on-scroll
     ========================================================= */
  function initReveal() {
    const els = $$(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* =========================================================
     3. Lightbox (shared by carousel + gallery)
     items: [{img, name}], opens at index, supports keys + swipe
     ========================================================= */
  function createLightbox() {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `
      <button class="lightbox__close" aria-label="Close">&times;</button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">&#8249;</button>
      <div class="lightbox__stage">
        <img class="lightbox__img" alt="">
        <p class="lightbox__caption"></p>
      </div>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Next">&#8250;</button>`;
    document.body.appendChild(box);

    const imgEl = $(".lightbox__img", box);
    const capEl = $(".lightbox__caption", box);
    let items = [];
    let i = 0;

    function render() {
      const it = items[i];
      imgEl.style.animation = "none";
      // restart fade-in animation
      void imgEl.offsetWidth;
      imgEl.style.animation = "";
      imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = placeholder(it.name); };
      imgEl.src = it.img;
      imgEl.alt = it.name;
      capEl.textContent = it.name;
    }
    function open(list, index) {
      items = list; i = index;
      render();
      box.classList.add("open");
      requestAnimationFrame(() => box.classList.add("visible"));
      document.body.style.overflow = "hidden";
    }
    function close() {
      box.classList.remove("visible");
      document.body.style.overflow = "";
      setTimeout(() => box.classList.remove("open"), 300);
    }
    function next() { i = (i + 1) % items.length; render(); }
    function prev() { i = (i - 1 + items.length) % items.length; render(); }

    $(".lightbox__close", box).addEventListener("click", close);
    $(".lightbox__nav--next", box).addEventListener("click", next);
    $(".lightbox__nav--prev", box).addEventListener("click", prev);
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });

    // swipe
    let x0 = null;
    box.addEventListener("touchstart", (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) (dx < 0 ? next() : prev());
      x0 = null;
    }, { passive: true });

    return { open };
  }

  /* =========================================================
     4. Featured carousel (home)
     1 / 2 / 3 per view, autoplay, infinite loop, click → lightbox
     ========================================================= */
  function initCarousel(lightbox) {
    const root = $("[data-carousel]");
    if (!root) return;

    const track = $(".carousel__track", root);
    const dotsWrap = $(".carousel__dots", root);
    const featured = shuffle(PRODUCTS).slice(0, Math.min(8, PRODUCTS.length));

    featured.forEach((p, idx) => {
      const slide = document.createElement("div");
      slide.className = "carousel__slide";
      const card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;
      const media = document.createElement("div");
      media.className = "card__media";
      media.appendChild(makeImg(p, idx < 3));
      const body = document.createElement("div");
      body.className = "card__body";
      body.innerHTML = `<h3 class="card__name">${p.name}</h3><p class="card__tag">${p.tag}</p>`;
      card.append(media, body);
      const open = () => lightbox.open(featured, idx);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
      slide.appendChild(card);
      track.appendChild(slide);
    });

    function perView() {
      const w = window.innerWidth;
      if (w >= 980) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    let pos = 0;
    let timer = null;

    function pages() { return Math.max(1, featured.length - perView() + 1); }
    function go(p) {
      const max = pages() - 1;
      pos = p < 0 ? max : p > max ? 0 : p;       // infinite wrap
      const slideW = 100 / perView();
      track.style.transform = `translateX(-${pos * slideW}%)`;
      renderDots();
    }
    function renderDots() {
      dotsWrap.innerHTML = "";
      for (let p = 0; p < pages(); p++) {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Go to slide " + (p + 1));
        if (p === pos) b.classList.add("active");
        b.addEventListener("click", () => { go(p); restart(); });
        dotsWrap.appendChild(b);
      }
    }
    function play() { timer = setInterval(() => go(pos + 1), 3500); }
    function stop() { clearInterval(timer); }
    function restart() { stop(); play(); }

    $(".carousel__btn--next", root).addEventListener("click", () => { go(pos + 1); restart(); });
    $(".carousel__btn--prev", root).addEventListener("click", () => { go(pos - 1); restart(); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => go(Math.min(pos, pages() - 1)), 150);
    });

    go(0);
    play();
  }

  /* =========================================================
     5. Gallery grid
     ========================================================= */
  function initGallery(lightbox) {
    const grid = $("[data-gallery]");
    if (!grid) return;
    PRODUCTS.forEach((p, idx) => {
      const item = document.createElement("button");
      item.className = "grid__item";
      item.type = "button";
      item.setAttribute("aria-label", "View " + p.name);
      item.appendChild(makeImg(p, idx < 6));
      const overlay = document.createElement("div");
      overlay.className = "grid__overlay";
      overlay.innerHTML = `<span>${p.name}</span>`;
      item.appendChild(overlay);
      item.addEventListener("click", () => lightbox.open(PRODUCTS, idx));
      grid.appendChild(item);
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    const lightbox = createLightbox();
    initCarousel(lightbox);
    initGallery(lightbox);
    const yr = $("#year");
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();
