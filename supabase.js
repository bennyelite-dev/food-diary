// =============================================
// הגדרות Supabase — שנה את הערכים שלך כאן
// =============================================
const SUPABASE_URL      = 'https://dzsqptpaikzptfngazdd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gGr3R4OE3c97gPMv_f_5Ew_84X16htN';
const ADMIN_PASSWORD    = 'admin1234';                // שנה לסיסמה שלך!

// =============================================
const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Current client (loaded on init) ───
let currentClient = null;

function getCurrentClient()  { return currentClient; }
function setCurrentClient(c) { currentClient = c; }

// ─── Client loading ───
async function loadClientByToken(token) {
  const { data, error } = await _sb
    .from('clients').select('*').eq('token', token).single();
  return error ? null : data;
}

// ─── Goals ───
async function getGoals() {
  return currentClient?.goals || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
}

async function saveGoals(goals) {
  if (!currentClient) return;
  await _sb.from('clients').update({ goals }).eq('id', currentClient.id);
  currentClient.goals = goals;
}

// ─── Food log (today) ───
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function getTodayEntries() {
  if (!currentClient) return [];
  const { data } = await _sb
    .from('food_log').select('*')
    .eq('client_id', currentClient.id)
    .eq('date', todayISO())
    .order('created_at');
  return data || [];
}

async function addEntry(entry) {
  if (!currentClient) return null;
  const { data, error } = await _sb
    .from('food_log')
    .insert({ client_id: currentClient.id, date: todayISO(), ...entry })
    .select().single();
  if (error) { console.error(error); return null; }
  return data;
}

async function deleteEntry(id) {
  await _sb.from('food_log').delete().eq('id', id);
}

// ─── Week entries (for stats) ───
async function getWeekEntries() {
  if (!currentClient) return buildEmptyWeek();
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const { data } = await _sb
    .from('food_log').select('*')
    .eq('client_id', currentClient.id)
    .in('date', dates);

  const DAY_HE = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
  return dates.map(date => {
    const entries = (data || []).filter(e => e.date === date);
    const totals  = calcTotals(entries);
    const d = new Date(date + 'T12:00:00');
    return { date, label: DAY_HE[d.getDay()], ...totals };
  });
}

function buildEmptyWeek() {
  const DAY_HE = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { date: d.toISOString().slice(0,10), label: DAY_HE[d.getDay()],
      calories: 0, protein: 0, carbs: 0, fat: 0 };
  });
}

// ─── Admin: client management ───
async function adminGetAllClients() {
  const { data } = await _sb.from('clients').select('*').order('created_at', { ascending: false });
  return data || [];
}

async function adminCreateClient(name, goals, note) {
  const token = generateToken();
  const { data, error } = await _sb
    .from('clients').insert({ name, token, goals, note }).select().single();
  if (error) { console.error(error); return null; }
  return data;
}

async function adminUpdateGoals(clientId, goals) {
  await _sb.from('clients').update({ goals }).eq('id', clientId);
}

async function adminDeleteClient(clientId) {
  await _sb.from('clients').delete().eq('id', clientId);
}

function generateToken() {
  return Math.random().toString(36).slice(2, 10) +
         Math.random().toString(36).slice(2, 10);
}

function buildClientURL(token) {
  const base = window.location.origin + window.location.pathname.replace(/admin\.html$/, 'index.html');
  return `${base}?t=${token}`;
}

// ─── Client Profile ───
async function getClientProfile() {
  if (!currentClient) return null;
  const { data } = await _sb
    .from('client_profiles').select('*')
    .eq('client_id', currentClient.id).single();
  return data || null;
}

async function saveClientProfile(profile) {
  if (!currentClient) return null;
  const { data, error } = await _sb
    .from('client_profiles')
    .upsert({ client_id: currentClient.id, ...profile, updated_at: new Date().toISOString() },
             { onConflict: 'client_id' })
    .select().single();
  if (error) { console.error(error); return null; }
  return data;
}

// ─── Meal Plans ───
async function getMealPlans() {
  if (!currentClient) return [];
  const { data } = await _sb
    .from('meal_plans').select('*')
    .eq('client_id', currentClient.id)
    .order('sort_order');
  return data || [];
}

async function saveAllMealPlans(plans) {
  if (!currentClient) return;
  await _sb.from('meal_plans').delete().eq('client_id', currentClient.id);
  if (!plans.length) return;
  await _sb.from('meal_plans').insert(
    plans.map((p, i) => ({
      client_id: currentClient.id,
      day_label: p.day_label,
      plan_data: p.plan_data,
      sort_order: i,
      updated_at: new Date().toISOString(),
    }))
  );
}
