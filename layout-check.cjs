const { chromium } = require('playwright');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const proj = +(process.env.PROJ ?? 3);
(async () => {
  const b = await chromium.launch();
  let bad = 0;
  for (const [w, h, m] of [[1183, 620], [1366, 650], [1900, 870], [390, 844, 1]].filter(([w]) => !process.env.ONLY || process.env.ONLY == w)) {
    const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: !!m, hasTouch: !!m });
    await p.goto('file://' + process.cwd() + '/dist/index.html'); await sleep(11000);
    for (let k = 0; k < 10; k++) { await p.evaluate((i) => document.querySelectorAll('.work-btn')[i].click(), proj); await sleep(2500); if (await p.$('.pp')) break; }
    await sleep(3000);
    await p.evaluate(() => document.querySelector('.pp-hero').scrollIntoView());
    // pause autoplay so clicks never land on the active card
    await p.evaluate(() => [...document.querySelectorAll('.nx-actions button')].find((x) => /pause/i.test(x.textContent))?.click());
    const n = await p.evaluate(() => document.querySelectorAll('.pp-hero .nx-row button').length);
    const rows = [];
    for (let i = 0; i < n; i++) {
      await p.evaluate((i) => { const c = document.querySelectorAll('.pp-hero .nx-row button')[i]; if (!c.closest('.is-active') && !c.classList.contains('is-active')) c.click(); }, i);
      await sleep(1300); await p.evaluate(() => document.querySelector(".pp-hero").scrollIntoView()); await sleep(400);
      const r = await p.evaluate(() => {
        const q = (s) => document.querySelector(s)?.getBoundingClientRect();
        const t = q('.nx-title'), a = q('.nx-actions'), row = q('.nx-row-head') || q('.nx-row'), win = q('.nx-bg.is-on .nx-window') || q('.nx-bg.is-on .nx-frame-phone');
        const chips = [...document.querySelectorAll('.nx-bg.is-on .promo-chip, .nx-bg.is-on .promo-slot')].map((x) => x.getBoundingClientRect());
        const promoLeft = chips.length ? Math.min(...chips.map((r) => r.left)) : null;
        const label = q('.nx-bg.is-on') && document.querySelector('.nx-rating');
        const lab = label && getComputedStyle(label).display !== 'none' && +getComputedStyle(label).opacity > 0.05 ? label.getBoundingClientRect() : null;
        const labHitsFrame = lab && win ? !(win.right < lab.left || win.left > lab.right || win.bottom < lab.top || win.top > lab.bottom) : false;
        const chipHitsLabel = lab ? chips.some((r) => !(r.right < lab.left || r.left > lab.right || r.bottom < lab.top || r.top > lab.bottom)) : false;
        const btnLines = [...document.querySelectorAll('.nx-actions > *')].map((x) => Math.round(x.getBoundingClientRect().height));
        const v = document.querySelector('.nx-bg.is-on video');
        const lb = !!document.querySelector('.lb-figure');
        const ser = document.querySelector('.nx-series').getBoundingClientRect(), top = document.querySelector('.pp-top').getBoundingClientRect();
        const topClear = Math.round(ser.top - top.bottom); window.__dbg = [Math.round(q(".pp-hero").top), Math.round(ser.top), Math.round(top.bottom)];
        return { chipHitsLabel, title: document.querySelector('.nx-title').textContent, titleVsFrame: (promoLeft ?? (win && win.left)) && innerWidth > 700 ? Math.round((promoLeft ?? win.left) - t.right) : null, actionsVsRow: Math.round(row.top - a.bottom), btnH: btnLines, video: v ? !v.paused || v.readyState : null, lb, topClear, labHitsFrame, winVsRow: win && innerWidth > 700 ? Math.round(row.top - win.bottom) : null, winTopClear: win ? Math.round(win.top - top.bottom) : null, winVsInfo: win && innerWidth <= 700 ? Math.round(ser.top - win.bottom) : null };
      });
      const problems = [];
      if (r.titleVsFrame !== null && r.titleVsFrame < 12) problems.push('title touches frame ' + r.titleVsFrame);
      if (r.actionsVsRow < (m ? 0 : 12)) problems.push('buttons near row ' + r.actionsVsRow);
      if (Math.max(...r.btnH) > 70) problems.push('button wraps ' + r.btnH);
      if (r.lb) problems.push('lightbox opened');
      if (r.topClear < 6) problems.push('header covers series ' + r.topClear + ' ' + await p.evaluate(() => window.__dbg));
      if (r.chipHitsLabel) problems.push('chip hits side label');
      if (r.winVsRow !== null && r.winVsRow < 8) problems.push('framed screen reaches row ' + r.winVsRow);
      if (r.winVsInfo !== null && r.winVsInfo < 6) problems.push('framed screen under text ' + r.winVsInfo);
      if (r.winTopClear !== null && r.winTopClear < 6) problems.push('header covers framed screen ' + r.winTopClear);
      if (r.labHitsFrame) problems.push('side label over framed screen');
      if (problems.length) { bad++; await p.screenshot({ path: `${process.env.OUT}/bad-${w}-${i}.jpg`, type: 'jpeg', quality: 70 }); }
      if (process.env.SHOTALL) await p.screenshot({ path: `${process.env.OUT}/s-${w}-${i + 1}.jpg`, type: "jpeg", quality: 70 });
      rows.push(`${i + 1}${problems.length ? ' ✗ ' + problems.join('; ') : ''}${r.video !== null ? ' [video ' + r.video + ']' : ''}`);
    }
    console.log(`${w}x${h}: ` + rows.join(' | '));
    await p.close();
  }
  console.log('problems:', bad);
  await b.close();
})();
