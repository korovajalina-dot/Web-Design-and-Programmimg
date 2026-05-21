function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');

  const nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'home') animateCounters();
  if (page === 'shop') renderProducts();
  if (page === 'order') {
    const dateInput = document.getElementById('of-date');
    if (dateInput && !dateInput.min) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }
  }
  return false;
}

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
    const clients = document.getElementById('counter-clients');
    const years = document.getElementById('counter-years');
    const pets = document.getElementById('counter-pets');
    if(clients) animateCounter(clients, 500, '+');
    if(years) animateCounter(years, 5, '');
    if(pets) animateCounter(pets, 98, '%');
  }, 300);
}

const allProducts = [
  { id: 1, name: 'Сухий корм Premium', cat: 'food', price: 520, type: 'Для собак' },
  { id: 2, name: 'Вологий корм Fancy', cat: 'food', price: 85, type: 'Для котів' },
  { id: 3, name: 'Дієтичний корм', cat: 'food', price: 680, type: 'Для собак' },
  { id: 4, name: 'Натуральні ласощі', cat: 'treats', price: 120, type: 'Для собак' },
  { id: 5, name: 'Тренувальні ласощі', cat: 'treats', price: 95, type: 'Для котів' },
  { id: 6, name: 'М\'яка іграшка', cat: 'toys', price: 185, type: 'Для всіх' },
  { id: 7, name: 'Інтерактивна іграшка', cat: 'toys', price: 320, type: 'Для собак' },
  { id: 8, name: 'Повідок Comfort', cat: 'accessories', price: 450, type: 'Для собак' },
  { id: 9, name: 'Лежанка Cozy', cat: 'accessories', price: 890, type: 'Для всіх' }
];

let cart = [];

function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  const filtered = filter === 'all' ? allProducts : allProducts.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img"></div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-cat">${p.type}</div>
        <div class="product-footer">
          <span class="product-price">${p.price} грн</span>
          <button class="btn-primary" style="padding: 8px 16px; font-size: 0.9rem;" onclick="addToCart(${p.id})">До кошика</button>
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

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = totalItems;
  document.getElementById('cart-badge').classList.add('visible');
  
  showNotification(`"${product.name}" додано до кошика!`);
}

function showCart() {
  const container = document.getElementById('cart-items-container');
  const totalPriceEl = document.getElementById('cart-total-price');
  
  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 20px; color:var(--text-muted);">Ваш кошик порожній</div>';
    totalPriceEl.textContent = '0';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span>${item.name} (x${item.qty})</span>
        <span>${item.price * item.qty} грн</span>
      </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalPriceEl.textContent = total;
  }
  
  document.getElementById('cart-modal-overlay').classList.add('visible');
}

function closeCartModal(e) {
  if (e.target === document.getElementById('cart-modal-overlay')) {
    document.getElementById('cart-modal-overlay').classList.remove('visible');
  }
}
function closeCartModalBtn() {
  document.getElementById('cart-modal-overlay').classList.remove('visible');
}

function checkoutCart() {
  if (cart.length === 0) {
    showNotification('Кошик порожній!');
    return;
  }
  
  const name = document.getElementById('cart-name').value.trim();
  const phone = document.getElementById('cart-phone').value.trim();
  
  if (name.length < 2 || phone.length < 10) {
    showNotification('Будь ласка, заповніть контактні дані коректно');
    return;
  }
  
  cart = [];
  document.getElementById('cart-count').textContent = '0';
  document.getElementById('cart-badge').classList.remove('visible');
  document.getElementById('cart-name').value = '';
  document.getElementById('cart-phone').value = '';
  
  closeCartModalBtn();
  showModal('Дякуємо за замовлення!', 'Ми зв\'яжемося з вами найближчим часом для підтвердження покупок.');
}

function switchPriceTab(tab, btn) {
  document.querySelectorAll('.price-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.price-table').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('price-' + tab).classList.add('active');
}

// =================== MODAL & NOTIFICATIONS ===================
function showModal(title, text) {
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

let notifTimeout;
function showNotification(text) {
  const container = document.getElementById('notifications-container');
  if (!container) return;

  const notif = document.createElement('div');
  notif.className = 'notification';
  
  const notifText = document.createElement('span');
  notifText.className = 'notif-text';
  notifText.textContent = text;
  
  notif.appendChild(notifText);
  container.appendChild(notif);

  setTimeout(() => {
    notif.classList.add('hiding');
    
    setTimeout(() => {
      if (notif.parentNode) {
        notif.parentNode.removeChild(notif);
      }
    }, 300);
  }, 3000);
}

function submitForm() {
  const name = document.getElementById('f-name').value.trim();
  const message = document.getElementById('f-message').value.trim();
  
  if (name.length > 1 && message.length > 5) {
    document.getElementById('f-name').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-message').value = '';
    showModal('Повідомлення надіслано!', `Дякуємо, ${name}! Ми отримали ваше звернення.`);
  } else {
    showNotification('Будь ласка, заповніть обов\'язкові поля');
  }
}

function autoSelectSpecies() {
  // Викликається при зміні чекбоксів з послугами
  const checkboxes = Array.from(document.querySelectorAll('#of-services-list input:checked')).map(cb => cb.value.toLowerCase());
  const speciesSelect = document.getElementById('of-species');
  
  if (checkboxes.some(s => s.includes('собак'))) {
    speciesSelect.value = 'dog';
  } else if (checkboxes.some(s => s.includes('кот') || s.includes('кіт'))) {
    speciesSelect.value = 'cat';
  }
}

function submitOrder() {
  const owner = document.getElementById('of-owner').value.trim();
  const phone = document.getElementById('of-phone').value.trim();
  const species = document.getElementById('of-species').value;
  const services = Array.from(document.querySelectorAll('#of-services-list input:checked')).map(cb => cb.value);
  
  if (owner.length < 2 || phone.length < 10 || !species || services.length === 0) {
    showNotification('Будь ласка, заповніть дані форми');
    return;
  }
  
  document.getElementById('of-owner').value = '';
  document.getElementById('of-phone').value = '';
  document.getElementById('of-petname').value = '';
  document.getElementById('of-species').value = '';
  document.getElementById('of-breed').value = '';
  document.getElementById('of-date').value = '';
  document.getElementById('of-time').value = '';
  document.querySelectorAll('#of-services-list input').forEach(cb => cb.checked = false);

  showModal('Запис прийнято!', `Дякуємо, ${owner}! Ваша заявка на послуги (${services.join(', ')}) успішно оформлена.`);
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  renderProducts();
});

function bookService(serviceName) {
  // Переходимо на сторінку замовлення
  navigate('order');
  
  // Даємо трохи часу на рендеринг сторінки, потім проставляємо чекбокс
  setTimeout(() => {
    // Спочатку знімаємо всі попередньо обрані галочки
    document.querySelectorAll('#of-services-list input').forEach(cb => {
      cb.checked = false;
    });

    // Знаходимо потрібний чекбокс за його value і ставимо галочку
    const targetCheckbox = document.querySelector(`#of-services-list input[value="${serviceName}"]`);
    if (targetCheckbox) {
      targetCheckbox.checked = true;
    }

    // Запускаємо функцію автовибору виду тварини (кіт/собака) на основі послуги
    autoSelectSpecies();
  }, 100);
}