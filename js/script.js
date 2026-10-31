// Page loader: keep it up for at least 2s so the quote can be read, then fade it out once the page has loaded
const loader = document.getElementById('loader');
function hideLoader() {
  setTimeout(() => {
    document.documentElement.classList.add('loaded');
    setTimeout(() => loader.remove(), 700);
  }, Math.max(0, 2000 - performance.now()));
}
if (document.readyState === 'complete') hideLoader();
else window.addEventListener('load', hideLoader);

// Mobile menu
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// Mobile marquees: duplicate each list once so it can scroll in a seamless loop (duplicates are hidden on wider screens)
document.querySelectorAll('.marquee-track').forEach(track => {
  [...track.children].forEach(item => {
    const clone = item.cloneNode(true);
    clone.classList.remove('reveal');
    clone.setAttribute('aria-hidden', 'true');
    clone.dataset.clone = '';
    // Keep links in the hidden copies out of the keyboard tab order
    [clone, ...clone.querySelectorAll('a')].forEach(el => { if (el.matches('a')) el.tabIndex = -1; });
    track.append(clone);
  });
});

// Gentle rise on scroll (content is always visible)
document.documentElement.classList.add('js');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Savings estimator: ~4 units/kW/day (~120/month), ~Rs 6/unit, ~100 sq.ft per kW
const units = document.getElementById('units');
const fmt = n => n.toLocaleString('en-IN');
function calc() {
  const u = +units.value;
  const kw = Math.max(1, Math.ceil(u / 120));
  const gen = kw * 120;
  const saved = Math.min(gen, u) * 12 * 6;
  document.getElementById('unitsOut').textContent = u + ' units';
  document.getElementById('kw').textContent = kw + ' kW';
  document.getElementById('gen').textContent = '~' + fmt(gen) + ' units';
  document.getElementById('save').textContent = '₹' + fmt(saved);
  document.getElementById('area').textContent = '~' + fmt(kw * 100) + ' sq.ft';
}
units.addEventListener('input', calc);
calc();

// Enquiry form -> WhatsApp
const form = document.getElementById('enquiry');
const waSend = document.getElementById('waSend');
function buildWa() {
  const f = form.elements;
  const msg = `Hi Solaarr Galaxy,\nName: ${f.name.value}\nPhone: ${f.phone.value}\nCity: ${f.city.value}\nInterested in: ${f.need.value}\n${f.msg.value}`;
  waSend.href = 'https://wa.me/919952425372?text=' + encodeURIComponent(msg);
}
form.addEventListener('input', buildWa);
form.addEventListener('change', buildWa);
form.addEventListener('submit', e => e.preventDefault());
waSend.addEventListener('click', e => {
  if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); }
});
buildWa();

document.getElementById('yr').textContent = new Date().getFullYear();
