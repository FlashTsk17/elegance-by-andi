const CATEGORY_LABELS = {
  sacs: "Sac",
  coussins: "Coussin",
  cardigans: "Cardigan"
};

const WHATSAPP_NUMBER = "2290196172181";

function waLink(productName) {
  const text = encodeURIComponent(`Bonjour, je suis intéressé(e) par : ${productName}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function placeholderIcon(category) {
  const icons = {
    sacs: `<svg viewBox="0 0 48 48" fill="none"><path d="M14 18 L14 12 C14 7 17 4 24 4 C31 4 34 7 34 12 L34 18" stroke="currentColor" stroke-width="1.8"/><rect x="8" y="18" width="32" height="24" rx="2" stroke="currentColor" stroke-width="1.8"/></svg>`,
    coussins: `<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" stroke-width="1.8"/><path d="M8 24 Q 24 16 40 24" stroke="currentColor" stroke-width="1.2"/></svg>`,
    cardigans: `<svg viewBox="0 0 48 48" fill="none"><path d="M14 10 L10 16 L14 20 L14 42 L34 42 L34 20 L38 16 L34 10 L28 14 L20 14 Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
  };
  return icons[category] || icons.sacs;
}

function productCard(p) {
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}">`
    : `${placeholderIcon(p.category)}<span class="ph-note">Photo à venir</span>`;

  return `
    <article class="product-card" data-category="${p.category}">
      <div class="product-media" style="color:var(--cocoa)">${media}</div>
      <div class="product-body">
        <div class="cat-tag">${CATEGORY_LABELS[p.category] || p.category}</div>
        <h3>${p.name}</h3>
        <div class="price">${p.price}</div>
        <p class="desc">${p.description}</p>
        <p class="delay">${p.delay}</p>
        <a class="btn-whatsapp" href="${waLink(p.name)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:15px;height:15px;"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5C10.1 9 9.6 7.7 9.4 7.2c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.4 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.4 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.1 15 3.6 13.5 3.6 12c0-4.6 3.8-8.4 8.4-8.4s8.4 3.8 8.4 8.4-3.8 8.4-8.4 8.4z"/></svg>
          Commander
        </a>
      </div>
    </article>
  `;
}

async function loadCatalogue() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  let data;
  try {
    const res = await fetch("data/products.json");
    data = await res.json();
  } catch (e) {
    grid.innerHTML = `<p>Le catalogue n'a pas pu être chargé pour le moment.</p>`;
    return;
  }

  const products = data.products || [];
  grid.innerHTML = products.map(productCard).join("");

  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get("cat");

  const buttons = document.querySelectorAll(".filter-row button");
  function applyFilter(cat) {
    document.querySelectorAll(".product-card").forEach(card => {
      card.style.display = (cat === "all" || card.dataset.category === cat) ? "" : "none";
    });
    buttons.forEach(b => b.classList.toggle("active", b.dataset.filter === cat));
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  applyFilter(initialCat && CATEGORY_LABELS[initialCat] ? initialCat : "all");
}

function setupMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".mobile-nav .close-toggle");
  const panel = document.querySelector(".mobile-nav");
  if (!toggle || !panel) return;

  function open() {
    panel.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    panel.classList.remove("open");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  panel.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
}

document.addEventListener("DOMContentLoaded", () => {
  loadCatalogue();
  setupMobileNav();
});
