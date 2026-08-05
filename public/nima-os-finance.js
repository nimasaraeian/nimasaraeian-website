(() => {
  const API = '/api/finance';
  let financeRows = [];
  let financeLoading = false;
  let financeLoadedAt = 0;

  const style = document.createElement('style');
  style.textContent = `
    .nav{grid-template-columns:repeat(6,1fr)!important}
    .nav button{font-size:8px!important}
    .finance-hero{background:linear-gradient(135deg,#214b45,#10283a)!important;border-color:#55d9a744!important}
    .finance-summary{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .finance-stat{padding:14px;border-radius:17px;background:#06102099;border:1px solid #95afe114}
    .finance-stat span{display:block;color:var(--m);font-size:10px}
    .finance-stat b{display:block;margin-top:10px;font-size:19px;direction:ltr;text-align:right}
    .finance-stat.income b{color:#77e0b8}.finance-stat.expense b{color:#ff9aad}
    .finance-row{display:flex;gap:11px;align-items:center;padding:12px;border-radius:16px;background:#06102088;border:1px solid #95afe114}
    .finance-icon{width:39px;height:39px;border-radius:13px;display:grid;place-items:center;background:#ff879c22;color:#ff9aad;font-size:18px}
    .finance-icon.income{background:#55d9a722;color:#70e0b5}.finance-icon.transfer{background:#7d85ff22;color:#aab0ff}
    .finance-amount{margin-right:auto;text-align:left;direction:ltr;font-weight:700;font-size:13px}
    .finance-amount.income{color:#70e0b5}.finance-amount.expense{color:#ff9aad}.finance-amount.transfer{color:#aab0ff}
    .finance-empty{padding:20px;text-align:center;color:var(--m);line-height:1.9;font-size:12px}
    .finance-refresh{width:100%;margin-top:12px}
  `;
  document.head.appendChild(style);

  function token(){
    try{return localStorage.getItem(typeof TK !== 'undefined' ? TK : 'nimaOS.independent.token') || ''}
    catch{return ''}
  }

  function toman(value){
    if(value === null || value === undefined) return 'نامشخص';
    return `${new Intl.NumberFormat('fa-IR',{maximumFractionDigits:0}).format(Number(value)/10)} تومان`;
  }

  function dayKey(date){
    return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tehran',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
  }

  function monthKey(date){ return dayKey(date).slice(0,7); }

  function totals(){
    const now = new Date();
    const today = dayKey(now);
    const month = monthKey(now);
    let todayExpense = 0;
    let monthExpense = 0;
    let monthIncome = 0;

    for(const row of financeRows){
      if(row.amount == null) continue;
      const d = new Date(row.transaction_at || row.created_at || Date.now());
      const key = dayKey(d);
      const amount = Number(row.amount) || 0;
      if(row.transaction_type === 'expense'){
        if(key === today) todayExpense += amount;
        if(key.slice(0,7) === month) monthExpense += amount;
      }
      if(row.transaction_type === 'income' && key.slice(0,7) === month){
        monthIncome += amount;
      }
    }
    return {todayExpense,monthExpense,monthIncome,net:monthIncome-monthExpense};
  }

  function typeLabel(type){
    return type === 'income' ? 'واریز' : type === 'expense' ? 'برداشت / خرید' : type === 'transfer' ? 'انتقال' : 'نیازمند بررسی';
  }

  function typeIcon(type){ return type === 'income' ? '↓' : type === 'transfer' ? '↔' : '↑'; }

  function rowHTML(row){
    const type = row.transaction_type || 'unknown';
    const date = new Date(row.transaction_at || row.created_at || Date.now());
    const dateText = new Intl.DateTimeFormat('fa-IR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(date);
    const amountClass = type === 'income' ? 'income' : type === 'transfer' ? 'transfer' : 'expense';
    return `<div class="finance-row"><div class="finance-icon ${amountClass}">${typeIcon(type)}</div><div class="copy"><b>${typeLabel(type)}</b><span>${row.bank_sender || 'بانک'} · ${dateText}${row.parse_status==='needs_review'?' · بررسی لازم':''}</span></div><div class="finance-amount ${amountClass}">${toman(row.amount)}</div></div>`;
  }

  function pageHTML(){
    const t = totals();
    return `<div class="stack">
      <section class="card finance-hero">
        <div class="head"><h2>مرکز مالی شخصی</h2><small>${financeLoading?'در حال همگام‌سازی':'پیامک‌های بانکی Android'}</small></div>
        <p style="font-size:12px;line-height:1.9;color:#dce9e5;margin:0">خریدها، برداشت‌ها و واریزها از پیامک بانکی وارد Nima OS می‌شوند. متن کامل پیامک و رمزها ذخیره نمی‌شوند.</p>
      </section>
      <section class="finance-summary">
        <div class="finance-stat expense"><span>هزینه امروز</span><b>${toman(t.todayExpense)}</b></div>
        <div class="finance-stat expense"><span>هزینه این ماه</span><b>${toman(t.monthExpense)}</b></div>
        <div class="finance-stat income"><span>درآمد این ماه</span><b>${toman(t.monthIncome)}</b></div>
        <div class="finance-stat ${t.net>=0?'income':'expense'}"><span>خالص این ماه</span><b>${toman(t.net)}</b></div>
      </section>
      <section class="card">
        <div class="head"><h2>تراکنش‌های اخیر</h2><small>${financeRows.length} مورد</small></div>
        <div class="list">${financeRows.length ? financeRows.slice(0,30).map(rowHTML).join('') : `<div class="finance-empty">هنوز تراکنشی دریافت نشده است.<br>بعد از رسیدن اولین پیامک خرید، برداشت یا واریز، اینجا ظاهر می‌شود.</div>`}</div>
        <button id="financeRefresh" class="btn primary finance-refresh">به‌روزرسانی تراکنش‌ها</button>
      </section>
    </div>`;
  }

  async function loadFinance(force=false){
    if(financeLoading || !token()) return;
    if(!force && Date.now()-financeLoadedAt < 30000) return;
    financeLoading = true;
    if(typeof A !== 'undefined' && A === 'finance') drawFinance(false);
    try{
      const response = await fetch(API, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'latest',accessToken:token(),limit:100}),
      });
      const data = await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error || 'دریافت تراکنش‌ها ناموفق بود');
      financeRows = Array.isArray(data.transactions) ? data.transactions : [];
      financeLoadedAt = Date.now();
      if(force && typeof toast === 'function') toast(financeRows.length ? 'تراکنش‌ها به‌روزرسانی شد' : 'هنوز تراکنشی دریافت نشده');
    }catch(error){
      if(force && typeof toast === 'function') toast(error.message);
    }finally{
      financeLoading = false;
      if(typeof A !== 'undefined' && A === 'finance') drawFinance(false);
    }
  }

  function drawFinance(load=true){
    const page = document.querySelector('#page');
    if(!page) return;
    const ey = document.querySelector('#ey');
    const ttl = document.querySelector('#ttl');
    if(ey) ey.textContent = 'دخل‌وخرج هوشمند';
    if(ttl) ttl.textContent = 'مالی';
    page.innerHTML = pageHTML();
    const refresh = document.querySelector('#financeRefresh');
    if(refresh) refresh.onclick = ()=>loadFinance(true);
    nav();
    if(load) setTimeout(()=>loadFinance(false),80);
  }

  if(typeof pages !== 'undefined') pages.finance = pageHTML;

  const baseRender = typeof render === 'function' ? render : null;
  if(baseRender){
    render = function(){
      if(typeof A !== 'undefined' && A === 'finance') return drawFinance(true);
      return baseRender();
    };
  }

  nav = function(){
    const root = document.querySelector('#nav');
    if(!root) return;
    const items = [
      ['today','⌂','امروز'],
      ['plan','□','برنامه'],
      ['projects','◇','پروژه‌ها'],
      ['health','♡','سلامت'],
      ['finance','₺','مالی'],
      ['chat','✦','دستیار'],
    ];
    root.innerHTML = items.map(x=>`<button data-nav="${x[0]}" class="${A===x[0]?'active':''}"><b>${x[1]}</b><span>${x[2]}</span></button>`).join('');
    root.querySelectorAll('[data-nav]').forEach(button=>{
      button.onclick=()=>{ A=button.dataset.nav; render(); scrollTo(0,0); };
    });
  };

  setTimeout(()=>{
    try{ nav(); }catch{}
    if(typeof A !== 'undefined' && A === 'finance') drawFinance(true);
  },100);
})();
