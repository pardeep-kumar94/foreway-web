/* Foreway marketing site - micro-interactions */

(function () {
  // ====== Heatmap generator ======
  const hm = document.getElementById('heatmap');
  if (hm) {
    const weeks = 26; // half-year
    const cells = weeks * 7;
    // bias intensity so it looks like progress over time
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    let html = '';
    for (let i = 0; i < cells; i++) {
      const weekIdx = Math.floor(i / 7);
      const recencyBoost = (weekIdx / weeks) * 0.4; // newer weeks more active
      let r = rand() + recencyBoost - 0.15;
      // create some streak clusters
      if (weekIdx > 14 && rand() > 0.35) r += 0.3;
      let level = 0;
      if (r > 0.2) level = 1;
      if (r > 0.45) level = 2;
      if (r > 0.65) level = 3;
      if (r > 0.85) level = 4;
      // last few days always active for streak
      if (i >= cells - 14) level = Math.max(level, 3);
      if (i >= cells - 4) level = 4;
      html += `<i data-l="${level}"></i>`;
    }
    hm.innerHTML = html;
  }

  // ====== Mini calendar ======
  const cal = document.getElementById('miniCal');
  if (cal) {
    // October 2026 — first day Thursday (5 cells of prev month start)
    // We'll show 6 rows × 7 cols = 42 cells
    const today = 23; // highlight
    const daysInOct = 31;
    const startOffset = 3; // Mon=0..Thu=3
    const events = {
      8: 'sky', 14: 'coral', 17: 'violet', 22: 'mint',
      23: 'coral', 25: 'coral', 29: 'violet', 30: 'sky'
    };
    let html = '';
    // prev month tail (Sept ends on 30; show 28,29,30)
    const prevDays = [28, 29, 30];
    prevDays.forEach(d => {
      html += `<div class="mc-day mc-prev">${d}</div>`;
    });
    for (let d = 1; d <= daysInOct; d++) {
      const cls = ['mc-day'];
      if (d === today) cls.push('mc-today');
      if (events[d]) cls.push('mc-has');
      const c = events[d] ? `data-c="${events[d]}"` : '';
      html += `<div class="${cls.join(' ')}" ${c}>${d}</div>`;
    }
    // fill out to 42
    const filled = prevDays.length + daysInOct;
    for (let d = 1; d <= 42 - filled; d++) {
      html += `<div class="mc-day mc-next">${d}</div>`;
    }
    cal.innerHTML = html;
  }

  // ====== Reveal on scroll ======
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.card, .pillar, .day-rail li, .dl-card, .streak-band-inner');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out)';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = [...entry.target.parentElement.children].indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 60, 360)}ms`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
  }

  // ====== Cursor-tracked orb on hero ======
  const hero = document.querySelector('.hero');
  const orb1 = document.querySelector('.orb-1');
  if (hero && orb1) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      orb1.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
    });
  }
})();
