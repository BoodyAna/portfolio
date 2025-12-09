/* main.js - Level 5 Portfolio Fixed Scroll */

// AOS init
AOS.init({ duration:700, once:true });

const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// loader removal
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(()=> loader.style.opacity = '0', 220);
  setTimeout(()=> { try{ loader.remove(); }catch{} }, 600);
});

// cursor + streaks
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const streakCanvas = document.getElementById('streak');
const ctx = streakCanvas.getContext && streakCanvas.getContext('2d');

function resizeCanvas(){
  if(!ctx) return;
  streakCanvas.width = window.innerWidth * devicePixelRatio;
  streakCanvas.height = window.innerHeight * devicePixelRatio;
  streakCanvas.style.width = window.innerWidth + 'px';
  streakCanvas.style.height = window.innerHeight + 'px';
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
if(ctx) resizeCanvas();
window.addEventListener('resize', () => { if(ctx) resizeCanvas(); });

// trail particles
let trails = [];
const maxTrails = 26;
function addTrail(x,y){
  if(!ctx || prefersReduced || isMobile) return;
  trails.push({x,y,vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, life: 60 + Math.random()*60, size: 6+Math.random()*10, hue: 180 + Math.random()*60});
  if(trails.length > maxTrails) trails.shift();
}
function animateTrails(){
  if(!ctx || prefersReduced || isMobile) return;
  ctx.clearRect(0,0,streakCanvas.width, streakCanvas.height);
  for(let i = trails.length-1; i>=0; i--){
    const t = trails[i];
    t.x += t.vx * 0.6;
    t.y += t.vy * 0.6;
    t.life -= 1.5;
    const alpha = Math.max(0, t.life/140);
    ctx.beginPath();
    const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size*2);
    grad.addColorStop(0, `hsla(${t.hue},100%,60%,${alpha})`);
    grad.addColorStop(1, `hsla(${t.hue+60}, 100%, 45%, 0)`);
    ctx.fillStyle = grad;
    ctx.arc(t.x, t.y, t.size, 0, Math.PI*2);
    ctx.fill();
    if(t.life <= 0) trails.splice(i,1);
  }
  requestAnimationFrame(animateTrails);
}
animateTrails();

document.addEventListener('mousemove', (e) => {
  const x = e.clientX, y = e.clientY;
  if(cursorDot){ cursorDot.style.left = x + 'px'; cursorDot.style.top = y + 'px'; }
  if(cursorRing){ cursorRing.style.left = x + 'px'; cursorRing.style.top = y + 'px'; }
  addTrail(x, y);
});

// cursor state
function setCursorState(active){
  if(!cursorDot || !cursorRing) return;
  if(active){
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1.8)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(0.8)';
    cursorRing.style.opacity = '0.8';
  } else {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.opacity = '0.6';
  }
}
['a','button','.mag-btn','.proj-front'].forEach(sel=>{
  document.addEventListener('mouseover', (e)=>{
    if(e.target.closest(sel)) setCursorState(true);
  }, true);
  document.addEventListener('mouseout', (e)=>{
    if(e.target.closest(sel)) setCursorState(false);
  }, true);
});

// GSAP interactions
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);

let smoother;
try {
  if(!prefersReduced && !isMobile && ScrollSmoother) {
    smoother = ScrollSmoother.create({ 
      wrapper: "#smooth-wrapper",   // <-- wrapper div
      content: "#smooth-content",   // <-- content div
      smooth: 0.8,
      effects: true
    });
  }
} catch(e){}

// Hero interactions
const portrait = document.getElementById('portraitCard');
const heroTitle = document.getElementById('heroTitle');

if(!prefersReduced){
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    const rX = dy * 6;
    const rY = dx * -10;
    const tX = dx * 12;
    const tY = dy * 10;
    if(portrait) gsap.to(portrait, { rotationX: rX, rotationY: rY, x: tX, y: tY, duration: 0.8, ease: "power3.out" });
    if(heroTitle) gsap.to(heroTitle, { x: tX*0.4, y: tY*0.4, duration: 0.8, ease: "power3.out" });
  });
}

// magnetic buttons
function magneticize(el){
  if(prefersReduced || isMobile) return;
  el.addEventListener('mousemove', (ev)=>{
    const rect = el.getBoundingClientRect();
    const relX = ev.clientX - rect.left;
    const relY = ev.clientY - rect.top;
    const px = (relX - rect.width/2) / (rect.width/2);
    const py = (relY - rect.height/2) / (rect.height/2);
    gsap.to(el, { x: px*12, y: py*8, rotation: px*6, scale: 1.04, duration: 0.35, ease: 'power3.out' });
  });
  el.addEventListener('mouseleave', ()=>{
    gsap.to(el, { x:0, y:0, rotation:0, scale:1, duration:0.5, ease:'elastic.out(1,0.6)'} );
  });
}
document.querySelectorAll('.mag-btn').forEach(magneticize);

// project flip and hover
document.querySelectorAll('[data-proj]').forEach(proj => {
  if(prefersReduced) return;
  const inner = proj;
  proj.addEventListener('mouseenter', (e) => { gsap.to(inner, { rotateY: -12, duration: 0.45, ease:'power2.out' }); });
  proj.addEventListener('mousemove', (e) => {
    const rect = inner.getBoundingClientRect();
    const px = (e.clientX - rect.left)/rect.width;
    const py = (e.clientY - rect.top)/rect.height;
    const rY = (px - 0.5) * 18;
    const rX = (0.5 - py) * 8;
    gsap.to(inner, { rotationY: rY, rotationX: rX, duration: 0.25, ease:'power2.out' });
  });
  proj.addEventListener('mouseleave', (e) => { gsap.to(inner, { rotationY: 0, rotationX: 0, duration: 0.6, ease:'expo.out' }); });

  proj.addEventListener('click', (ev) => {
    if(ev.target.closest('.proj-front')) return;
    const isFlipped = inner.style.transform && inner.style.transform.includes('rotateY(180deg)');
    if(!isFlipped){
      gsap.to(inner, { rotationY: 180, duration: 0.8, ease:'power4.inOut' });
      setCursorState(true);
      setTimeout(()=> setCursorState(false), 900);
    } else {
      gsap.to(inner, { rotationY: 0, duration: 0.6, ease:'power4.out' });
    }
  });
});

// section reveal
gsap.utils.toArray('section').forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 80%',
    onEnter: () => gsap.fromTo(sec, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease:'power2.out' })
  });
});

// CTA scroll
const primaryCTA = document.getElementById('primaryCTA');
if(primaryCTA) primaryCTA.addEventListener('click', (e) => {
  e.preventDefault();
  gsap.to(window, { duration: 1.1, scrollTo: {y:'#projects', offsetY: 90}, ease:'power2.out' });
});

// CTA scroll
const secondaryCTA = document.getElementById('secondaryCTA');
if(secondaryCTA) secondaryCTA.addEventListener('click', (e) => {
  e.preventDefault();
  gsap.to(window, { duration: 1.1, scrollTo: {y:'#contact', offsetY: 90}, ease:'power2.out' });
});

// theme toggle
const themeBtn = document.getElementById('themeToggle');
const themeKey = 'ak_theme';
function applyTheme(name){
  if(name === 'light'){ document.documentElement.style.setProperty('--bg','#f7fbff'); document.body.style.background = '#f7fbff'; }
  else { document.body.style.background = ''; }
}
const saved = localStorage.getItem(themeKey) || 'dark';
if(saved === 'light'){ document.body.classList.add('light-theme'); applyTheme('light'); themeBtn.textContent = '☀️'; themeBtn.setAttribute('aria-pressed','true'); }
themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');
  applyTheme(isLight ? 'light' : 'dark');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem(themeKey, isLight ? 'light' : 'dark');
});

// typing loop
const typedTextEl = document.getElementById('typedText');
const phrases = ['Math Teacher & .NET MAUI Developer', 'I build cross-platform apps', 'I design clean architecture'];
let tIndex=0;
function typeLoop(){
  const str = phrases[tIndex % phrases.length];
  typedTextEl.textContent = '';
  let i=0;
  const int = setInterval(()=> {
    typedTextEl.textContent += str[i++];
    if(i > str.length){ clearInterval(int); setTimeout(()=> { tIndex++; typeLoop(); }, 1400); }
  }, 28);
}
if(!prefersReduced) typeLoop();

// performance guard
if(isMobile || prefersReduced){
  if(streakCanvas) streakCanvas.style.display = 'none';
  document.querySelectorAll('[data-proj]').forEach(p => { p.style.transition = 'none'; });
}
