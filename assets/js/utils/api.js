/**
 * Data API helper
 */

let cachedProducts = null;
let cachedCategories = null;

export const API = {
  async getProducts() {
    if (cachedProducts) return cachedProducts;
    const isInPages = window.location.pathname.includes('/pages/');
    const path = isInPages ? '../data/products.json' : 'data/products.json';
    try {
      const res = await fetch(path);
      cachedProducts = await res.json();
      return cachedProducts;
    } catch (e) {
      console.error('Failed to fetch products', e);
      return [];
    }
  },

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async getCategories() {
    if (cachedCategories) return cachedCategories;
    const isInPages = window.location.pathname.includes('/pages/');
    const path = isInPages ? '../data/categories.json' : 'data/categories.json';
    try {
      const res = await fetch(path);
      cachedCategories = await res.json();
      return cachedCategories;
    } catch (e) {
      console.error('Failed to fetch categories', e);
      return [];
    }
  }
};
