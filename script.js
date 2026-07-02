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
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-done'), 600);
    });
    // 万一 load が遅くても 2.5 秒で必ず開く保険
    setTimeout(() => loader.classList.add('is-done'), 2500);
  }

  /* ----------------------------------------------------------
     2. ヘッダー:スクロールしたら背景を白くする
  ---------------------------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    const onScrollHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ----------------------------------------------------------
     3. モバイルのドロワーメニュー
  ---------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const gnav = document.getElementById('gnav');

  const closeMenu = () => {
    if (!gnav || !menuBtn) return;
    gnav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  };

  if (menuBtn && gnav) {
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
  }

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
        (ページにより要素が無い場合は安全に処理をスキップ)
  ---------------------------------------------------------- */
  const fixedCta = document.getElementById('fixedCta');
  const reserveSection = document.getElementById('reserve');

  if (fixedCta) {
    let reserveInView = false;
    if (reserveSection) {
      const reserveIo = new IntersectionObserver((entries) => {
        reserveInView = entries[0].isIntersecting;
      }, { threshold: 0.2 });
      reserveIo.observe(reserveSection);
    }

    // ヒーローがあるトップは通過後に表示、下層ページは常に表示
    const hero = document.querySelector('.hero');
    const onScrollCta = () => {
      const passedHero = hero ? window.scrollY > window.innerHeight * 0.8 : true;
      fixedCta.classList.toggle('is-visible', passedHero && !reserveInView);
    };
    window.addEventListener('scroll', onScrollCta, { passive: true });
    onScrollCta();
  }

  /* ----------------------------------------------------------
     7. ヒーローのスクロール連動アニメーション(トップのみ)
        ・文字とボタン:スクロールに合わせて薄れながら上へ流れて消える
        ・背景画像:ゆっくり追いかけるパララックスで奥行きを出す
        ・全体:少しずつ暗くなり、次のセクションへ視線を繋ぐ
        「動きを減らす」設定の方には適用しません。
  ---------------------------------------------------------- */
  const heroSection = document.querySelector('.hero');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroSection && !prefersReduce) {
    const heroImg     = heroSection.querySelector('.hero__img');
    const heroInner   = heroSection.querySelector('.hero__inner');
    const heroVert    = heroSection.querySelector('.hero__vertical');
    const heroScrollI = heroSection.querySelector('.hero__scroll');

    // 暗くなる幕を後から追加(HTMLはそのままでOK)
    const dim = document.createElement('div');
    dim.className = 'hero__dim';
    dim.setAttribute('aria-hidden', 'true');
    heroSection.appendChild(dim);

    let ticking = false;

    const update = () => {
      ticking = false;
      const h = heroSection.offsetHeight || window.innerHeight;
      // ヒーロー内をどれだけスクロールしたか(0〜1)
      const t = Math.min(Math.max(window.scrollY / (h * 0.85), 0), 1);

      // 文字・ボタン:薄れながら上へ(イージングを掛けてなめらかに)
      const fade = 1 - t;
      const rise = t * -60; // 最大60px上へ
      if (heroInner) {
        heroInner.style.opacity = String(fade * fade); // 二乗ですっと消える
        heroInner.style.transform = `translateY(${rise}px)`;
      }
      // 縦書きは少し遅れて消える
      if (heroVert) {
        heroVert.style.opacity = String(Math.max(1 - t * 1.4, 0));
        heroVert.style.transform = `translateY(${t * -30}px)`;
      }
      // Scroll表示は早めに消える
      if (heroScrollI) {
        heroScrollI.style.opacity = String(Math.max(1 - t * 2.5, 0));
      }
      // 背景:ゆっくり追いかけるパララックス+わずかに拡大
      if (heroImg) {
        heroImg.style.transform = `translateY(${t * h * 0.12}px) scale(${1 + t * 0.04})`;
      }
      // 全体をすこしずつ暗く
      dim.style.opacity = String(t * 0.55);
    };

    const onScrollHero = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScrollHero, { passive: true });
    window.addEventListener('resize', onScrollHero, { passive: true });
    update();
  }

  /* ----------------------------------------------------------
     8. ライトボックス(スタイル実績の写真だけ拡大表示)
        [data-lightbox] が付いた写真をタップすると、
        画面が暗くなり写真が大きく浮かび上がります。
  ---------------------------------------------------------- */
  const lbTriggers = document.querySelectorAll('[data-lightbox]');

  if (lbTriggers.length > 0) {
    // オーバーレイをJSで組み立て(HTMLはそのままでOK)
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<div class="lightbox__stage">' +
      '  <button type="button" class="lightbox__close" aria-label="閉じる">×</button>' +
      '  <div class="lightbox__photo"></div>' +
      '  <p class="lightbox__title"></p>' +
      '</div>';
    document.body.appendChild(lb);

    const lbPhoto = lb.querySelector('.lightbox__photo');
    const lbTitle = lb.querySelector('.lightbox__title');
    const lbClose = lb.querySelector('.lightbox__close');
    let lastFocus = null;

    const openLb = (trigger) => {
      lastFocus = trigger;
      // 中身をそのまま複製して拡大表示
      // (今はプレースホルダー、実画像<img>に差し替えても動きます)
      lbPhoto.innerHTML = '';
      const img = trigger.querySelector('img');
      if (img) {
        const big = img.cloneNode();
        lbPhoto.appendChild(big);
      } else {
        // 背景(グラデーション)ごと複製
        lbPhoto.style.background = getComputedStyle(trigger).background;
        lbPhoto.innerHTML = trigger.innerHTML;
      }
      lbTitle.textContent = trigger.dataset.title || '';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };

    const closeLb = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    lbTriggers.forEach(t => t.addEventListener('click', () => openLb(t)));
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLb(); // 外側タップで閉じる
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
    });
  }

  /* ----------------------------------------------------------
     9. ページ切り替えフェード
        サイト内リンクを押したら、ふわっと暗転してから移動。
        移動先ではCSSの pageIn でふわっと現れます。
        「動きを減らす」設定の方には適用しません。
  ---------------------------------------------------------- */
  if (!prefersReduce) {
    const veil = document.createElement('div');
    veil.className = 'page-veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href$=".html"]');
      if (!a) return;
      // 外部リンク・別タブは対象外
      if (a.target === '_blank' || a.origin !== location.origin) return;
      e.preventDefault();
      veil.classList.add('is-active');
      setTimeout(() => { location.href = a.href; }, 360);
    });

    // 戻るボタンで復帰したときに幕が残らないように
    window.addEventListener('pageshow', () => veil.classList.remove('is-active'));
  }

});
