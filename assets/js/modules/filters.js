import { API } from '../utils/api.js';
import { renderProductCardHTML, attachCardEventListeners } from '../main.js';

let allProducts = [];
let filteredProducts = [];
let categoriesData = [];

export async function initListingPage() {
  allProducts = await API.getProducts();
  categoriesData = await API.getCategories();

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat') || 'all';
  const subParam = urlParams.get('sub');

  // Filter initially by Category / Subcategory
  filterByCategory(catParam, subParam);

  // Setup Sidebar & Drawer Filters
  renderSidebarFilters();
  setupFilterEventListeners();

  // Setup Sort Listener
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', () => {
    applyCurrentFiltersAndSort();
  });

  // Mobile Drawer Toggle
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterDrawer = document.getElementById('filterDrawer');
  const filterDrawerOverlay = document.getElementById('filterDrawerOverlay');
  const filterDrawerClose = document.getElementById('filterDrawerClose');

  const openDrawer = () => {
    filterDrawer?.classList.add('active');
    filterDrawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    filterDrawer?.classList.remove('active');
    filterDrawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  filterToggleBtn?.addEventListener('click', openDrawer);
  filterDrawerClose?.addEventListener('click', closeDrawer);
  filterDrawerOverlay?.addEventListener('click', closeDrawer);

  document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
    applyCurrentFiltersAndSort();
    closeDrawer();
  });

  document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
    clearAllFilters();
    closeDrawer();
  });
}

function filterByCategory(cat, sub) {
  const pageTitle = document.getElementById('pageTitle');
  const breadcrumb = document.getElementById('breadcrumbCategory');

  let catName = 'ALL PRODUCTS';
  if (cat === 'new') catName = 'NEW ARRIVALS';
  else if (cat === 'women') catName = "WOMEN'S COLLECTION";
  else if (cat === 'men') catName = "MEN'S COLLECTION";
  else if (cat === 'home') catName = "HOME & GIFTS";
  else if (cat === 'beauty') catName = "BEAUTY";
  else if (cat === 'lifestyle') catName = "MUSIC & LIFESTYLE";
  else if (cat === 'sale') catName = "SALE & CLEARANCE";

  if (pageTitle) pageTitle.textContent = sub ? `${catName} - ${sub.toUpperCase()}` : catName;
  if (breadcrumb) breadcrumb.textContent = catName;

  filteredProducts = allProducts.filter(p => {
    if (cat === 'sale') return p.isSale;
    if (cat === 'new') return p.isNew;
    if (cat !== 'all' && p.category !== cat) return false;
    if (sub && p.subcategory !== sub) return false;
    return true;
  });

  applyCurrentFiltersAndSort();
}

function renderSidebarFilters() {
  const sidebar = document.getElementById('desktopFilterSidebar');
  const mobileBody = document.getElementById('mobileFilterBody');

  const brands = [...new Set(allProducts.map(p => p.brand))];
  const colors = [...new Set(allProducts.flatMap(p => p.colors.map(c => c.name)))];

  const html = `
    <div class="filter-group">
      <h4 class="filter-title">PRICE</h4>
      <div class="filter-options">
        <label class="filter-option"><input type="radio" name="priceRange" value="all" checked> All Prices</label>
        <label class="filter-option"><input type="radio" name="priceRange" value="0-50"> Under $50</label>
        <label class="filter-option"><input type="radio" name="priceRange" value="50-100"> $50 to $100</label>
        <label class="filter-option"><input type="radio" name="priceRange" value="100-200"> $100 & Over</label>
      </div>
    </div>

    <div class="filter-group">
      <h4 class="filter-title">BRAND</h4>
      <div class="filter-options">
        ${brands.map(b => `<label class="filter-option"><input type="checkbox" name="brandFilter" value="${b}"> ${b}</label>`).join('')}
      </div>
    </div>

    <div class="filter-group">
      <h4 class="filter-title">COLOR</h4>
      <div class="filter-options">
        ${colors.map(c => `<label class="filter-option"><input type="checkbox" name="colorFilter" value="${c}"> ${c}</label>`).join('')}
      </div>
    </div>
  `;

  if (sidebar) sidebar.innerHTML = html;
  if (mobileBody) mobileBody.innerHTML = html;
}

function setupFilterEventListeners() {
  const inputs = document.querySelectorAll('#desktopFilterSidebar input');
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      applyCurrentFiltersAndSort();
    });
  });
}

function applyCurrentFiltersAndSort() {
  const priceVal = document.querySelector('input[name="priceRange"]:checked')?.value || 'all';
  const selectedBrands = Array.from(document.querySelectorAll('input[name="brandFilter"]:checked')).map(i => i.value);
  const selectedColors = Array.from(document.querySelectorAll('input[name="colorFilter"]:checked')).map(i => i.value);
  const sortVal = document.getElementById('sortSelect')?.value || 'featured';

  let result = [...filteredProducts];

  // Price filter
  if (priceVal === '0-50') result = result.filter(p => p.price < 50);
  else if (priceVal === '50-100') result = result.filter(p => p.price >= 50 && p.price <= 100);
  else if (priceVal === '100-200') result = result.filter(p => p.price > 100);

  // Brand filter
  if (selectedBrands.length > 0) {
    result = result.filter(p => selectedBrands.includes(p.brand));
  }

  // Color filter
  if (selectedColors.length > 0) {
    result = result.filter(p => p.colors.some(c => selectedColors.includes(c.name)));
  }

  // Sorting
  if (sortVal === 'price-low') result.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price-high') result.sort((a, b) => b.price - a.price);
  else if (sortVal === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sortVal === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  renderProductsGrid(result);
}

function renderProductsGrid(products) {
  const grid = document.getElementById('listingProductGrid');
  const countEl = document.getElementById('itemCount');

  if (countEl) countEl.textContent = `${products.length} Items`;

  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<div class="text-center my-3xl" style="grid-column: 1 / -1;"><p>No products match your current filters.</p></div>`;
    return;
  }

  grid.innerHTML = products.map(p => renderProductCardHTML(p)).join('');
  attachCardEventListeners(grid, allProducts);
}

function clearAllFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
  const radioAll = document.querySelector('input[name="priceRange"][value="all"]');
  if (radioAll) radioAll.checked = true;
  applyCurrentFiltersAndSort();
}
