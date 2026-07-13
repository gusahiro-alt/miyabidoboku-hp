/* 下層ページ用 - シンプル */
gsap.registerPlugin(ScrollTrigger);

/* SVG filters injection (grunge/paint texture) */
(function injectFilters() {
  const svg = document.createElement('div');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <filter id="grungeFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="crossFilter" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="12" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>`;
  document.body.appendChild(svg);
})();

/* Header dropdown injection (共通nav拡張) */
(function injectDropdowns() {
  const dropdowns = {
    '雅土木について': [
      { href: './about.html#message', text: 'ご挨拶' },
      { href: './about.html#company', text: '会社概要' },
      { href: './about.html#safety', text: '安全への取り組み' },
    ],
    '事業案内': [
      { href: './business.html#foundation', text: '新築住宅基礎工事' },
      { href: './business.html#civil', text: '一般土木工事' },
      { href: './business.html#capability', text: '対応力' },
    ]
  };
  document.querySelectorAll('.nav__list > li > a').forEach((a) => {
    const label = a.textContent.trim();
    if (dropdowns[label]) {
      a.innerHTML = `${label} <span class="arrow">▼</span>`;
      const ul = document.createElement('ul');
      ul.className = 'nav__dropdown';
      dropdowns[label].forEach((it) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${it.href}">${it.text}</a>`;
        ul.appendChild(li);
      });
      a.parentElement.appendChild(ul);
    }
  });
})();

// Header scroll state
const header = document.getElementById('header');
ScrollTrigger.create({
  start: 'top -40',
  end: 99999,
  onUpdate: (self) => {
    if (self.scroll() > 40) header && header.classList.add('is-scrolled');
    else header && header.classList.remove('is-scrolled');
  }
});

// Page hero title — clip リビール（下から立ち上がり）
(function heroReveal() {
  const en = document.querySelector('.page-hero__en');
  if (en) {
    gsap.fromTo(en,
      { clipPath: 'inset(0 0 100% 0)', y: 20 },
      { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.3, ease: 'expo.out' });
  }
  gsap.from('.page-hero__ja, .crumbs', {
    y: 30, opacity: 0, duration: 1.0, delay: 0.35, stagger: 0.12, ease: 'power3.out'
  });
})();

// Common scroll fade for content sections
gsap.utils.toArray('.method-card, .biz-section, .timeline, .job, .benefit, .flow__step, .block-title, .form__row, .case-lead, .case-step__text, .case-single__text').forEach((el) => {
  gsap.from(el, {
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* ============================================
   PREMIUM ENHANCEMENTS (下層ページ)
   ============================================ */
const PA = window.MiyabiAnim;
if (PA) {
  // block-title の英字を clip リビール
  document.querySelectorAll('.block-title__en').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 100% 0)', y: 16 },
      {
        clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el.closest('.block-title'), start: 'top 85%' }
      });
  });

  // 事業案内の画像を clip ワイプ
  gsap.utils.toArray('.biz-section__img').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // 施工事例：工程写真の clip ワイプ（左右交互に方向を変えてダイナミックに）
  gsap.utils.toArray('.case-step').forEach((step) => {
    const img = step.querySelector('.case-step__img');
    if (!img) return;
    const rev = step.classList.contains('case-step--reverse');
    const from = rev ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
    gsap.set(img, { clipPath: from });
    gsap.to(img, {
      clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'expo.inOut',
      scrollTrigger: { trigger: step, start: 'top 82%' }
    });
    const inner = img.querySelector('img');
    if (inner) {
      gsap.fromTo(inner, { scale: 1.18 }, {
        scale: 1, duration: 1.5, ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 82%' }
      });
    }
  });

  // 施工事例②（土木）の縦写真 clip ワイプ
  gsap.utils.toArray('.case-single__img').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // 代表写真パララックス
  gsap.utils.toArray('.message__photo').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
}
