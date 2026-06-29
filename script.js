/* ============================================================
   ASANAGI hair design — script.js
   サイトの「動き」をまとめて制御します。
   1. ローディング演出
   2. ヘッダーのスクロール変化
   3. モバイルのドロワーメニュー
   4. スクロールで要素がふわっと現れる演出
   5. スタイル実績の絞り込みタブ
   6. モバイル追従の予約バー
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. ローディング演出
        読み込み完了後、少し置いてからフェードアウト
  ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-done'), 600);
  });
  // 万一 load が遅くても 2.5 秒で必ず開く保険
  setTimeout(() => loader.classList.add('is-done'), 2500);

  /* ----------------------------------------------------------
     2. ヘッダー:スクロールしたら背景を白くする
  ---------------------------------------------------------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ----------------------------------------------------------
     3. モバイルのドロワーメニュー
  ---------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const gnav = document.getElementById('gnav');

  const closeMenu = () => {
    gnav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = gnav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // メニュー内のリンクを押したら閉じる
  gnav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ----------------------------------------------------------
     4. スクロールで現れる演出(.reveal)
        IntersectionObserver で画面に入ったら表示。
        同じタイミングで入った要素は少しずつ遅らせて
        「さざ波」のように順番に現れます。
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const delay = Math.min(i * 120, 480); // 最大 0.48 秒まで段差をつける
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(el => io.observe(el));

  /* ----------------------------------------------------------
     5. スタイル実績の絞り込みタブ
  ---------------------------------------------------------- */
  const tabs = document.querySelectorAll('.works__tab');
  const items = document.querySelectorAll('.works__item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;

        if (show) {
          item.classList.remove('is-hidden');
          // 表示し直すときにふわっと出す
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     6. モバイル追従の予約バー
        ヒーローを通り過ぎたら表示し、
        ご予約セクションが見えている間は隠す
  ---------------------------------------------------------- */
  const fixedCta = document.getElementById('fixedCta');
  const reserveSection = document.getElementById('reserve');

  let reserveInView = false;
  const reserveIo = new IntersectionObserver((entries) => {
    reserveInView = entries[0].isIntersecting;
  }, { threshold: 0.2 });
  reserveIo.observe(reserveSection);

  const onScrollCta = () => {
    const passedHero = window.scrollY > window.innerHeight * 0.8;
    fixedCta.classList.toggle('is-visible', passedHero && !reserveInView);
  };
  window.addEventListener('scroll', onScrollCta, { passive: true });
  onScrollCta();

});
