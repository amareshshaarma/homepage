// ── NAV DRAWER ──
  function openNav() {
    document.getElementById('nav-drawer').classList.add('open');
    document.getElementById('nav-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    document.getElementById('nav-drawer').classList.remove('open');
    document.getElementById('nav-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── RESPONSIVE CARD COUNT ──
  function getVisibleCount(key) {
    const w = window.innerWidth;
    if (key === 'reels') {
      if (w >= 1024) return 4;
      if (w >= 768) return 3;
      if (w >= 480) return 2;
      return 1;
    } else {
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }
  }

  // ── SLIDER ENGINE ──
  const sliders = {
    reels: { trackId:'reels-track', dotsId:'reels-dots', visibleCount:4, cardClass:'reel-card', current:0, autoTimer:null },
    yt:    { trackId:'yt-track',    dotsId:'yt-dots',    visibleCount:3, cardClass:'yt-card',    current:0, autoTimer:null },
  };
  let embedPlaybackLock = false;

  function initSliders() {
    Object.entries(sliders).forEach(([key, s]) => {
      const track = document.getElementById(s.trackId);
      if (!track) return;
      // Clone cards for infinite feel
      const origCards = Array.from(track.children);
      origCards.forEach(c => track.appendChild(c.cloneNode(true)));

      s.total = origCards.length;
      buildDots(key);
      startAuto(key);
    });
  }

  function buildDots(key) {
    const s = sliders[key];
    const wrap = document.getElementById(s.dotsId);
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < s.total; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.onclick = () => goTo(key, i);
      wrap.appendChild(d);
    }
  }

  function goTo(key, idx) {
    const s = sliders[key];
    const track = document.getElementById(s.trackId);
    if (!track) return;
    const cards = track.querySelectorAll('.' + s.cardClass);
    if (!cards.length) return;
    const gap = window.innerWidth <= 768 ? 16 : 20;
    const cardW = cards[0].offsetWidth + gap;

    // Wrap index
    if (idx >= s.total) idx = 0;
    if (idx < 0) idx = s.total - 1;
    s.current = idx;

    track.style.transform = `translateX(-${idx * cardW}px)`;

    // dots
    const dots = document.getElementById(s.dotsId);
    if (dots) dots.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === idx));
  }

  function slide(key, dir) {
    const s = sliders[key];
    goTo(key, s.current + dir);
    restartAuto(key);
  }

  function startAuto(key) {
    const s = sliders[key];
    clearInterval(s.autoTimer);
    if (anyVideoPlaying() || embedPlaybackLock) return;
    s.autoTimer = setInterval(() => {
      goTo(key, s.current + 1);
    }, 10000);
    const outer = document.getElementById(s.trackId)?.closest('.slider-outer');
    if (outer && !outer.dataset.hoverBound) {
      outer.dataset.hoverBound = '1';
      outer.addEventListener('mouseenter', () => clearInterval(s.autoTimer));
      outer.addEventListener('mouseleave', () => startAuto(key));
    }
  }

  function restartAuto(key) {
    clearInterval(sliders[key].autoTimer);
    startAuto(key);
  }

  // Mouse drag + touch swipe
  function addDragSwipe(trackId, key) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const outer = track.closest('.slider-outer') || track;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    const threshold = 40;

    function onStart(x, y) {
      startX = x;
      startY = y;
      dragging = true;
    }

    function onEnd(x, y) {
      if (!dragging) return;
      dragging = false;
      const dx = startX - x;
      const dy = startY - y;
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        slide(key, dx > 0 ? 1 : -1);
      }
    }

    outer.addEventListener('touchstart', e => {
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }, { passive: true });

    outer.addEventListener('touchend', e => {
      const t = e.changedTouches[0];
      onEnd(t.clientX, t.clientY);
    });

    outer.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      onStart(e.clientX, e.clientY);
    });

    outer.addEventListener('mouseup', e => onEnd(e.clientX, e.clientY));
    outer.addEventListener('mouseleave', e => onEnd(e.clientX, e.clientY));
    window.addEventListener('mouseup', e => onEnd(e.clientX, e.clientY));
  }

  function anyVideoPlaying() {
    return Array.from(document.querySelectorAll('.portfolio-video')).some(v => !v.paused && !v.ended);
  }

  function pauseOtherVideos(currentVideo) {
    document.querySelectorAll('.portfolio-video').forEach(v => {
      if (v !== currentVideo && !v.paused) v.pause();
    });
  }

  function pauseAllAuto() {
    Object.keys(sliders).forEach(key => clearInterval(sliders[key].autoTimer));
  }

  function resumeAllAuto() {
    if (anyVideoPlaying() || embedPlaybackLock) return;
    Object.keys(sliders).forEach(startAuto);
  }

  function bindPortfolioVideos() {
    document.querySelectorAll('.portfolio-video').forEach(video => {
      if (video.dataset.bound === '1') return;
      video.dataset.bound = '1';

      video.addEventListener('play', () => {
        pauseOtherVideos(video);
        pauseAllAuto();
      });

      video.addEventListener('pause', resumeAllAuto);
      video.addEventListener('ended', resumeAllAuto);
    });
  }

  // Embedded players (Instagram/Drive) cannot expose pause/end reliably.
  // Lock autoplay when user interacts with an embed and unlock on outside interaction.
  function bindEmbeddedPlayers() {
    const embeds = document.querySelectorAll('.portfolio-embed');
    if (!embeds.length) return;

    function lockAutoForEmbed() {
      embedPlaybackLock = true;
      pauseAllAuto();
    }

    function unlockAutoForEmbedIfOutside(e) {
      if (!embedPlaybackLock) return;
      const target = e.target;
      if (target && target.closest && target.closest('.portfolio-embed')) return;
      embedPlaybackLock = false;
      resumeAllAuto();
    }

    embeds.forEach(embed => {
      if (embed.dataset.bound === '1') return;
      embed.dataset.bound = '1';
      embed.addEventListener('pointerdown', lockAutoForEmbed, { passive: true });
      embed.addEventListener('touchstart', lockAutoForEmbed, { passive: true });
      embed.addEventListener('mousedown', lockAutoForEmbed);
    });

    if (!document.body.dataset.embedUnlockBound) {
      document.body.dataset.embedUnlockBound = '1';
      document.addEventListener('pointerdown', unlockAutoForEmbedIfOutside, { passive: true });
      document.addEventListener('touchstart', unlockAutoForEmbedIfOutside, { passive: true });
      document.addEventListener('mousedown', unlockAutoForEmbedIfOutside);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    bindPortfolioVideos();
    bindEmbeddedPlayers();
    addDragSwipe('reels-track','reels');
    addDragSwipe('yt-track','yt');
  });

  // Reset sliders on resize to prevent misalignment
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      Object.keys(sliders).forEach(key => {
        const s = sliders[key];
        s.current = 0;
        const track = document.getElementById(s.trackId);
        if (track) track.style.transform = 'translateX(0)';
        const dots = document.getElementById(s.dotsId);
        if (dots) dots.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === 0));
      });
    }, 200);
  });

// Skill bars on scroll
  const fills = document.querySelectorAll('.skill-fill');
  const skillsSection = document.querySelector('.skills');
  if (skillsSection) {
    new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('on')});
    },{threshold:.3}).observe(skillsSection);
  }
