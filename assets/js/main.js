import { loadHeaderFooter } from './modules/menu.js';
import { Cart } from './modules/cart.js';
import { Wishlist } from './modules/wishlist.js';
import { API } from './utils/api.js';
import { formatPrice } from './utils/helpers.js';
import { initCarousel } from './modules/carousel.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Load Header and Footer Partials
  await loadHeaderFooter();

  // Initialize Cart and Wishlist Badges
  Cart.initBadges();
  Wishlist.initBadges();

  // If on index.html page, load home page dynamic carousels
  if (document.getElementById('newArrivalsCarousel')) {
    loadHomePageCarousels();
  }
});

async function loadHomePageCarousels() {
  const products = await API.getProducts();

  const newProducts = products.filter(p => p.isNew).slice(0, 8);
  const bestProducts = products.filter(p => p.isBestSeller).slice(0, 8);

  const newContainer = document.getElementById('newArrivalsCarousel');
  const bestContainer = document.getElementById('bestSellersCarousel');

  if (newContainer) {
    newContainer.innerHTML = newProducts.map(p => renderProductCardHTML(p)).join('');
    attachCardEventListeners(newContainer, products);
    initCarousel('newArrivalsCarousel', 'newPrevBtn', 'newNextBtn');
  }

  if (bestContainer) {
    bestContainer.innerHTML = bestProducts.map(p => renderProductCardHTML(p)).join('');
    attachCardEventListeners(bestContainer, products);
    initCarousel('bestSellersCarousel', 'bestPrevBtn', 'bestNextBtn');
  }
}

export function renderProductCardHTML(product) {
  const isWishlisted = Wishlist.isInWishlist(product.id);
  const primaryColor = product.colors[0] || {};
  const primaryImg = primaryColor.image || 'https://picsum.photos/600/800';
  const hoverImg = primaryColor.hoverImage || primaryImg;

  const isInPages = window.location.pathname.includes('/pages/');
  const productUrl = isInPages ? `product.html?id=${product.id}` : `pages/product.html?id=${product.id}`;

  return `
    <div class="product-card carousel-item" data-id="${product.id}">
      ${product.isSale ? `<span class="badge-sale">SALE</span>` : ''}
      <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to Wishlist">
        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
      <div class="product-card-image-wrapper">
        <a href="${productUrl}">
          <img class="product-card-image-main" src="${primaryImg}" alt="${product.name}" loading="lazy" width="300" height="400">
          <img class="product-card-image-hover" src="${hoverImg}" alt="${product.name} hover" loading="lazy" width="300" height="400">
        </a>
        <button class="btn btn-primary btn-sm card-quick-shop-btn" data-id="${product.id}">QUICK SHOP</button>
      </div>
      <div class="product-card-details">
        <div class="product-card-swatches">
          ${product.colors.map(c => `<span class="swatch-circle" style="background-color: ${c.hex};" title="${c.name}"></span>`).join('')}
        </div>
        <span class="product-card-brand">${product.brand}</span>
        <h3 class="product-card-title"><a href="${productUrl}">${product.name}</a></h3>
        <div class="product-card-price">
          <span class="${product.isSale ? 'price-sale' : 'price-current'}">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachCardEventListeners(container, products) {
  container.querySelectorAll('.card-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const product = products.find(p => p.id === id);
      if (product) {
        const added = Wishlist.toggleWishlist(product);
        const icon = btn.querySelector('i');
        if (added) {
          btn.classList.add('active');
          icon.className = 'fa-solid fa-heart';
        } else {
          btn.classList.remove('active');
          icon.className = 'fa-regular fa-heart';
        }
      }
    });
  });

  container.querySelectorAll('.card-quick-shop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const product = products.find(p => p.id === id);
      if (product) {
        openQuickShopModal(product);
      }
    });
  });
}

function openQuickShopModal(product) {
  let modal = document.getElementById('quickShopModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickShopModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="modalClose">&times;</button>
      <div class="modal-body-grid">
        <div class="modal-img-col">
          <img id="modalMainImg" src="${product.colors[0]?.image || ''}" alt="${product.name}">
        </div>
        <div class="modal-info-col">
          <span class="product-brand">${product.brand}</span>
          <h2 class="product-title">${product.name}</h2>
          <div class="product-price mb-md">
            <span class="${product.isSale ? 'price-sale' : 'price-current'}">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>

          <div class="modal-option-group mb-md">
            <label class="form-label">COLOR: <span id="modalColorName">${product.colors[0]?.name}</span></label>
            <div class="swatches-selector flex gap-xs">
              ${product.colors.map((c, idx) => `
                <button class="swatch-btn ${idx === 0 ? 'active' : ''}" data-name="${c.name}" data-img="${c.image}" style="background-color: ${c.hex};"></button>
              `).join('')}
            </div>
          </div>

          <div class="modal-option-group mb-md">
            <label class="form-label">SIZE</label>
            <div class="sizes-selector flex gap-xs">
              ${product.sizes.map((s, idx) => `
                <button class="size-btn ${idx === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-primary btn-full" id="modalAddBagBtn">ADD TO BAG</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  let selectedColor = product.colors[0];
  let selectedSize = product.sizes[0];

  // Swatch interactions
  modal.querySelectorAll('.swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedColor = product.colors.find(c => c.name === btn.dataset.name);
      document.getElementById('modalColorName').textContent = selectedColor.name;
      document.getElementById('modalMainImg').src = selectedColor.image;
    });
  });

  // Size interactions
  modal.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Add to Bag
  document.getElementById('modalAddBagBtn').addEventListener('click', () => {
    Cart.addItem(product, selectedColor, selectedSize, 1);
    closeModal();
  });
}
