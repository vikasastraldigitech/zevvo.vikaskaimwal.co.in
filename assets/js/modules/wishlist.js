import { Storage } from '../utils/storage.js';
import { showToast } from '../utils/helpers.js';

export const Wishlist = {
  getWishlist() {
    return Storage.getWishlist();
  },

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.some(id => id === productId);
  },

  toggleWishlist(product) {
    let list = this.getWishlist();
    const productId = product.id;

    if (this.isInWishlist(productId)) {
      list = list.filter(id => id !== productId);
      Storage.setWishlist(list);
      showToast(`Removed "${product.name}" from Saved Items.`);
      return false;
    } else {
      list.push(productId);
      Storage.setWishlist(list);
      showToast(`Saved "${product.name}" to Wishlist!`);
      return true;
    }
  },

  getItemCount() {
    return this.getWishlist().length;
  },

  initBadges() {
    const update = () => {
      const count = this.getItemCount();
      const badge = document.getElementById('wishlistBadge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    };

    update();
    window.addEventListener('zevvo:wishlist-updated', update);
  }
};
