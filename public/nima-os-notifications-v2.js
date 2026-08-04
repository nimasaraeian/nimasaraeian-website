(() => {
  const PUSH_API = 'https://qmlacuiguaryobzoryyn.supabase.co/functions/v1/nima-push';
  const DEVICE_KEY = 'nimaOS.push.deviceId';
  const PREF_KEY = 'nimaOS.push.preferences';
  const defaultPrefs = {
    morning:'09:00', walk:'18:30', evening:'22:30',
    morningEnabled:true, walkEnabled:true, eveningEnabled:true,
    customReminders:[]
  };
  const dayNames = [{id:6,n:'ش'}, {id:0,n:'ی'}, {id:1,n:'د'}, {id:2,n:'س'}, {id:3,n:'چ'}, {id:4,n:'پ'}, {id:5,n:'ج'}];
  const css = `.notification-card{background:linear-gradient(145deg,#202d5b,#0c1e3b)!important;border-color:#7d85ff55!important}.push-top{display:flex;align-items:center;gap:11px}.push-icon{width:43px;height:43px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#7d85ff55,#4fd8ff33);font-size:21px}.push-copy{flex:1}.push-copy b{display:block;font-size:13px}.push-copy small{display:block;color:#91a1bc;font-size:10px;margin-top:4px}.push-status{font-size:10px;padding:6px 9px;border-radius:99px;background:#f2c46c20;color:#f2c46c}.push-status.on{background:#55d9a720;color:#55d9a7}.push-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.push-actions button{border:1px solid #263958;border-radius:13px;padding:10px 12px;color:#fff;background:#172744}.push-actions button.primary{border:0;background:linear-gradient(135deg,#7d85ff,#5665e8)}.push-note{font-size:10px;color:#91a1bc;line-height:1.8;margin:11px 0 0}.push-overlay{position:fixed;inset:0;z-index:100;background:#02060dcc;backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center}.push-sheet{width:min(680px,100%);max-height:91dvh;overflow:auto;border-radius:28px 28px 0 0;padding:20px 16px calc(24px + env(safe-area-inset-bottom));background:linear-gradient(160deg,#132441,#081223);border:1px solid #263958}.push-sheet h2{margin:0 0 5px}.push-sheet h3{font-size:14px;margin:22px 0 10px}.push-sheet>p{color:#91a1bc;font-size:11px;line-height:1.8}.push-close{float:left;border:1px solid #263958;background:#101d33;color:#fff;width:37px;height:37px;border-radius:13px;font-size:20px}.push-times{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:16px 0}.push-time,.push-form{padding:11px;border-radius:16px;background:#061020;border:1px solid #263958}.push-time label,.push-label{display:block;color:#91a1bc;font-size:10px;margin-bottom:7px}.push-time input,.push-input,.push-textarea{width:100%;border:0;outline:0;background:#0b1729;color:#fff;border-radius:11px;padding:10px}.push-time input{background:transparent;padding:0;direction:ltr;text-align:center}.push-textarea{resize:vertical;min-height:68px}.push-form-grid{display:grid;grid-template-columns:1fr 110px;gap:8px}.push-days{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin:10px 0}.push-day input{display:none}.push-day span{display:grid;place-items:center;height:34px;border-radius:10px;background:#101d33;border:1px solid #263958;color:#91a1bc;font-size:11px}.push-day input:checked+span{background:#7d85ff33;border-color:#7d85ff;color:#fff}.custom-list{display:grid;gap:8px;margin-top:12px}.custom-item{padding:12px;border-radius:15px;background:#0a1729;border:1px solid #263958}.custom-row{display:flex;align-items:center;gap:9px}.custom-copy{flex:1;min-width:0}.custom-copy b{display:block;font-size:12px}.custom-copy small{display:block;color:#91a1bc;font-size:10px;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.custom-time{direction:ltr;font-size:12px;color:#ccd2ff}.custom-delete{border:0!important;background:#4a1824!important;color:#ff9bad!important;padding:7px 9px!important}.custom-toggle{width:38px;height:22px;border-radius:99px;background:#29364b;position:relative;border:0}.custom-toggle:after{content:'';position:absolute;width:17px;height:17px;border-radius:50%;background:#8997ac;top:2.5px;right:3px;transition:.2s}.custom-toggle.on{background:#55d9a744}.custom-toggle.on:after{right:18px;background:#55d9a7}.empty-reminders{text-align:center;color:#91a1bc;font-size:11px;padding:16px}.push-warning{padding:11px;border-radius:15px;background:#f2c46c12;border:1px solid #f2c46c24;color:#e9d39c;font-size:11px;line-height:1.8}@media(max-width:420px){.push-times{grid-template-columns:1fr}.push-form-grid{grid-template-columns:1fr}.push-actions button{flex:1}}`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function esc(value){ return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }
  function deviceId(){ let id=localStorage.getItem(DEVICE_KEY); if(!id){id=(crypto.randomUUID?crypto.randomUUID():'d-'+Date.now()+'-'+Math.random().toString(36).slice(2));localStorage.setItem(DEVICE_KEY,id)} return id }
  function token(){ try{return localStorage.getItem(TK)||''}catch{return ''} }
  function prefs(){
    try{
      const stored=JSON.parse(localStorage.getItem(PREF_KEY)||'{}');
      return {...defaultPrefs,...stored,customReminders:Array.isArray(stored.customReminders)?stored.customReminders:[]};
    }catch{return {...defaultPrefs,customReminders:[]}}
  }
  function standalone(){ return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true }
  function permission(){ return !('Notification' in window)?'unsupported':Notification.permission }
  function statusText(){ return permission()==='granted'?'فعال':permission()==='denied'?'مسدود':permission()==='unsupported'?'پشتیبانی نمی‌شود':'خاموش' }
  function b64(value){ const pad='='.repeat((4-value.length%4)%4),raw=atob((value+pad).replace(/-/g,'+').replace(/_/g,'/')); return Uint8Array.from([...raw].map(c=>c.charCodeAt(0))) }
  async function request(action, extra={}){ const r=await fetch(PUSH_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,accessToken:token(),deviceId:deviceId(),...extra})}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'سرویس اعلان پاسخ نداد'); return d }
  async function registration(){ if(!('serviceWorker' in navigator)||!('PushManager' in window)) throw new Error('این مرورگر Push را پشتیبانی نمی‌کند'); await navigator.serviceWorker.register('/nima-os-sw.js?v=3',{scope:'/'}); return navigator.serviceWorker.ready }
  async function subscription(){ try{return (await registration()).pushManager.getSubscription()}catch{return null} }
  async function sync(sub, suppliedPrefs){ const p=suppliedPrefs||prefs(); await request('subscribe',{subscription:sub.toJSON(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',preferences:p}); return sub }
  async function persist(p, eventType='notification_preferences_updated'){
    localStorage.setItem(PREF_KEY,JSON.stringify(p));
    const sub=await subscription();
    if(sub) await sync(sub,p);
    await event(eventType,p);
  }
  async function enable(){
    if(!standalone()) throw new Error('اول این صفحه را Add to Home Screen کن و Nima OS را از آیکن صفحه اصلی باز کن');
    if(!('Notification' in window)) throw new Error('اعلان در این نسخه iOS پشتیبانی نمی‌شود');
    const granted=await Notification.requestPermission(); if(granted!=='granted') throw new Error('اجازه اعلان داده نشد');
    const reg=await registration(); let sub=await reg.pushManager.getSubscription();
    if(!sub){ const k=await request('public-key'); sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(k.publicKey)}) }
    await sync(sub); await event('notification_enabled',{timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,preferences:prefs()}); notify('اعلان واقعی فعال شد ✓'); refreshCard(); return sub;
  }
  async function test(title,message){ const sub=await subscription()||await enable(); await request('test',{subscription:sub.toJSON(),title,message}); notify('اعلان آزمایشی ارسال شد') }
  async function saveBuiltIns(){
    const p=prefs();
    p.morning=document.querySelector('#pushMorning').value;
    p.walk=document.querySelector('#pushWalk').value;
    p.evening=document.querySelector('#pushEvening').value;
    await persist(p);
    notify('ساعت‌های اصلی ذخیره شد');
    openSheet(); refreshCard();
  }
  function notify(text){ try{toast(text)}catch{console.log(text)} }
  async function event(eventType,payload={}){ if(!token()) return; try{await fetch(PUSH_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'event',accessToken:token(),deviceId:deviceId(),eventType,payload})})}catch{} }

  function cardHTML(){ const on=permission()==='granted',count=prefs().customReminders.length; return `<div class="push-top"><div class="push-icon">🔔</div><div class="push-copy"><b>اعلان‌های هوشمند</b><small>۳ اعلان اصلی${count?` + ${count} یادآور شخصی`:''}</small></div><span class="push-status ${on?'on':''}">${statusText()}</span></div><div class="push-actions"><button id="pushEnable" class="primary">${on?'همگام‌سازی':'فعال‌سازی اعلان'}</button><button id="pushTest">اعلان آزمایشی</button><button id="pushSettings">مدیریت اعلان‌ها</button></div><p class="push-note">اعلان دلخواه با عنوان، متن، ساعت و روزهای هفته بساز.</p>` }
  function refreshCard(){ const c=document.querySelector('#nimaPushCard'); if(c){c.innerHTML=cardHTML(); bindCard()} }
  function addCard(){ if(typeof A==='undefined'||A!=='today') return; const stack=document.querySelector('#page .stack'); if(!stack||document.querySelector('#nimaPushCard')) return; const c=document.createElement('section'); c.id='nimaPushCard'; c.className='card notification-card'; c.innerHTML=cardHTML(); const after=stack.children[2]; after?after.insertAdjacentElement('afterend',c):stack.appendChild(c); bindCard() }
  function bindCard(){ const e=document.querySelector('#pushEnable'),t=document.querySelector('#pushTest'),s=document.querySelector('#pushSettings'); if(e)e.onclick=()=>enable().catch(x=>notify(x.message)); if(t)t.onclick=()=>test().catch(x=>notify(x.message)); if(s)s.onclick=openSheet }
  function closeSheet(){ document.querySelector('#nimaPushOverlay')?.remove() }

  function daysText(days){
    if(!Array.isArray(days)||days.length===7) return 'هر روز';
    const full={0:'یکشنبه',1:'دوشنبه',2:'سه‌شنبه',3:'چهارشنبه',4:'پنجشنبه',5:'جمعه',6:'شنبه'};
    return days.map(d=>full[d]).filter(Boolean).join('، ');
  }
  function customListHTML(p){
    if(!p.customReminders.length) return '<div class="empty-reminders">هنوز یادآور شخصی نساخته‌ای.</div>';
    return p.customReminders.map(r=>`<div class="custom-item"><div class="custom-row"><button class="custom-toggle ${r.enabled!==false?'on':''}" data-toggle-reminder="${esc(r.id)}" aria-label="فعال یا غیرفعال"></button><div class="custom-copy"><b>${esc(r.title)}</b><small>${esc(r.body)} · ${esc(daysText(r.days))}</small></div><span class="custom-time">${esc(r.time)}</span><button class="custom-delete" data-delete-reminder="${esc(r.id)}">حذف</button></div></div>`).join('');
  }
  function openSheet(){
    const p=prefs(); closeSheet();
    const dayBoxes=dayNames.map(d=>`<label class="push-day"><input type="checkbox" name="pushDay" value="${d.id}" checked><span>${d.n}</span></label>`).join('');
    const o=document.createElement('div'); o.id='nimaPushOverlay'; o.className='push-overlay';
    o.innerHTML=`<section class="push-sheet"><button id="pushClose" class="push-close">×</button><h2>مدیریت اعلان‌ها</h2><p>زمان‌بند سرور هر دقیقه بررسی می‌کند و هر یادآور را در روزهای انتخابی می‌فرستد.</p>${standalone()?'':'<div class="push-warning">برای فعال‌سازی اعلان آیفون، این صفحه را Add to Home Screen کن و اپ را از آیکن صفحه اصلی باز کن.</div>'}<h3>اعلان‌های اصلی</h3><div class="push-times"><div class="push-time"><label>شروع صبح</label><input id="pushMorning" type="time" value="${p.morning}"></div><div class="push-time"><label>پیاده‌روی</label><input id="pushWalk" type="time" value="${p.walk}"></div><div class="push-time"><label>مرور شبانه</label><input id="pushEvening" type="time" value="${p.evening}"></div></div><div class="push-actions"><button id="pushSaveBuiltIns">ذخیره ساعت‌های اصلی</button><button id="pushEnableSheet" class="primary">فعال‌سازی اعلان</button><button id="pushTestSheet">تست اعلان</button></div><h3>افزودن یادآور دلخواه</h3><div class="push-form"><label class="push-label">عنوان اعلان</label><input id="customTitle" class="push-input" maxlength="80" placeholder="مثلاً تماس با دکتر"><label class="push-label" style="margin-top:10px">متن اعلان</label><textarea id="customBody" class="push-textarea" maxlength="220" placeholder="مثلاً ساعت ویزیت را فراموش نکن"></textarea><div class="push-form-grid"><div><label class="push-label" style="margin-top:10px">روزهای تکرار</label><div class="push-days">${dayBoxes}</div></div><div><label class="push-label" style="margin-top:10px">ساعت</label><input id="customTime" class="push-input" type="time" value="12:00" style="direction:ltr;text-align:center"></div></div><button id="addCustomReminder" class="btn primary" style="width:100%;margin-top:9px">＋ افزودن یادآور</button></div><h3>یادآورهای من</h3><div id="customReminderList" class="custom-list">${customListHTML(p)}</div><p class="push-note">منطقه زمانی گوشی: ${Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}</p></section>`;
    document.body.appendChild(o);
    document.querySelector('#pushClose').onclick=closeSheet;
    o.onclick=e=>{if(e.target===o)closeSheet()};
    document.querySelector('#pushEnableSheet').onclick=()=>enable().then(openSheet).catch(x=>notify(x.message));
    document.querySelector('#pushTestSheet').onclick=()=>test().catch(x=>notify(x.message));
    document.querySelector('#pushSaveBuiltIns').onclick=()=>saveBuiltIns().catch(x=>notify(x.message));
    document.querySelector('#addCustomReminder').onclick=()=>addCustomReminder().catch(x=>notify(x.message));
    document.querySelectorAll('[data-delete-reminder]').forEach(b=>b.onclick=()=>removeCustomReminder(b.dataset.deleteReminder).catch(x=>notify(x.message)));
    document.querySelectorAll('[data-toggle-reminder]').forEach(b=>b.onclick=()=>toggleCustomReminder(b.dataset.toggleReminder).catch(x=>notify(x.message)));
  }
  async function addCustomReminder(){
    const title=document.querySelector('#customTitle').value.trim();
    const body=document.querySelector('#customBody').value.trim();
    const time=document.querySelector('#customTime').value;
    const days=[...document.querySelectorAll('input[name="pushDay"]:checked')].map(x=>Number(x.value));
    if(!title) throw new Error('عنوان اعلان را بنویس');
    if(!body) throw new Error('متن اعلان را بنویس');
    if(!time) throw new Error('ساعت اعلان را انتخاب کن');
    if(!days.length) throw new Error('حداقل یک روز را انتخاب کن');
    const p=prefs();
    p.customReminders.push({id:crypto.randomUUID?crypto.randomUUID():'r-'+Date.now(),title,body,time,days,enabled:true});
    await persist(p,'custom_reminder_created');
    notify('یادآور جدید اضافه شد ✓');
    openSheet(); refreshCard();
  }
  async function removeCustomReminder(id){
    const p=prefs();
    p.customReminders=p.customReminders.filter(r=>r.id!==id);
    await persist(p,'custom_reminder_deleted');
    notify('یادآور حذف شد');
    openSheet(); refreshCard();
  }
  async function toggleCustomReminder(id){
    const p=prefs();
    p.customReminders=p.customReminders.map(r=>r.id===id?{...r,enabled:r.enabled===false}:r);
    await persist(p,'custom_reminder_toggled');
    openSheet(); refreshCard();
  }

  navigator.serviceWorker?.register('/nima-os-sw.js?v=3',{scope:'/'}).catch(()=>{});
  const page=document.querySelector('#page'); if(page){new MutationObserver(()=>setTimeout(addCard,0)).observe(page,{childList:true,subtree:false}); setTimeout(addCard,0)}
  const bell=document.querySelector('#bell'); if(bell) bell.onclick=openSheet;

  const originalSet=Storage.prototype.setItem; let timer;
  Storage.prototype.setItem=function(key,value){ originalSet.apply(this,arguments); try{if(typeof K!=='undefined'&&key===K){clearTimeout(timer);timer=setTimeout(()=>{let snapshot;try{snapshot=JSON.parse(value)}catch{return}event('state_snapshot',{state:snapshot,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})},700)}}catch{} };
  document.querySelector('#enter')?.addEventListener('click',()=>setTimeout(()=>event('app_open',{standalone:standalone(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,path:location.pathname,from:new URLSearchParams(location.search).get('from')}),1800));
  if(token()) setTimeout(()=>event('app_open',{standalone:standalone(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,path:location.pathname,from:new URLSearchParams(location.search).get('from')}),1200);
})();
