import { Storage } from '../utils/storage.js';
import { showToast } from '../utils/helpers.js';

export const Cart = {
  getCart() {
    return Storage.getCart();
  },

  addItem(product, selectedColor, selectedSize, quantity = 1) {
    const cart = this.getCart();
    const itemKey = `${product.id}-${selectedColor?.name || 'default'}-${selectedSize || 'default'}`;

    const existingIndex = cart.findIndex(item => item.itemKey === itemKey);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        itemKey,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: selectedColor?.image || product.colors[0]?.image,
        color: selectedColor?.name || product.colors[0]?.name || 'Standard',
        size: selectedSize || (product.sizes ? product.sizes[0] : 'One Size'),
        quantity: quantity
      });
    }

    Storage.setCart(cart);
    showToast(`Added "${product.name}" to your Bag.`);
  },

  updateQuantity(itemKey, newQuantity) {
    let cart = this.getCart();
    if (newQuantity <= 0) {
      cart = cart.filter(item => item.itemKey !== itemKey);
    } else {
      const item = cart.find(item => item.itemKey === itemKey);
      if (item) item.quantity = newQuantity;
    }
    Storage.setCart(cart);
  },

  removeItem(itemKey) {
    const cart = this.getCart().filter(item => item.itemKey !== itemKey);
    Storage.setCart(cart);
    showToast('Item removed from Bag.');
  },

  clearCart() {
    Storage.setCart([]);
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  initBadges() {
    const update = () => {
      const count = this.getItemCount();
      const badge = document.getElementById('cartBadge');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    };

    update();
    window.addEventListener('zevvo:cart-updated', update);
  }
};
