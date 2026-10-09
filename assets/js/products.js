/* =========================================================
   PRODUCT CATALOG  —  edit this file to manage your dresses
   ---------------------------------------------------------
   Naming convention for photos (suggested):

       dress-01-emerald-silk.jpg
       dress-02-blush-tulle.jpg
       └──┬──┘ └┬┘ └────┬────┘
        prefix  id   short name (lowercase, dashes)

   Put the files in:  /assets/images/
   Recommended: portrait 3:4 ratio, ~1000px wide, JPG/WebP, < 300 KB each.

   If a photo file is missing, the site automatically shows an
   elegant placeholder with the dress name — so you can launch
   first and add real photos later, no code changes needed.
   ========================================================= */

const PRODUCTS = [
  { id: "01", name: "Nice Beach",     tag: "Summer",   img: "assets/images/dress-01-nice-beach.jpg" },
  { id: "02", name: "Łódeczki na Plaży", tag: "Summer", img: "assets/images/dress-02-lodeczki-na-plazy.jpg" },
  { id: "03", name: "Morze",          tag: "Summer",   img: "assets/images/dress-03-morze.jpg" },
  { id: "04", name: "Jeziorko",       tag: "Daywear",  img: "assets/images/dress-04-jeziorko-lodzczki-lasek.jpg" },
  { id: "05", name: "Górki i Laski",  tag: "Daywear",  img: "assets/images/dress-05-gorki-laski-itp.jpg" },
  { id: "06", name: "Lasek",          tag: "Daywear",  img: "assets/images/dress-06-lasek-kolo.jpg" },
  { id: "07", name: "Black & White",  tag: "Evening",  img: "assets/images/dress-07-black-and-white-ludzkiki.jpg" },
];
