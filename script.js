const HER_NAME   = "любимки";
const YOUR_NAME  = "Ростя";
const START_DATE = "2026-06-14T00:00:00";

const REASONS = [
  "Потому что ты умеешь превратить обычный вторник в лучший день недели.",
  "Потому что твой смех — это единственный звук, который хочется слушать по кругу.",
  "Потому что рядом с тобой я могу быть настоящим, без масок.",
  "Потому что ты замечаешь, когда мне плохо, даже если я молчу.",
  "Потому что ты поддерживаешь мои безумные идеи и делаешь их лучше.",
  "Потому что твои объятия решают половину проблем без единого слова.",
  "Потому что с тобой не страшно быть уязвимым.",
  "Потому что ты — первый человек, с которым хочется поделиться новостью.",
  "Потому что ты добра даже тогда, когда это трудно.",
  "Потому что ты веришь в меня иногда больше, чем я сам.",
  "Потому что даже твои привычки, которые все считают странными, я обожаю.",
  "Потому что рядом с тобой время идёт иначе — быстрее и теплее.",
  "Потому что ты умеешь слушать, а не просто ждать своей очереди говорить.",
  "Потому что твоя забота — не долг, а искренность.",
  "Потому что с тобой мир кажется чуточку добрее.",
  "Потому что ты не боишься быть собой рядом со мной.",
  "Потому что каждое совместное утро (жаль что пока онлайн) — маленький подарок.",
  "Потому что ты вдохновляешь меня становиться лучше, а не притворяться другим.",
  "Потому что твоя честность важнее любых красивых слов.",
  "Потому что даже в спорах ты остаёшься человеком, с которым я хочу быть.",
  "Потому что ты умеешь превращать грусть в что-то, что можно пережить вместе.",
  "Потому что ты — дом, даже когда мы просто сидим рядом молча.",
  "Потому что я скучаю по тебе, даже когда ты рядом.",
  "Потому что это правда: я люблю тебя — целиком, без условий."
];

function dayWord(n){
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return "дня";
  return "дней";
}

function initConfettiBackground(){
  const bg = document.getElementById('confetti-bg');
  if (!bg) return;
  const emojis = ['💛','✨','💕','🌟','💫','💗'];

  function spawnBit(){
    const el = document.createElement('div');
    el.className = 'bit';
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.left = Math.random()*100 + 'vw';
    el.style.fontSize = (14 + Math.random()*16) + 'px';
    const duration = 6 + Math.random()*6;
    el.style.animationDuration = duration + 's';
    bg.appendChild(el);
    setTimeout(() => el.remove(), duration*1000 + 200);
  }
  if (window.confettiTimer) clearInterval(window.confettiTimer);
  window.confettiTimer = setInterval(spawnBit, 550);
  for (let i=0;i<8;i++) setTimeout(spawnBit, i*200);

  window.burstConfetti = function(n){
    for(let i=0;i<n;i++){
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'bit';
        el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left = Math.random()*100 + 'vw';
        el.style.top = '20vh';
        el.style.fontSize = (14 + Math.random()*20) + 'px';
        const duration = 2.5 + Math.random()*2;
        el.style.animationDuration = duration + 's';
        bg.appendChild(el);
        setTimeout(() => el.remove(), duration*1000 + 200);
      }, i*15);
    }
  };
}

function initSiteMusic(){
  let music = document.getElementById('site-music');
  if (!music){
    music = document.createElement('audio');
    music.id = 'site-music';
    music.src = 'music.mp3';
    music.loop = true;
    music.preload = 'auto';
    music.volume = 0.15;
    document.body.appendChild(music);
  }

  const startMusic = () => music.play().catch(() => {});
  startMusic();
  if (!window.musicClickListenerAdded){
    document.addEventListener('click', startMusic, { once: true });
    window.musicClickListenerAdded = true;
  }
}

function initSmoothNavigation(){
  if (window.smoothNavigationInitialized) return;
  window.smoothNavigationInitialized = true;

  async function loadPage(url, addToHistory){
    try {
      const response = await fetch(url.href);
      if (!response.ok) throw new Error('Page loading failed');
      const html = await response.text();
      const nextPage = new DOMParser().parseFromString(html, 'text/html');
      const music = document.getElementById('site-music');
      const nodes = Array.from(nextPage.body.childNodes).filter((node) => {
        return !(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT');
      });

      document.body.replaceChildren(...nodes);
      if (music) document.body.appendChild(music);
      document.title = nextPage.title;
      if (addToHistory) history.pushState({}, '', url.href);

      initConfettiBackground();
      initNavHighlight();
      initHomePage();
      initReasonsPage();
      initChosenPage();
      initMeterPage();
      initTogetherPage();
      initFinalePage();
    } catch {
      location.href = url.href;
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    event.preventDefault();
    loadPage(url, true);
  });

  window.addEventListener('popstate', () => loadPage(new URL(location.href), false));
}

function initNavHighlight(){
  const links = document.querySelectorAll('nav.sitenav a');
  const here = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
}

function initHomePage(){
  const el = document.getElementById('her-name-hero');
  if (el) el.textContent = HER_NAME;
}

function initReasonsPage(){
  const card = document.getElementById('reason-card');
  const btn = document.getElementById('reason-btn');
  if (!card || !btn) return;
  const countEl = document.getElementById('reason-count');
  let shown = [];

  btn.addEventListener('click', () => {
    if (shown.length >= REASONS.length){
      card.textContent = "Это ещё не всё, нажимай дальше";
      btn.disabled = true;
      btn.style.opacity = .6;
      return;
    }
    let idx;
    do { idx = Math.floor(Math.random() * REASONS.length); } while (shown.includes(idx));
    shown.push(idx);
    card.classList.remove('pop');
    void card.offsetWidth;
    card.textContent = REASONS[idx];
    card.classList.add('pop');
    btn.textContent = "Ещё одна причина";
    countEl.textContent = "открыто " + shown.length + " из " + REASONS.length;
  });
}

function initChosenPage(){
  const btn = document.getElementById('chosen-secret-btn');
  const text = document.getElementById('chosen-secret');
  if (!btn || !text) return;

  btn.addEventListener('click', () => {
    text.classList.add('shown');
    btn.textContent = 'Я всё ещё выбираю тебя 💞';
    if (window.burstConfetti) window.burstConfetti(20);
  });
}

function initMeterPage(){
  const range = document.getElementById('meter-range');
  if (!range) return;
  const fill = document.getElementById('meter-fill');
  const label = document.getElementById('meter-label');
  const messages = [
    [0, "🙂 немного"],
    [25, "😊 уже тепло"],
    [50, "🥰 довольно сильно"],
    [75, "😍 очень сильно"],
    [95, "🤯 шкалы не хватает"],
    [100, "💥 бесконечно"]
  ];
  function updateMeter(){
    const v = Number(range.value);
    fill.style.width = Math.max(v,4) + "%";
    let txt = messages[0][1];
    for (const [thresh, m] of messages){ if (v >= thresh) txt = m; }
    label.textContent = txt;
    if (v === 100 && window.burstConfetti){ window.burstConfetti(30); }
  }
  range.addEventListener('input', updateMeter);
  updateMeter();
}

function initTogetherPage(){
  const wrap = document.getElementById('together-wrap');
  if (!wrap) return;

  const daysEl = document.getElementById('together-days');
  const hoursEl = document.getElementById('together-hours');
  const minutesEl = document.getElementById('together-minutes');
  const secondsEl = document.getElementById('together-seconds');
  const dateEl = document.getElementById('together-date');

  const start = new Date(START_DATE);
  if (dateEl) dateEl.textContent = 'с ' + start.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  function updateTogetherTime(){
    const now = new Date();
    const diff = Math.max(0, now.getTime() - start.getTime());

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTogetherTime();
  setInterval(updateTogetherTime, 1000);
}

function initFinalePage(){
  const sigEl = document.getElementById('signature');
  const heartBtn = document.getElementById('heart-btn');
  if (!sigEl && !heartBtn) return;

  if (sigEl) sigEl.textContent = "— с любовью, " + YOUR_NAME;

  if (START_DATE){
    const finaleText = document.getElementById('finale-text');
    if (finaleText){
      const start = new Date(START_DATE);
      const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
      finaleText.textContent += " Уже " + days + " " + dayWord(days) + " с тобой — и я не хочу останавливаться.";
    }
  }

  if (heartBtn){
    heartBtn.addEventListener('click', (e) => {
      if (window.burstConfetti) window.burstConfetti(40);
      e.target.textContent = "Теперь ты знаешь 💛";
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSiteMusic();
  initSmoothNavigation();
  initConfettiBackground();
  initNavHighlight();
  initHomePage();
  initReasonsPage();
  initChosenPage();
  initMeterPage();
  initTogetherPage();
  initFinalePage();
});
