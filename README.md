# ZEVVO - Modern Apparel & Lifestyle Ecommerce Frontend

ZEVVO is an original, responsive ecommerce web application built with Vanilla HTML5, CSS3, and ES Module JavaScript. Its visual design language and layout patterns are inspired by modern editorial fashion retailers such as Urban Outfitters, featuring full-bleed lifestyle imagery, uppercase letter-spaced typography, square flat UI elements, hover image swapping, color swatches, and interactive mega-menus.

## Features

- **Responsive Design**: Mobile-first layout optimized across mobile (360px+), tablet, and desktop (1440px+).
- **Reusable Header & Footer**: Loaded dynamically via JS `fetch()` partials.
- **Interactive Navigation**:
  - Desktop hover mega-menu dropdowns with featured banners.
  - Mobile slide-in navigation drawer with multi-level accordion menus.
- **Product Catalog**:
  - Live filtering by category, price, brand, and color.
  - Live sorting by price, rating, and newness.
  - Mobile slide-up filter drawer & desktop sticky sidebar.
- **Product Detail Page**:
  - Image gallery with thumbnails and color swatch switching.
  - Variant selectors (size, color, quantity).
  - Accordion sections for product specs & shipping info.
  - "You May Also Like" carousel.
  - JSON-LD Product schema for SEO.
- **Quick Shop Modal**: Allows instant selection and adding to bag from any listing or carousel.
- **Shopping Bag & Checkout**:
  - Full bag management with quantity controls and item removal.
  - Promo code discounts (`ZEVVO10`, `ZEVVO15`).
  - Checkout form with delivery selection and mock payment interface.
  - Order confirmation screen with persisted mock order summary.
- **Saved Items / Wishlist**: Instant wishlist toggle saved to `localStorage`.
- **Search**: Full-text client-side search across title, brand, and description.

## Tech Stack

- **HTML5**: Semantic markup, accessible labels, aria attributes, skip links.
- **CSS3**: BEM-like component architecture, CSS variables in `base/variables.css`, Flexbox, and Grid. No preprocessors or frameworks.
- **JavaScript**: Pure ES Modules (`import`/`export`), no third-party libraries or frameworks.
- **Icons**: Font Awesome (Free CDN).
- **Fonts**: Google Fonts (`Archivo` for headings & navigation, `Inter` for body text).
- **Placeholder Images**: Picsum.photos with unique seeds per product.

## Local Development & Setup

Due to fetching HTML partials (`partials/header.html` & `partials/footer.html`), a local web server is required to prevent CORS file restrictions (`file://`).

1. **Clone or open the repository directory**:
   ```bash
   cd zevvo
   ```

2. **Start a local HTTP server using Python**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000` in your browser.

## File Structure

```text
zevvo/
├── index.html
├── README.md
├── pages/
│   ├── category.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── search.html
│   ├── login.html
│   ├── wishlist.html
│   ├── confirmation.html
│   └── 404.html
├── partials/
│   ├── header.html
│   └── footer.html
├── assets/css/
│   ├── base/ (variables.css, reset.css, typography.css)
│   ├── components/ (buttons.css, forms.css, cards.css, header.css, footer.css, drawer.css, modal.css)
│   ├── pages/ (home.css, listing.css, product.css, cart.css, checkout.css)
│   └── main.css
├── assets/js/
│   ├── modules/ (cart.js, wishlist.js, filters.js, menu.js, carousel.js)
│   ├── utils/ (api.js, helpers.js, storage.js)
│   └── main.js
└── data/
    ├── products.json (~40 items)
    └── categories.json
```
