// =================== NAVIGATION ===================
function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  // Show target page
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');

  const nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Page-specific actions
  if (page === 'home') animateCounters();
  if (page === 'about') animateStatCards();
  if (page === 'shop') renderProducts();

  return false;
}

// =================== CURSOR ===================
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = (e.clientX - 10) + 'px';
  cursor.style.top = (e.clientY - 10) + 'px';
});
document.addEventListener('mousedown', () => cursor.classList.add('active'));
document.addEventListener('mouseup', () => cursor.classList.remove('active'));

// =================== COUNTERS (HOME) ===================
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  tick();
}

function animateCounters() {
  setTimeout(() => {
    animateCounter(document.getElementById('counter-clients'), 500, '+');
    animateCounter(document.getElementById('counter-years'), 5, '');
    animateCounter(document.getElementById('counter-pets'), 98, '%');
  }, 400);
}

function animateStatCards() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    animateCounter(el, target, target === 98 ? '%' : '+');
  });
}

// =================== PRODUCTS ===================
const allProducts = [
  { id: 1, name: 'Сухий корм Premium', cat: 'food', emoji: '🍖', price: '520 грн', type: 'Для собак' },
  { id: 2, name: 'Вологий корм Fancy', cat: 'food', emoji: '🥩', price: '85 грн', type: 'Для котів' },
  { id: 3, name: 'Дієтичний корм', cat: 'food', emoji: '🌾', price: '680 грн', type: 'Для собак' },
  { id: 4, name: 'Натуральні ласощі', cat: 'treats', emoji: '🦴', price: '120 грн', type: 'Для собак' },
  { id: 5, name: 'Тренувальні ласощі', cat: 'treats', emoji: '🍬', price: '95 грн', type: 'Для котів' },
  { id: 6, name: 'М\'яка іграшка', cat: 'toys', emoji: '🧸', price: '185 грн', type: 'Для всіх' },
  { id: 7, name: 'Інтерактивна іграшка', cat: 'toys', emoji: '🎾', price: '320 грн', type: 'Для собак' },
  { id: 8, name: 'Мишка на мотузці', cat: 'toys', emoji: '🐭', price: '75 грн', type: 'Для котів' },
  { id: 9, name: 'Повідок Comfort', cat: 'accessories', emoji: '🦮', price: '450 грн', type: 'Для собак' },
  { id: 10, name: 'Миска стильна', cat: 'accessories', emoji: '🍽️', price: '230 грн', type: 'Для всіх' },
  { id: 11, name: 'Лежанка Cozy', cat: 'accessories', emoji: '🛏️', price: '890 грн', type: 'Для всіх' },
  { id: 12, name: 'Одяг для собаки', cat: 'accessories', emoji: '👗', price: '380 грн', type: 'Для собак' },
];

let cartCount = 0;

function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'all' ? allProducts : allProducts.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" style="animation: fadeIn 0.4s ease both; animation-delay: ${allProducts.indexOf(p) * 0.05}s">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-cat">${p.type}</div>
        <div class="product-footer">
          <span class="product-price">${p.price}</span>
          <button class="add-to-cart" onclick="addToCart('${p.name}')">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(filter);
}

function addToCart(name) {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  document.getElementById('cart-badge').classList.add('visible');
  showNotification('🛒', `"${name}" додано до кошика!`);
}

function showCart() {
  showModal('🛒', 'Ваш кошик', `У вашому кошику ${cartCount} товар(ів). Для оформлення замовлення зателефонуйте нам або напишіть через форму зворотного зв\'язку!`);
}

// =================== PRICE TABS ===================
function switchPriceTab(tab, btn) {
  document.querySelectorAll('.price-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.price-table').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('price-' + tab).classList.add('active');
}

// =================== FORM VALIDATION ===================
function submitForm() {
  let valid = true;

  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const pet = document.getElementById('f-pet').value;
  const message = document.getElementById('f-message').value.trim();

  // Validate name
  const fgName = document.getElementById('fg-name');
  if (name.length < 2) {
    fgName.classList.add('error');
    valid = false;
  } else {
    fgName.classList.remove('error');
  }

  // Validate email
  const fgEmail = document.getElementById('fg-email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fgEmail.classList.add('error');
    valid = false;
  } else {
    fgEmail.classList.remove('error');
  }

  // Validate pet selection
  const fgPet = document.getElementById('fg-pet');
  if (!pet) {
    fgPet.classList.add('error');
    valid = false;
  } else {
    fgPet.classList.remove('error');
  }

  // Validate message
  const fgMessage = document.getElementById('fg-message');
  if (message.length < 10) {
    fgMessage.classList.add('error');
    valid = false;
  } else {
    fgMessage.classList.remove('error');
  }

  if (valid) {
    // Clear form
    document.getElementById('f-name').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-pet').value = '';
    document.getElementById('f-message').value = '';

    showModal('🐾', 'Повідомлення надіслано!',
      `Дякуємо, ${name}! Ми отримали ваше повідомлення і зв'яжемося з вами на ${email} найближчим часом. Ваш улюбленець в надійних руках!`);
  } else {
    showNotification('⚠️', 'Будь ласка, заповніть всі поля коректно');
  }
}

// =================== MODAL ===================
function showModal(icon, title, text) {
  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-text').textContent = text;
  document.getElementById('modal-overlay').classList.add('visible');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('visible');
  }
}

function closeModalBtn() {
  document.getElementById('modal-overlay').classList.remove('visible');
}

// =================== NOTIFICATION ===================
let notifTimeout;
function showNotification(icon, text) {
  const el = document.getElementById('notification');
  document.getElementById('notif-icon').textContent = icon;
  document.getElementById('notif-text').textContent = text;
  el.classList.add('show');
  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => el.classList.remove('show'), 3000);
}

// =================== SOCIALS ===================
function showSocial(name) {
  showModal('📲', name, `Підписуйтесь на наш ${name} щоб отримувати актуальні фото улюбленців, акції та новини PawDay!`);
  return false;
}

// =================== NAVBAR SCROLL EFFECT ===================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(15,15,35,0.95)';
  } else {
    nav.style.background = 'rgba(15,15,35,0.85)';
  }
});

// =================== INIT ===================
document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  renderProducts();
});