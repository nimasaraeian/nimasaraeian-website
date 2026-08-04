(() => {
  function say(text){ try{toast(text)}catch{console.log(text)} }

  function bind(){
    const button = document.querySelector('#ahRefresh');
    const card = document.querySelector('#appleHealthCard');
    if(!button || !card || button.dataset.feedbackBound === '1') return;

    button.dataset.feedbackBound = '1';
    button.textContent = 'بررسی داده دریافتی';

    button.addEventListener('click', () => {
      button.disabled = true;
      const old = button.textContent;
      button.textContent = 'در حال بررسی…';
      say('در حال بررسی اتصال Apple Health…');

      setTimeout(() => {
        const connected = card.querySelector('.ah-status.on');
        if(connected){
          say('داده‌های Apple Health دریافت و تازه‌سازی شد ✓');
        }else{
          say('هنوز داده‌ای از Shortcuts نرسیده؛ ابتدا Nima Health Sync را اجرا کن.');
        }
        button.disabled = false;
        button.textContent = old;
      }, 1400);
    });
  }

  const observer = new MutationObserver(() => setTimeout(bind, 0));
  observer.observe(document.documentElement, { childList:true, subtree:true });
  setTimeout(bind, 0);
})();
