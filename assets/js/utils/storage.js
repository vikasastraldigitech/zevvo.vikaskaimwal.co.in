/**
 * LocalStorage wrapper with event dispatching
 */

const STORAGE_KEYS = {
  CART: 'zevvo_cart',
  WISHLIST: 'zevvo_wishlist'
};

export const Storage = {
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  },

  setCart(cartItems) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
      window.dispatchEvent(new CustomEvent('zevvo:cart-updated', { detail: cartItems }));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  },

  getWishlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading wishlist from localStorage', e);
      return [];
    }
  },

  setWishlist(wishlistItems) {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistItems));
      window.dispatchEvent(new CustomEvent('zevvo:wishlist-updated', { detail: wishlistItems }));
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  }
};
