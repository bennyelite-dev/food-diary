// ===== App State =====
let currentTab   = 'dashboard';
let selectedFood = null;
let addCategory  = 'הכל';
let dbCategory   = 'הכל';
let dbSearch     = '';
let addPhase     = 'search';
let addQuery     = '';
let addMeal      = 'breakfast';

const MEALS = [
  { id:'breakfast', label:'ארוחת בוקר',  icon:'🌅' },
  { id:'lunch',     label:'ארוחת צהריים', icon:'☀️' },
  { id:'dinner',    label:'ארוחת ערב',    icon:'🌙' },
  { id:'snack',     label:'ביניים',        icon:'🍎' },
];

// ===== Bootstrap =====
document.addEventListener('DOMContentLoaded', async () => {
  const token = new URLSearchParams(window.location.search).get('t');

  if (!token) {
    showNoAccess();
    return;
  }

  const client = await loadClientByToken(token);
  if (!client) {
    showNoAccess();
    return;
  }

  setCurrentClient(client);
  showApp(client.name);
  setHeaderDate();
  setupNav();
  setupGoalsModal();
  await renderTab('dashboard');
});

function showApp(name) {
  document.getElementById('loadingScreen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  const el = document.getElementById('clientNameDisplay');
  if (el) el.textContent = name || 'יומן אכילה';
}

function showNoAccess() {
  document.getElementById('loadingScreen').style.display = 'none';
  document.getElementById('noAccessScreen').style.display = 'flex';
}

function setHeaderDate() {
  const el = document.getElementById('headerDate');
  el.textContent = new Date().toLocaleDateString('he-IL', { weekday:'long', day:'numeric', month:'long' });
}

// ===== Navigation =====
function setupNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTab(btn.dataset.tab);
    });
  });
}

async function renderTab(tab) {
  currentTab = tab;
  const main = document.getElementById('mainContent');
  main.innerHTML = '<div class="tab-loading"><div class="tab-spinner"></div></div>';

  const content = document.createElement('div');
  content.className = 'tab-content';

  switch (tab) {
    case 'dashboard': await renderDashboard(content); break;
    case 'add':            renderAddFood(content);    break;
    case 'foods':          renderFoodsDB(content);    break;
    case 'stats':     await renderStats(content);     break;
  }

  main.innerHTML = '';
  main.appendChild(content);
}

// ===== Dashboard =====
async function renderDashboard(el) {
  const [entries, goals] = await Promise.all([getTodayEntries(), getGoals()]);
  const totals = calcTotals(entries);

  el.innerHTML = renderCalorieRing(totals.calories, goals.calories)
               + renderMacroCards(totals, goals)
               + renderMealLog(entries);

  animateRing(totals.calories, goals.calories);
  setupDashboardEvents(el);
}

function renderCalorieRing(eaten, goal) {
  const r = 52, cx = 64, cy = 64, circ = 2 * Math.PI * r;
  const over = eaten > goal;
  return `
    <div class="card">
      <div class="section-header">
        <span class="section-title">סיכום היום</span>
        <button class="btn-icon" id="openGoals">⚙️ יעדים</button>
      </div>
      <div class="ring-container">
        <svg class="ring-svg" width="128" height="128" viewBox="0 0 128 128">
          <defs>
            <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff6b6b"/>
              <stop offset="100%" stop-color="#ee5a24"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="${cx}" cy="${cy}" r="${r}" stroke-width="10"/>
          <circle class="ring-fill cal-ring" id="calRing" cx="${cx}" cy="${cy}" r="${r}"
            stroke-width="10" stroke-dasharray="${circ}" stroke-dashoffset="${circ}"/>
        </svg>
        <div class="ring-info">
          <div class="ring-number">${eaten}<span> / ${goal}</span></div>
          <div class="ring-label">קלוריות</div>
          <div class="ring-remaining ${over ? 'over' : 'ok'}">
            ${over ? `⚠️ עברת ב-${eaten - goal} קל׳` : `נותרו ${goal - eaten} קל׳`}
          </div>
        </div>
      </div>
    </div>`;
}

function animateRing(eaten, goal) {
  requestAnimationFrame(() => {
    const ring = document.getElementById('calRing');
    if (!ring) return;
    ring.style.strokeDashoffset = 2 * Math.PI * 52 * (1 - Math.min(eaten / goal, 1));
  });
}

function renderMacroCards(totals, goals) {
  const macros = [
    { key:'protein', label:'חלבון',   icon:'💪', cls:'protein-color', bar:'protein' },
    { key:'carbs',   label:'פחמימות', icon:'🌾', cls:'carbs-color',   bar:'carbs'   },
    { key:'fat',     label:'שומן',    icon:'🫙', cls:'fat-color',     bar:'fat'     },
  ];
  return `<div class="macro-grid">${macros.map(m => {
    const val = Math.round((totals[m.key] || 0) * 10) / 10;
    const g   = goals[m.key] || 1;
    const pct = Math.min(val / g * 100, 100).toFixed(0);
    return `<div class="macro-card">
      <div class="macro-icon">${m.icon}</div>
      <div class="macro-name">${m.label}</div>
      <div class="macro-val ${m.cls}">${val}<small style="font-size:.6rem;font-weight:400">g</small></div>
      <div class="progress-bar"><div class="progress-fill ${m.bar}" style="width:${pct}%"></div></div>
      <div class="macro-target">${val} / ${g}g</div>
    </div>`;
  }).join('')}</div>`;
}

function renderMealLog(entries) {
  const byMeal = {};
  MEALS.forEach(m => { byMeal[m.id] = []; });
  entries.forEach(e => { if (byMeal[e.meal]) byMeal[e.meal].push(e); });

  const sections = MEALS.map(m => {
    const items    = byMeal[m.id];
    const mealCals = items.reduce((s, e) => s + (e.calories || 0), 0);
    const itemsHTML = items.length
      ? items.map(e => `
          <div class="meal-item">
            <div class="meal-item-info">
              <div class="meal-item-name">${e.food_name || e.foodName} <span style="color:var(--text-muted);font-size:.75rem">(${e.display_qty || e.displayQty})</span></div>
              <div class="meal-item-macros">חל׳ ${e.protein}g · פח׳ ${e.carbs}g · שו׳ ${e.fat}g</div>
            </div>
            <span class="meal-item-cal">${e.calories}</span>
            <button class="delete-btn" data-id="${e.id}">✕</button>
          </div>`).join('')
      : `<div class="meal-empty">לא נרשמה אכילה</div>`;
    return `
      <div class="meal-section">
        <div class="meal-header">
          <span class="meal-name">${m.icon} ${m.label}</span>
          <span class="meal-cals">${mealCals} קל׳</span>
        </div>
        <div class="meal-items">${itemsHTML}</div>
      </div>`;
  }).join('');
  return `<div class="card"><div class="card-title">ארוחות היום</div>${sections}</div>`;
}

function setupDashboardEvents(el) {
  el.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      await deleteEntry(btn.dataset.id);
      await renderTab('dashboard');
      showToast('פריט נמחק');
    });
  });
  el.querySelector('#openGoals')?.addEventListener('click', openGoalsModal);
}

// ===== Add Food =====
function renderAddFood(el) {
  if (addPhase === 'confirm' && selectedFood) {
    renderConfirmPhase(el);
  } else {
    addPhase = 'search';
    renderSearchPhase(el);
  }
}

function renderSearchPhase(el) {
  const cats = getCategories();
  el.innerHTML = `
    <div class="add-search-card">
      <div class="add-search-header">
        <span class="section-title">הוסף מזון</span>
        <span class="add-hint">בחר ארוחה:</span>
        <div class="meal-tabs" id="mealTabs">
          ${MEALS.map(m => `<button class="meal-tab ${m.id === addMeal ? 'active':''}" data-meal="${m.id}">${m.icon} ${m.label}</button>`).join('')}
        </div>
      </div>
      <div class="search-box" style="margin:0 0 10px;">
        <input type="text" id="foodSearch" placeholder="חפש מזון... (עוף, תפוח, קפה...)"
          value="${addQuery}" autocomplete="off" />
        <span class="search-icon">🔍</span>
      </div>
      <div class="cat-scroll">
        ${cats.map(c => `<button class="cat-chip ${c===addCategory?'active':''}" data-cat="${c}">${c}</button>`).join('')}
      </div>
      <div id="foodResults" class="food-results-list"></div>
    </div>`;

  const searchEl  = el.querySelector('#foodSearch');
  const resultsEl = el.querySelector('#foodResults');

  const refresh = () => {
    addQuery = searchEl.value;
    renderResultsList(resultsEl, addQuery, addCategory);
  };

  searchEl.addEventListener('input', refresh);

  el.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      addCategory = btn.dataset.cat;
      el.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      refresh();
    });
  });

  el.querySelectorAll('.meal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      addMeal = btn.dataset.meal;
      el.querySelectorAll('.meal-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  resultsEl.addEventListener('click', e => {
    const item = e.target.closest('.food-result-item');
    if (!item) return;
    selectedFood = getFoods().find(f => f.id === item.dataset.id);
    if (!selectedFood) return;
    addPhase = 'confirm';
    renderTab('add');
  });

  refresh();
}

function renderResultsList(container, query, category) {
  const results = searchFoods(query, category);
  if (!results.length) {
    container.innerHTML = `<div class="results-empty">😕 לא נמצאו תוצאות</div>`;
    return;
  }
  const shown = results.slice(0, 50);
  const more  = results.length - shown.length;
  container.innerHTML = shown.map(f => `
    <div class="food-result-item" data-id="${f.id}">
      <div class="fri-info">
        <div class="fri-name">${f.name}</div>
        <div class="fri-meta">${f.category ? f.category + ' · ' : ''}${f.unit}</div>
      </div>
      <div class="fri-right">
        <span class="fri-cal">${f.cal}</span>
        <span class="fri-cal-label">קל׳</span>
      </div>
    </div>`).join('')
    + (more > 0 ? `<div class="results-more">+ עוד ${more} — צמצם חיפוש</div>` : '');
}

function renderConfirmPhase(el) {
  const f   = selectedFood;
  const qty = f.grams;
  const n   = calcEntryNutrition(f, qty);

  el.innerHTML = `
    <div class="add-search-card">
      <div class="confirm-back-row">
        <button class="back-btn" id="backToSearch">← חזרה לחיפוש</button>
        <span class="confirm-meal-label">${MEALS.find(m=>m.id===addMeal)?.icon} ${MEALS.find(m=>m.id===addMeal)?.label}</span>
      </div>
      <div class="confirm-food-header">
        <div class="confirm-food-name">${f.name}</div>
        <div class="confirm-food-cat">${f.category || ''}</div>
      </div>
      <div class="confirm-macros-row" id="previewMacros">${macroPreviewHTML(n)}</div>
      <div class="confirm-form">
        <div class="confirm-qty-row">
          <label class="confirm-qty-label">כמות</label>
          <div class="qty-controls">
            <button class="qty-btn" id="qtyMinus">−</button>
            <input type="number" id="qtyInput" value="${qty}" min="1" />
            <button class="qty-btn" id="qtyPlus">+</button>
          </div>
          <span class="qty-unit">${f.unit} = ${f.grams}g</span>
        </div>
        <div class="meal-tabs" id="mealTabsConfirm">
          ${MEALS.map(m=>`<button class="meal-tab ${m.id===addMeal?'active':''}" data-meal="${m.id}">${m.icon} ${m.label}</button>`).join('')}
        </div>
        <button class="btn btn-success btn-full btn-add-confirm" id="addEntryBtn">✓ הוסף לארוחה</button>
      </div>
    </div>`;

  const qtyEl = el.querySelector('#qtyInput');
  const step  = f.grams >= 50 ? 10 : 1;

  const updatePreview = () => {
    const q = parseFloat(qtyEl.value) || f.grams;
    el.querySelector('#previewMacros').innerHTML = macroPreviewHTML(calcEntryNutrition(f, q));
  };

  qtyEl.addEventListener('input', updatePreview);
  el.querySelector('#qtyMinus').addEventListener('click', () => { qtyEl.value = Math.max(1, (parseFloat(qtyEl.value)||f.grams) - step); updatePreview(); });
  el.querySelector('#qtyPlus').addEventListener('click',  () => { qtyEl.value = (parseFloat(qtyEl.value)||f.grams) + step; updatePreview(); });

  el.querySelectorAll('#mealTabsConfirm .meal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      addMeal = btn.dataset.meal;
      el.querySelectorAll('#mealTabsConfirm .meal-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  el.querySelector('#backToSearch').addEventListener('click', () => {
    addPhase = 'search'; selectedFood = null; renderTab('add');
  });

  el.querySelector('#addEntryBtn').addEventListener('click', async () => {
    const btn  = el.querySelector('#addEntryBtn');
    btn.disabled = true;
    btn.textContent = 'שומר...';
    const qty = parseFloat(qtyEl.value) || f.grams;
    const n   = calcEntryNutrition(f, qty);
    const name = f.name;
    await addEntry({
      food_id:       f.id,
      food_name:     f.name,
      meal:          addMeal,
      grams_consumed: qty,
      display_qty:   `${qty}g`,
      ...n,
    });
    selectedFood = null; addPhase = 'search'; addQuery = '';
    await renderTab('add');
    showToast(`✓ ${name} נוסף!`);
  });
}

function macroPreviewHTML(n) {
  return `
    <div class="mpv"><span class="mpv-val" style="color:var(--cal)">${n.calories}</span><span class="mpv-label">קל׳</span></div>
    <div class="mpv"><span class="mpv-val" style="color:var(--protein)">${n.protein}g</span><span class="mpv-label">חלבון</span></div>
    <div class="mpv"><span class="mpv-val" style="color:var(--carbs)">${n.carbs}g</span><span class="mpv-label">פחמימות</span></div>
    <div class="mpv"><span class="mpv-val" style="color:var(--fat)">${n.fat}g</span><span class="mpv-label">שומן</span></div>`;
}

// ===== Foods DB =====
function renderFoodsDB(el) {
  const cats  = getCategories();
  const total = getFoods().length;
  el.innerHTML = `
    <div class="card">
      <div class="section-header">
        <span class="section-title">מאגר מזונות <small style="color:var(--text-muted);font-size:.75rem">(${total})</small></span>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" id="resetDB">↺</button>
          <button class="btn btn-primary btn-sm" id="showAddFoodForm">+ הוסף</button>
        </div>
      </div>
      <div id="addFoodFormWrap" style="display:none;margin-bottom:14px;border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;">
        <div class="form-row">
          <div class="form-group"><label>שם</label><input type="text" id="nfName" placeholder="עוף מטוגן"/></div>
          <div class="form-group"><label>קטגוריה</label><input type="text" id="nfCat" placeholder="בשר ועוף"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>יחידה</label><input type="text" id="nfUnit" placeholder="100 גרם"/></div>
          <div class="form-group"><label>גרם/יחידה</label><input type="number" id="nfGrams" placeholder="100"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>קלוריות</label><input type="number" id="nfCal" placeholder="200"/></div>
          <div class="form-group"><label>חלבון (g)</label><input type="number" id="nfProtein" placeholder="25"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>פחמימות (g)</label><input type="number" id="nfCarbs" placeholder="10"/></div>
          <div class="form-group"><label>שומן (g)</label><input type="number" id="nfFat" placeholder="8"/></div>
        </div>
        <button class="btn btn-success btn-full" id="saveNewFood">שמור</button>
      </div>
      <div class="search-box" style="margin-bottom:10px;">
        <input type="text" id="dbSearchInput" placeholder="חיפוש..." value="${dbSearch}"/>
        <span class="search-icon">🔍</span>
      </div>
      <div class="cat-scroll">
        ${cats.map(c=>`<button class="cat-chip ${c===dbCategory?'active':''}" data-cat="${c}">${c}</button>`).join('')}
      </div>
      <div style="overflow-x:auto;margin-top:10px;">
        <table class="foods-table" id="foodsTable"></table>
      </div>
    </div>`;
  renderFoodsTable();
  setupFoodsDBEvents(el);
}

function renderFoodsTable() {
  const table = document.getElementById('foodsTable');
  if (!table) return;
  const foods = searchFoods(dbSearch, dbCategory).slice(0, 100);
  table.innerHTML = `
    <thead><tr>
      <th>שם</th><th>קטגוריה</th><th>יחידה</th>
      <th style="color:var(--cal)">קל׳</th>
      <th style="color:var(--protein)">חל׳</th>
      <th style="color:var(--carbs)">פח׳</th>
      <th style="color:var(--fat)">שו׳</th><th></th>
    </tr></thead>
    <tbody>${foods.map(f=>`
      <tr>
        <td style="font-weight:600">${f.name}</td>
        <td style="color:var(--text-muted);font-size:.75rem">${f.category||'—'}</td>
        <td style="color:var(--text-muted);font-size:.75rem">${f.unit}</td>
        <td style="color:var(--cal)">${f.cal}</td>
        <td style="color:var(--protein)">${f.protein}</td>
        <td style="color:var(--carbs)">${f.carbs}</td>
        <td style="color:var(--fat)">${f.fat}</td>
        <td><button class="delete-btn" data-id="${f.id}">✕</button></td>
      </tr>`).join('')}
    </tbody>`;
  table.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => { deleteFood(btn.dataset.id); renderFoodsTable(); showToast('נמחק'); });
  });
}

function setupFoodsDBEvents(el) {
  el.querySelector('#showAddFoodForm')?.addEventListener('click', () => {
    const w = document.getElementById('addFoodFormWrap');
    w.style.display = w.style.display === 'none' ? 'block' : 'none';
  });
  el.querySelector('#resetDB')?.addEventListener('click', () => {
    if (confirm('לאפס מאגר מזונות?')) { resetFoodsDB(); renderTab('foods'); showToast('אופס!'); }
  });
  el.querySelector('#dbSearchInput')?.addEventListener('input', e => { dbSearch = e.target.value; renderFoodsTable(); });
  el.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      dbCategory = btn.dataset.cat;
      el.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFoodsTable();
    });
  });
  el.querySelector('#saveNewFood')?.addEventListener('click', () => {
    const name  = document.getElementById('nfName').value.trim();
    const cat   = document.getElementById('nfCat').value.trim();
    const unit  = document.getElementById('nfUnit').value.trim();
    const grams = parseFloat(document.getElementById('nfGrams').value);
    const cal   = parseFloat(document.getElementById('nfCal').value);
    const prot  = parseFloat(document.getElementById('nfProtein').value);
    const carbs = parseFloat(document.getElementById('nfCarbs').value);
    const fat   = parseFloat(document.getElementById('nfFat').value);
    if (!name || isNaN(cal)) { showToast('נא למלא שם וקלוריות'); return; }
    addFood({ name, category: cat||'אחר', unit: unit||'100 גרם', grams: grams||100, cal, protein: prot||0, carbs: carbs||0, fat: fat||0 });
    renderFoodsTable();
    document.getElementById('addFoodFormWrap').style.display = 'none';
    showToast('✓ נוסף!');
    ['nfName','nfCat','nfUnit','nfGrams','nfCal','nfProtein','nfCarbs','nfFat'].forEach(id => { const i=document.getElementById(id); if(i) i.value=''; });
  });
}

// ===== Stats =====
async function renderStats(el) {
  const [week, goals] = await Promise.all([getWeekEntries(), getGoals()]);
  const logged = week.filter(d => d.calories > 0);
  const avgCal = logged.length ? Math.round(logged.reduce((s,d) => s+d.calories, 0) / logged.length) : 0;
  const daysOk = logged.filter(d => Math.abs(d.calories - goals.calories) / goals.calories < 0.1).length;
  const today  = week[week.length - 1];

  el.innerHTML = `
    <div class="stats-summary">
      <div class="stat-chip"><div class="stat-chip-val" style="color:var(--cal)">${avgCal}</div><div class="stat-chip-label">ממוצע קל׳</div></div>
      <div class="stat-chip"><div class="stat-chip-val" style="color:var(--carbs2)">${daysOk}</div><div class="stat-chip-label">ימים ביעד</div></div>
      <div class="stat-chip"><div class="stat-chip-val" style="color:var(--protein)">${logged.length}</div><div class="stat-chip-label">ימים עם רישום</div></div>
    </div>
    <div class="card">
      <div class="card-title">קלוריות — שבוע אחרון</div>
      <div class="chart-container"><canvas id="weekChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">מקרונוטריאנטים היום</div>
      <div class="chart-container" style="height:160px;"><canvas id="macroChart"></canvas></div>
    </div>`;

  requestAnimationFrame(() => renderCharts(week, goals, today));
}

// ===== Goals Modal =====
function setupGoalsModal() {
  document.getElementById('closeGoalsModal')?.addEventListener('click', closeGoalsModal);
  document.getElementById('goalsModal')?.addEventListener('click', e => { if(e.target.id==='goalsModal') closeGoalsModal(); });
  document.getElementById('saveGoals')?.addEventListener('click', async () => {
    const goals = {
      calories: parseInt(document.getElementById('goalCalories').value) || 2000,
      protein:  parseInt(document.getElementById('goalProtein').value)  || 150,
      carbs:    parseInt(document.getElementById('goalCarbs').value)    || 200,
      fat:      parseInt(document.getElementById('goalFat').value)      || 65,
    };
    await saveGoals(goals);
    closeGoalsModal();
    if (currentTab === 'dashboard') await renderTab('dashboard');
    showToast('✓ יעדים נשמרו!');
  });
}

async function openGoalsModal() {
  const goals = await getGoals();
  document.getElementById('goalCalories').value = goals.calories;
  document.getElementById('goalProtein').value  = goals.protein;
  document.getElementById('goalCarbs').value    = goals.carbs;
  document.getElementById('goalFat').value      = goals.fat;
  document.getElementById('goalsModal').style.display = 'flex';
}

function closeGoalsModal() {
  document.getElementById('goalsModal').style.display = 'none';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
