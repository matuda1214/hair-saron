'use strict';

/* ══ ページ切り替え ══ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  document.getElementById('nav-' + id)?.classList.add('active');
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(checkReveal, 80);
}

/* ══ ハンバーガー ══ */
function closeMenu() {
  document.getElementById('nav-hamburger')?.classList.remove('open');
  document.getElementById('nav-links-list')?.classList.remove('open');
}

/* ══ スクロールアニメーション ══ */
function checkReveal() {
  const vh = window.innerHeight;
  document.querySelectorAll('.js-reveal,.js-reveal-left,.js-lift').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.9 && r.bottom > 0) el.classList.add('in-view');
  });
}

/* ══ ヒーロースライドショー ══ */
let slideIndex = 0;
let slideTimer = null;

function goSlide(n) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slideIndex = (n + slides.length) % slides.length;
  slides[slideIndex]?.classList.add('active');
  dots[slideIndex]?.classList.add('active');
}

function startSlideshow() {
  slideTimer = setInterval(() => goSlide(slideIndex + 1), 5000);
}

/* ══ スタイリストカルーセル ══ */
(function initCarousel() {
  let startX = 0, isDragging = false, dragDelta = 0;
  let currentOffset = 0;

  function setup() {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    track.addEventListener('mousedown', e => {
      isDragging = true; startX = e.clientX; dragDelta = 0;
      track.classList.add('dragging');
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      dragDelta = e.clientX - startX;
      track.style.transform = `translateX(${currentOffset + dragDelta}px)`;
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      settle(dragDelta);
    });

    // タッチ
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX; dragDelta = 0;
    }, { passive: true });
    track.addEventListener('touchmove', e => {
      dragDelta = e.touches[0].clientX - startX;
      track.style.transform = `translateX(${currentOffset + dragDelta}px)`;
    }, { passive: true });
    track.addEventListener('touchend', () => settle(dragDelta));

    function settle(delta) {
      const cardW = 324; // card width 300 + gap 24
      const maxOffset = 0;
      const count = track.children.length;
      const minOffset = -(count - visibleCount()) * cardW;
      if (Math.abs(delta) > 40) {
        currentOffset += delta < 0 ? -cardW : cardW;
      }
      currentOffset = Math.min(maxOffset, Math.max(minOffset, currentOffset));
      track.style.transform = `translateX(${currentOffset}px)`;
      dragDelta = 0;
    }

    document.getElementById('c-prev')?.addEventListener('click', () => {
      settle(100);
    });
    document.getElementById('c-next')?.addEventListener('click', () => {
      settle(-100);
    });

    function visibleCount() {
      return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
    }
  }

  document.addEventListener('DOMContentLoaded', setup);
})();

/* ══ ギャラリーモーダル ══ */
const modalSVGs = {
  m1: `<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mg1" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#3a2e22"/><stop offset="100%" stop-color="#1e1810"/></radialGradient></defs><rect width="600" height="420" fill="url(#mg1)"/><ellipse cx="300" cy="150" rx="140" ry="168" fill="#2d2018" opacity=".9"/><path d="M168,172 C148,268 165,380 185,408 Q238,425 300,422 Q362,425 415,408 C435,380 452,268 432,172" fill="#150e08"/><path d="M188,166 C168,238 182,338 196,396" stroke="#C4A882" stroke-width="2" fill="none" opacity=".3"/><path d="M412,166 C432,238 418,338 404,396" stroke="#7A9E7E" stroke-width="2" fill="none" opacity=".28"/><ellipse cx="300" cy="145" rx="96" ry="112" fill="#281a0e" opacity=".95"/><ellipse cx="300" cy="130" rx="66" ry="78" fill="#C4A882" opacity=".14"/><text x="300" y="26" font-family="Cormorant Garamond,serif" font-size="18" fill="#FAF7F2" opacity=".5" text-anchor="middle" font-style="italic">Long Natural Style</text><text x="300" y="408" font-family="Jost,sans-serif" font-size="12" fill="#7A9E7E" opacity=".8" text-anchor="middle" letter-spacing="4">#ELEGANT  #LONG</text></svg>`,
  m2: `<svg viewBox="0 0 420 560" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mg2" cx="50%" cy="30%" r="60%"><stop offset="0%" stop-color="#28201a"/><stop offset="100%" stop-color="#141008"/></radialGradient></defs><rect width="420" height="560" fill="url(#mg2)"/><ellipse cx="210" cy="175" rx="105" ry="125" fill="#221808" opacity=".9"/><path d="M110,195 C90,298 102,432 122,495 Q160,515 210,513 Q260,515 298,495 C318,432 330,298 310,195" fill="#0e0908"/><path x="120,190 C102,262 110,362 116,478" stroke="#C4A882" stroke-width="2" fill="none" opacity=".3"/><path d="M300,190 C318,262 310,362 304,478" stroke="#C4A882" stroke-width="2" fill="none" opacity=".3"/><ellipse cx="210" cy="168" rx="72" ry="86" fill="#1c1008" opacity=".95"/><ellipse cx="210" cy="152" rx="50" ry="62" fill="#C4A882" opacity=".16"/><text x="210" y="28" font-family="Cormorant Garamond,serif" font-size="16" fill="#FAF7F2" opacity=".5" text-anchor="middle" font-style="italic">Wave Long Style</text><text x="210" y="544" font-family="Jost,sans-serif" font-size="11" fill="#C4A882" opacity=".8" text-anchor="middle" letter-spacing="3">#FEMININE  #WAVE</text></svg>`,
  m3: `<svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="480" fill="#141c18"/><ellipse cx="240" cy="175" rx="110" ry="128" fill="#182018" opacity=".9"/><path d="M138,195 C125,270 140,370 158,420 Q192,440 240,438 Q288,440 322,420 C340,370 355,270 342,195" fill="#0a140e"/><path d="M138,192 C125,145 138,98 162,68 Q196,32 240,34 Q284,32 318,68 C342,98 355,145 342,192" fill="#0e1a12"/><ellipse cx="240" cy="168" rx="76" ry="90" fill="#141e18" opacity=".9"/><ellipse cx="240" cy="150" rx="52" ry="64" fill="#7A9E7E" opacity=".14"/><text x="240" y="28" font-family="Cormorant Garamond,serif" font-size="16" fill="#FAF7F2" opacity=".5" text-anchor="middle" font-style="italic">Short Style</text><text x="240" y="462" font-family="Jost,sans-serif" font-size="11" fill="#7A9E7E" opacity=".8" text-anchor="middle" letter-spacing="3">#COOL  #SHORT</text></svg>`,
  m4: `<svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="480" fill="#1c1418"/><ellipse cx="240" cy="175" rx="115" ry="132" fill="#22101a" opacity=".9"/><path d="M135,198 C122,268 136,355 152,400 Q188,422 240,420 Q292,422 328,400 C344,355 358,268 345,198" fill="#120810"/><path d="M136,195 C120,255 133,308 130,368 Q128,400 130,418" stroke="#E8D5C4" stroke-width="2.5" fill="none" opacity=".28"/><path d="M344,195 C360,255 347,308 350,368 Q352,400 350,418" stroke="#E8D5C4" stroke-width="2.5" fill="none" opacity=".28"/><ellipse cx="240" cy="168" rx="78" ry="92" fill="#1c0e16" opacity=".9"/><ellipse cx="240" cy="150" rx="54" ry="66" fill="#C4A882" opacity=".14"/><text x="240" y="28" font-family="Cormorant Garamond,serif" font-size="16" fill="#FAF7F2" opacity=".5" text-anchor="middle" font-style="italic">Wave Bob Style</text><text x="240" y="462" font-family="Jost,sans-serif" font-size="11" fill="#C4A882" opacity=".8" text-anchor="middle" letter-spacing="3">#TRENDY  #BOB</text></svg>`,
  m5: `<svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="480" fill="#181c14"/><ellipse cx="240" cy="175" rx="112" ry="130" fill="#1c2218" opacity=".9"/><path d="M135,196 C122,268 136,362 154,405 Q188,425 240,423 Q292,425 326,405 C344,362 358,268 345,196" fill="#0e1408"/><path d="M136,192 C124,225 130,272 130,326 Q128,362 130,398" stroke="#7A9E7E" stroke-width="2" fill="none" opacity=".3"/><ellipse cx="240" cy="168" rx="76" ry="90" fill="#141e10" opacity=".9"/><ellipse cx="240" cy="150" rx="52" ry="64" fill="#7A9E7E" opacity=".15"/><text x="240" y="28" font-family="Cormorant Garamond,serif" font-size="16" fill="#FAF7F2" opacity=".5" text-anchor="middle" font-style="italic">Natural Bob Style</text><text x="240" y="462" font-family="Jost,sans-serif" font-size="11" fill="#7A9E7E" opacity=".8" text-anchor="middle" letter-spacing="3">#NATURAL  #BOB</text></svg>`
};

function openModal(id) {
  const modal = document.getElementById('gallery-modal');
  const content = document.getElementById('modal-content');
  if (modal && content && modalSVGs[id]) {
    content.innerHTML = modalSVGs[id];
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal() {
  document.getElementById('gallery-modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ══ 初期化 ══ */
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');

  // ハンバーガー
  const burger = document.getElementById('nav-hamburger');
  const list   = document.getElementById('nav-links-list');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    list?.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('nav')) closeMenu();
  });

  // スクロール
  window.addEventListener('scroll', () => {
    checkReveal();
    document.getElementById('main-nav')?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // スライドショー
  startSlideshow();

  // Escキーでモーダル閉じる
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  checkReveal();
});
