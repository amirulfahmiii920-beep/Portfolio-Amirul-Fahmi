const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const FPS = 30, DT = 1000 / FPS;
const END = +(process.env.END ?? 26.5);
const fontRoute = async (route) => { const url = route.request().url(); try { const body = execFileSync('curl', ['-sS', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36', url], { maxBuffer: 1e8 }); await route.fulfill({ body, contentType: url.includes('googleapis') ? 'text/css' : 'font/woff2', headers: { 'access-control-allow-origin': '*' } }); } catch { await route.abort(); } };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, fontRoute);
  await p.addInitScript(() => {
    let now = 0; const base = Date.now(); let id = 0; let cbs = new Map();
    performance.now = () => now;
    Date.now = () => base + now;
    window.requestAnimationFrame = (cb) => { cbs.set(++id, cb); return id; };
    window.cancelAnimationFrame = (i) => cbs.delete(i);
    window.__step = (ms) => { now += ms; const run = cbs; cbs = new Map(); for (const cb of run.values()) { try { cb(now); } catch (e) { console.error(e); } }
      // drive CSS transitions/animations on the same clock
      for (const a of document.getAnimations()) { if (a.__v === undefined) { a.__v = now - ms; a.pause(); } try { a.currentTime = now - a.__v; } catch {} } };
    document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '.cursor-dot,.cursor-ring{display:none!important}'; document.head.appendChild(s); });
  });
  p.on('pageerror', (e) => console.error('pageerror', e.message));
  // fonts first, so the preloader starts with real type
  await p.goto('file://' + process.cwd() + '/dist/index.html', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const cdp = await p.context().newCDPSession(p);
  let mouse = { x: 640, y: 400 };
  const navPos = (label) => p.evaluate((label) => { const a = [...document.querySelectorAll('.header-nav a')].find((x) => x.textContent.trim() === label).getBoundingClientRect(); return { x: a.left + a.width / 2, y: a.top + a.height / 2 }; }, label);
  const moves = []; // {t0,t1,from,to}
  const moveTo = async (t, dur, to) => { moves.push({ t0: t, t1: t + dur, from: null, to }); };
  const sched = [
    [5.6, async (t) => moveTo(t, 1.8, { x: 900, y: 300 })],
    [8.4, async (t) => moveTo(t, 0.6, await navPos('About'))],
    [9.2, async () => p.evaluate(() => [...document.querySelectorAll('.header-nav a')].find((x) => x.textContent.trim() === 'About').click())],
    [11.0, async (t) => moveTo(t, 0.6, { x: 700, y: 520 })],
    ...[0, 1, 2, 3, 4, 5].map((k) => [11.9 + k * 0.16, async () => p.mouse.wheel(0, 140)]),
    [14.6, async () => p.mouse.wheel(0, -60)],
    [15.0, async (t) => moveTo(t, 0.5, await navPos('Toolkit'))],
    [15.7, async () => p.evaluate(() => [...document.querySelectorAll('.header-nav a')].find((x) => x.textContent.trim() === 'Toolkit').click())],
    [18.6, async () => p.mouse.wheel(0, -60)],
    [19.0, async (t) => moveTo(t, 0.5, await navPos('Experience'))],
    [19.7, async () => p.evaluate(() => [...document.querySelectorAll('.header-nav a')].find((x) => x.textContent.trim() === 'Experience').click())],
    [22.6, async () => p.mouse.wheel(0, -60)],
    [23.0, async (t) => moveTo(t, 0.5, await navPos('Work'))],
    [23.7, async () => p.evaluate(() => [...document.querySelectorAll('.header-nav a')].find((x) => x.textContent.trim() === 'Work').click())],
    [25.6, async (t) => moveTo(t, 0.6, { x: 700, y: 520 })],
  ];
  let si = 0;
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const total = Math.round(END * FPS);
  for (let f = 0; f < total; f++) {
    const t = f / FPS;
    while (si < sched.length && sched[si][0] <= t) { await sched[si][1](t); si++; }
    for (const m of moves) {
      if (t >= m.t0 && t <= m.t1 + 1e-6) {
        if (!m.from) m.from = { ...mouse };
        const k = ease(Math.min(1, (t - m.t0) / (m.t1 - m.t0)));
        mouse = { x: m.from.x + (m.to.x - m.from.x) * k, y: m.from.y + (m.to.y - m.from.y) * k };
        await p.mouse.move(mouse.x, mouse.y);
      }
    }
    await p.evaluate((dt) => window.__step(dt), DT);
    await p.screenshot({ path: `${process.env.OUT}/f${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if (f % 150 === 0) console.log('frame', f, '/', total);
  }
  await b.close();
})();
