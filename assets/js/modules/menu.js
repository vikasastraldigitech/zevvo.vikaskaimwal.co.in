/**
 * Header and Navigation Menu Manager
 */

export async function loadHeaderFooter() {
  const headerContainer = document.getElementById('header-placeholder');
  const footerContainer = document.getElementById('footer-placeholder');

  // Determine root path prefix depending on if we are in /pages/ or root
  const isInPages = window.location.pathname.includes('/pages/');
  const prefix = isInPages ? '../' : './';

  try {
    if (headerContainer) {
      const res = await fetch(prefix + 'partials/header.html');
      if (res.ok) {
        let html = await res.text();
        if (isInPages) {
          // Adjust root paths in header partial for pages folder
          html = html.replace(/href="\/"/g, 'href="../index.html"');
          html = html.replace(/href="\/pages\//g, 'href="../pages/');
          html = html.replace(/action="\/pages\//g, 'action="../pages/');
        }
        headerContainer.innerHTML = html;
        initHeaderInteractions();
      }
    }

    if (footerContainer) {
      const res = await fetch(prefix + 'partials/footer.html');
      if (res.ok) {
        let html = await res.text();
        if (isInPages) {
          html = html.replace(/href="\/pages\//g, 'href="../pages/');
        }
        footerContainer.innerHTML = html;
      }
    }
  } catch (err) {
    console.error('Error loading header/footer partials:', err);
  }
}

export function initHeaderInteractions() {
  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    mobileDrawer?.classList.add('active');
    mobileDrawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    mobileDrawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  mobileDrawerOverlay?.addEventListener('click', closeDrawer);

  // Accordion in Drawer
  const accordionHeaders = document.querySelectorAll('.mobile-accordion .accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isActive = item.classList.contains('active');

      // Close other accordion items
      document.querySelectorAll('.mobile-accordion .accordion-item').forEach((i) => {
        i.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
