(() => {
  const HEALTH_API = 'https://qmlacuiguaryobzoryyn.supabase.co/functions/v1/nima-health';
  const css = `.apple-health-card{background:linear-gradient(145deg,#35152b,#111a31)!important;border-color:#ff6f9d55!important}.ah-top{display:flex;align-items:center;gap:11px}.ah-icon{width:44px;height:44px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#ff5d8f,#ff8d6a);font-size:22px;box-shadow:0 10px 30px #ff5d8f33}.ah-copy{flex:1}.ah-copy b{display:block;font-size:13px}.ah-copy small{display:block;color:#b8a5b6;font-size:10px;margin-top:4px}.ah-status{font-size:10px;padding:6px 9px;border-radius:99px;background:#ffffff10;color:#c7b9c5}.ah-status.on{background:#55d9a720;color:#55d9a7}.ah-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:13px}.ah-metric{padding:10px;border-radius:14px;background:#080f1d99;border:1px solid #ffffff10}.ah-metric span{display:block;color:#a99cac;font-size:9px}.ah-metric b{display:block;margin-top:6px;font-size:15px;direction:ltr;text-align:right}.ah-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.ah-actions button{border:1px solid #3a2940;border-radius:13px;padding:10px 12px;color:#fff;background:#23182a}.ah-actions button.primary{border:0;background:linear-gradient(135deg,#ff5d8f,#e34f80)}.ah-note{font-size:10px;color:#a99cac;line-height:1.8;margin:10px 0 0}.ah-overlay{position:fixed;inset:0;z-index:120;background:#02060ddd;backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center}.ah-sheet{width:min(680px,100%);max-height:92dvh;overflow:auto;border-radius:28px 28px 0 0;padding:20px 16px calc(24px + env(safe-area-inset-bottom));background:linear-gradient(160deg,#211428,#081223);border:1px solid #5a3048}.ah-close{float:left;border:1px solid #5a3048;background:#1b1220;color:#fff;width:37px;height:37px;border-radius:13px;font-size:20px}.ah-sheet h2{margin:0 0 6px}.ah-sheet h3{font-size:14px;margin:22px 0 10px}.ah-sheet p,.ah-sheet li{font-size:11px;color:#c0afbc;line-height:1.95}.ah-box{padding:12px;border-radius:16px;background:#080f1d;border:1px solid #ffffff14;margin:10px 0}.ah-code{display:block;direction:ltr;text-align:left;white-space:pre-wrap;word-break:break-all;background:#030811;border-radius:12px;padding:10px;color:#d9def7;font-size:10px}.ah-warning{padding:11px;border-radius:15px;background:#f2c46c12;border:1px solid #f2c46c24;color:#e9d39c;font-size:11px;line-height:1.8}.ah-step{display:grid;grid-template-columns:29px 1fr;gap:9px;align-items:start;margin:11px 0}.ah-step i{width:29px;height:29px;border-radius:10px;display:grid;place-items:center;background:#ff5d8f22;color:#ff91b0;font-style:normal;font-size:11px}.ah-copy-btn{width:100%;margin-top:8px;border:1px solid #5a3048;border-radius:12px;padding:10px;color:#fff;background:#24172a}@media(max-width:420px){.ah-grid{grid-template-columns:1fr 1fr}.ah-actions button{flex:1}}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  let latest = null;
  let loading = false;
  let loadedAt = 0;

  function token(){
    try{return localStorage.getItem(typeof TK !== 'undefined' ? TK : 'nimaOS.independent.token') || ''}
    catch{return ''}
  }
  function say(text){ try{toast(text)}catch{console.log(text)} }
  function fmt(value, suffix=''){
    if(value === null || value === undefined || value === '') return '—';
    return `${new Intl.NumberFormat('fa-IR',{maximumFractionDigits:1}).format(Number(value))}${suffix}`;
  }
  async function request(action, extra={}){
    const response = await fetch(HEALTH_API, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action,accessToken:token(),...extra}),
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error || 'سرویس Apple Health پاسخ نداد');
    return data;
  }
  async function loadLatest(force=false){
    if(loading || !token()) return;
    if(!force && Date.now()-loadedAt < 60000) return;
    loading = true;
    refreshCard();
    try{
      const data = await request('latest',{limit:14});
      latest = Array.isArray(data.health) && data.health.length ? data.health[0] : null;
      loadedAt = Date.now();
      if(latest && typeof S !== 'undefined' && S.health){
        if(latest.sleep_minutes != null) S.health.sleep = Math.round((Number(latest.sleep_minutes)/60)*10)/10;
        if(latest.weight_kg != null) S.health.weight = Number(latest.weight_kg);
        S.health.steps = latest.step_count;
        S.health.activeEnergy = latest.active_energy_kcal;
        S.health.restingHeartRate = latest.resting_heart_rate;
        S.health.workoutMinutes = latest.workout_minutes;
        try{save()}catch{}
      }
    }catch(error){
      latest = null;
      if(force) say(error.message);
    }finally{
      loading = false;
      refreshCard();
    }
  }
  function metric(label,value){ return `<div class="ah-metric"><span>${label}</span><b>${value}</b></div>` }
  function cardHTML(){
    const connected = !!latest;
    const date = latest?.health_date ? new Intl.DateTimeFormat('fa-IR',{month:'short',day:'numeric'}).format(new Date(`${latest.health_date}T12:00:00`)) : '';
    return `<div class="ah-top"><div class="ah-icon">♥</div><div class="ah-copy"><b>Apple Health</b><small>${connected ? `آخرین همگام‌سازی: ${date}` : 'اتصال رایگان با Shortcuts آیفون'}</small></div><span class="ah-status ${connected?'on':''}">${loading?'در حال بررسی':connected?'متصل':'منتظر اتصال'}</span></div><div class="ah-grid">${metric('قدم‌ها',fmt(latest?.step_count))}${metric('خواب',latest?.sleep_minutes==null?'—':fmt(Number(latest.sleep_minutes)/60,' ساعت'))}${metric('انرژی فعال',fmt(latest?.active_energy_kcal,' kcal'))}${metric('ضربان استراحت',fmt(latest?.resting_heart_rate))}${metric('وزن',fmt(latest?.weight_kg,' kg'))}${metric('ورزش',fmt(latest?.workout_minutes,' دقیقه'))}</div><div class="ah-actions"><button id="ahSetup" class="primary">اتصال بدون دانلود</button><button id="ahRefresh">به‌روزرسانی داده‌ها</button></div><p class="ah-note">این روش از اپ داخلی Shortcuts استفاده می‌کند و به نصب برنامه جدید از App Store نیاز ندارد.</p>`;
  }
  function addCard(){
    if(typeof A === 'undefined' || A !== 'health') return;
    const stack = document.querySelector('#page .stack');
    if(!stack || document.querySelector('#appleHealthCard')) return;
    const section = document.createElement('section');
    section.id = 'appleHealthCard';
    section.className = 'card apple-health-card';
    section.innerHTML = cardHTML();
    stack.insertBefore(section, stack.children[1] || null);
    bindCard();
    setTimeout(()=>loadLatest(false),100);
  }
  function refreshCard(){
    const card = document.querySelector('#appleHealthCard');
    if(card){ card.innerHTML = cardHTML(); bindCard(); }
  }
  function bindCard(){
    const setup = document.querySelector('#ahSetup');
    const refresh = document.querySelector('#ahRefresh');
    if(setup) setup.onclick = openGuide;
    if(refresh) refresh.onclick = ()=>loadLatest(true);
  }
  function closeGuide(){ document.querySelector('#appleHealthOverlay')?.remove() }
  function copy(text,label){
    navigator.clipboard?.writeText(text).then(()=>say(`${label} کپی شد`)).catch(()=>say('کپی خودکار انجام نشد'));
  }
  function openGuide(){
    closeGuide();
    const endpoint = HEALTH_API;
    const payload = `{
  "action": "sync",
  "accessToken": "کد خصوصی Nima OS",
  "date": "yyyy-MM-dd",
  "timezone": "Asia/Tehran",
  "steps": 0,
  "activeEnergy": 0,
  "sleepMinutes": 0,
  "restingHeartRate": 0,
  "weightKg": 0,
  "workoutMinutes": 0
}`;
    const overlay = document.createElement('div');
    overlay.id = 'appleHealthOverlay';
    overlay.className = 'ah-overlay';
    overlay.innerHTML = `<section class="ah-sheet"><button id="ahClose" class="ah-close">×</button><h2>اتصال Apple Health بدون دانلود</h2><p>برای این نسخه از اپ داخلی <b>Shortcuts</b> استفاده می‌کنیم. داده‌ها با اجازه خودت از Health خوانده و مستقیم به فضای خصوصی Nima OS فرستاده می‌شوند.</p><div class="ah-warning">کد خصوصی Nima OS را فقط داخل Shortcut گوشی خودت وارد کن. آن را برای کسی نفرست و داخل پیام یا اسکرین‌شات قرار نده.</div><h3>ساخت Shortcut</h3><div class="ah-step"><i>۱</i><p>Shortcuts را باز کن و یک Shortcut تازه با نام <b>Nima Health Sync</b> بساز.</p></div><div class="ah-step"><i>۲</i><p>برای هر داده از اکشن <b>Find Health Samples</b> استفاده کن: Step Count، Active Energy Burned، Sleep Analysis، Resting Heart Rate و Body Mass. برای قدم و انرژی، بازه را از ابتدای امروز قرار بده و مجموع را حساب کن. برای ضربان و وزن، آخرین نمونه را بردار.</p></div><div class="ah-step"><i>۳</i><p>یک اکشن <b>Dictionary</b> بساز و کلیدهای زیر را با خروجی اکشن‌های Health پر کن. کد خصوصی را فقط در فیلد accessToken وارد کن.</p></div><div class="ah-box"><code class="ah-code">${payload.replace(/</g,'&lt;')}</code><button id="ahCopyPayload" class="ah-copy-btn">کپی قالب Dictionary</button></div><div class="ah-step"><i>۴</i><p>اکشن <b>URL</b> را اضافه کن و نشانی زیر را وارد کن. بعد <b>Get Contents of URL</b> را با روش POST و بدنه JSON به Dictionary وصل کن.</p></div><div class="ah-box"><code class="ah-code">${endpoint}</code><button id="ahCopyEndpoint" class="ah-copy-btn">کپی نشانی اتصال</button></div><div class="ah-step"><i>۵</i><p>Shortcut را یک‌بار اجرا کن و اجازه دسترسی به داده‌های Health را بده. سپس در بخش Automation، اجرای روزانه مثلاً ساعت ۲۳:۵۵ را انتخاب کن و گزینه اجرای خودکار را فعال کن.</p></div><div class="ah-actions"><button id="ahOpenShortcuts" class="primary">بازکردن Shortcuts</button><button id="ahDone">تمام</button></div><p class="ah-note">بعد از اولین اجرای موفق، به صفحه سلامت برگرد و «به‌روزرسانی داده‌ها» را بزن.</p></section>`;
    document.body.appendChild(overlay);
    document.querySelector('#ahClose').onclick = closeGuide;
    document.querySelector('#ahDone').onclick = closeGuide;
    document.querySelector('#ahCopyEndpoint').onclick = ()=>copy(endpoint,'نشانی اتصال');
    document.querySelector('#ahCopyPayload').onclick = ()=>copy(payload,'قالب Dictionary');
    document.querySelector('#ahOpenShortcuts').onclick = ()=>location.href='shortcuts://create-shortcut';
    overlay.onclick = event=>{ if(event.target===overlay) closeGuide(); };
  }

  const page = document.querySelector('#page');
  if(page){
    new MutationObserver(()=>setTimeout(addCard,0)).observe(page,{childList:true,subtree:false});
    setTimeout(addCard,0);
  }
  document.querySelector('#enter')?.addEventListener('click',()=>setTimeout(()=>loadLatest(true),2200));
})();
