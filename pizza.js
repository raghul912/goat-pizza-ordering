const PIZZAS = [
  { id:1, name:'Margherita', emoji:'🍕', desc:'Classic tomato base, fresh mozzarella, basil, extra virgin olive oil.', prices:{S:9.99,M:13.99,L:17.99} },
  { id:2, name:'Pepperoni', emoji:'🍕', desc:'Generous pepperoni, tomato sauce, stretchy mozzarella.', prices:{S:10.99,M:14.99,L:18.99} },
  { id:3, name:'BBQ Chicken', emoji:'🍗', desc:'Smoky BBQ sauce, grilled chicken, red onion, cheddar blend.', prices:{S:11.99,M:15.99,L:19.99} },
  { id:4, name:'Veggie Supreme', emoji:'🥦', desc:'Bell peppers, mushrooms, olives, spinach, feta on tomato base.', prices:{S:10.49,M:14.49,L:18.49} },
  { id:5, name:'Meat Feast', emoji:'🥩', desc:'Pepperoni, sausage, ham, bacon, ground beef — carnivore special.', prices:{S:12.99,M:16.99,L:20.99} },
  { id:6, name:'Hawaiian', emoji:'🍍', desc:'Ham, pineapple, mozzarella, sweet tomato base. We stand by it.', prices:{S:10.49,M:14.49,L:18.49} },
  { id:7, name:'Four Cheese', emoji:'🧀', desc:'Mozzarella, gorgonzola, parmesan, ricotta — white base, chive.', prices:{S:11.49,M:15.49,L:19.49} },
  { id:8, name:'Spicy Goat', emoji:'🌶️', desc:"Our signature: nduja, roasted peppers, goat's cheese, honey drizzle.", prices:{S:12.49,M:16.49,L:20.49} }
];

let cart = [];

function renderMenu() {
  const grid = document.getElementById('pizza-grid');
  grid.innerHTML = PIZZAS.map(p => `
    <div class="pizza-card">
      <div class="thumb">${p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="card-footer">
          <span class="price" id="price-${p.id}">$${p.prices.M.toFixed(2)}</span>
          <div style="display:flex;gap:6px;align-items:center">
            <select class="size-select" id="size-${p.id}" onchange="updatePrice(${p.id})">
              <option value="S">Small</option>
              <option value="M" selected>Medium</option>
              <option value="L">Large</option>
            </select>
            <button class="add-btn" onclick="addToCart(${p.id})">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function updatePrice(id) {
  const pizza = PIZZAS.find(p => p.id === id);
  const size = document.getElementById(`size-${id}`).value;
  document.getElementById(`price-${id}`).textContent = `$${pizza.prices[size].toFixed(2)}`;
}

function addToCart(id) {
  const pizza = PIZZAS.find(p => p.id === id);
  const size = document.getElementById(`size-${id}`).value;
  const key = `${id}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) { existing.qty++; }
  else { cart.push({ key, id, name: pizza.name, emoji: pizza.emoji, size, price: pizza.prices[size], qty: 1 }); }
  renderCart();
  flashBtn(id);
}

function flashBtn(id) {
  const cards = document.querySelectorAll('.pizza-card');
  const idx = PIZZAS.findIndex(p => p.id === id);
  const btn = cards[idx]?.querySelector('.add-btn');
  if (!btn) return;
  btn.textContent = '✓ Added'; btn.style.background = '#2a7a3a';
  setTimeout(() => { btn.textContent = 'Add'; btn.style.background = ''; }, 900);
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  document.getElementById('cart-count').textContent = cart.reduce((s,i) => s+i.qty, 0);
  if (cart.length === 0) { container.innerHTML = '<p class="empty-msg">Your cart is empty</p>'; footer.style.display='none'; return; }
  footer.style.display = 'block';
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="item-emoji">${item.emoji}</span>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-sub">${{S:'Small',M:'Medium',L:'Large'}[item.size]}</div>
        <div class="qty-ctrl">
          <button onclick="changeQty('${item.key}',-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.key}',1)">+</button>
        </div>
      </div>
      <span class="item-price">$${(item.price*item.qty).toFixed(2)}</span>
    </div>
  `).join('');
  document.getElementById('cart-total').textContent = `$${cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2)}`;
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  renderCart();
}

function toggleCart() {
  document.getElementById('cart').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function checkout() {
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const names = cart.map(i => `${i.qty}× ${i.name} (${{S:'Small',M:'Medium',L:'Large'}[i.size]})`).join(', ');
  document.getElementById('modal-msg').textContent = `${names}. Total: $${total.toFixed(2)}. Ready in 25–35 min! 🛵`;
  cart = []; renderCart(); toggleCart();
  document.getElementById('modal-backdrop').classList.add('open');
}

function closeModal() { document.getElementById('modal-backdrop').classList.remove('open'); }

renderMenu();
