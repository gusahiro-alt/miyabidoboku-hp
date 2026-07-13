/* ============================================
   MIYABI DOBOKU — Premium Animation Engine
   全ページ共通。Lenis(慣性スクロール) + GSAP ScrollTrigger
   ============================================ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Lenis 慣性スムーズスクロール ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP ScrollTrigger と同期
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // アンカーリンクを Lenis 経由でスムーズに
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80, duration: 1.4 });
          }
        }
      });
    });
  }
  window.__lenis = lenis;

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 2. マスクリビール（下から現れる） ---------- */
  // .reveal を付けた要素は、内側がマスクで隠れた状態→スクロールで開く
  function wrapReveal(el) {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    gsap.set(el, { yPercent: 100, opacity: 0 });
    gsap.to(el, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el.closest('[data-reveal-trigger]') || el, start: 'top 88%' }
    });
  }

  /* ---------- 3. 行・語句スタッガー（見出し用） ---------- */
  function splitReveal(el, opts) {
    opts = opts || {};
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const nodes = [];
    // <br> 単位で行分割、なければ丸ごと1行
    const html = el.innerHTML;
    const lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    lines.forEach((lineHTML, i) => {
      const lineWrap = document.createElement('span');
      lineWrap.style.cssText = 'display:block;overflow:hidden;';
      const inner = document.createElement('span');
      inner.style.cssText = 'display:block;';
      inner.innerHTML = lineHTML;
      lineWrap.appendChild(inner);
      el.appendChild(lineWrap);
      nodes.push(inner);
    });
    gsap.set(nodes, { yPercent: 110 });
    gsap.to(nodes, {
      yPercent: 0,
      duration: opts.duration || 1.0,
      stagger: opts.stagger || 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: opts.start || 'top 85%' }
    });
  }

  /* ---------- 4. 画像パララックス＋リビール ---------- */
  // .parallax-media : 内側の画像/背景がスクロールでゆっくり動く
  function initParallax(el) {
    if (el.dataset.parallax) return;
    el.dataset.parallax = '1';
    const depth = parseFloat(el.dataset.depth || '0.15');
    gsap.fromTo(el,
      { y: () => -el.offsetHeight * depth },
      {
        y: () => el.offsetHeight * depth,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  /* ---------- 5. clip-path ワイプ登場（画像枠） ---------- */
  function clipReveal(el) {
    if (el.dataset.clip) return;
    el.dataset.clip = '1';
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.3,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  }

  /* ---------- 6. カスタムカーソル（スコップ・剣先が左上） ---------- */
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'm-cursor';
    const shovel = document.createElement('div');
    shovel.className = 'm-cursor__shovel';
    // スコップの線画アイコン（縦向き：握り→中央の柄→下の三角ブレード）
    shovel.innerHTML =
      '<svg viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" fill="none" ' +
        'stroke-linecap="round" stroke-linejoin="round">' +
        // grip（握り輪 / 上部）
        '<circle cx="16" cy="6" r="4"/>' +
        // shaft（柄 / 中央を縦に）
        '<path d="M16 10 L16 24"/>' +
        // blade（下向き三角ブレード）
        '<path d="M8 24 L24 24 L16 39 Z"/>' +
      '</svg>';
    cursor.appendChild(shovel);
    document.body.appendChild(cursor);

    // 即追従（遅延なし）。剣先(2,2)がマウス位置に来るよう translate。
    window.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    // ホバーで「掘る」ロックオン
    const hoverTargets = 'a, button, .bslide, .wcard, .biz-card, .method-card, .bdot, .works-filter__btn, .pill';
    document.querySelectorAll(hoverTargets).forEach((t) => {
      t.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      t.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
    document.body.classList.add('has-custom-cursor');
  }

  /* ---------- 7. マグネティックボタン ---------- */
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.pill, .recruit__btn, .promo-band__arrow, .news__arrow').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: mx * 0.25, y: my * 0.35, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- 8. 自動適用: 対象要素をマークして発火 ---------- */
  window.addEventListener('DOMContentLoaded', applyAll);
  if (document.readyState !== 'loading') applyAll();

  function applyAll() {
    // 見出し（英字大） → 語句リビール
    document.querySelectorAll('[data-anim="split"]').forEach((el) => splitReveal(el));
    // 画像枠 → clip ワイプ
    document.querySelectorAll('[data-anim="clip"]').forEach((el) => clipReveal(el));
    // パララックス
    document.querySelectorAll('[data-anim="parallax"]').forEach((el) => initParallax(el));
    // 汎用リビール
    document.querySelectorAll('[data-anim="reveal"]').forEach((el) => wrapReveal(el));
  }

  /* ---------- 9. スクロールプログレスバー ---------- */
  if (!prefersReduced) {
    const bar = document.createElement('div');
    bar.className = 'm-progress';
    document.body.appendChild(bar);
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; }
    });
  }

  /* ---------- 10. モバイル・ナビ・ドロワー ---------- */
  (function mobileNav() {
    const header = document.getElementById('header');
    const btn = document.querySelector('.header__menu');
    if (!btn) return;

    // ドロワーを生成（各ページのnav構成から流用）
    const links = [
      { href: './about.html', jp: '雅土木について', en: 'About' },
      { href: './business.html', jp: '事業案内', en: 'Business' },
      { href: './works.html', jp: '施工実績', en: 'Works' },
      { href: './csr.html', jp: 'CSR', en: 'CSR' },
      { href: './recruit.html', jp: '採用情報', en: 'Recruit' },
    ];
    const nav = document.createElement('nav');
    nav.className = 'mnav';
    const ul = document.createElement('ul');
    ul.className = 'mnav__list';
    links.forEach((l) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = l.href;
      a.innerHTML = `${l.jp} <span class="en">${l.en}</span>`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    const cta = document.createElement('div');
    cta.className = 'mnav__cta';
    cta.innerHTML =
      '<a class="tel" href="tel:0223763343">022-376-3343</a>' +
      '<a class="contact" href="./contact.html">お問い合わせ</a>';
    nav.appendChild(cta);
    document.body.appendChild(nav);

    function toggle(open) {
      const willOpen = open !== undefined ? open : !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      header && header.classList.toggle('is-menu-open', willOpen);
      if (lenis) { willOpen ? lenis.stop() : lenis.start(); }
      document.body.style.overflow = willOpen ? 'hidden' : '';
    }
    btn.addEventListener('click', () => toggle());
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  })();

  // 公開API（main.js から使えるように）
  window.MiyabiAnim = { splitReveal, clipReveal, initParallax, wrapReveal };
})();
