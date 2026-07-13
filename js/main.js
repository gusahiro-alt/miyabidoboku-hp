/* ============================================
   MIYABI DOBOKU - Animations (Tada-inspired)
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* Header dropdown injection */
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

/* Split タイトルを1文字ずつspanに */
function splitTitleChars() {
  document.querySelectorAll('.hero__title-inner').forEach((el) => {
    const text = el.textContent;
    el.innerHTML = '';
    [...text].forEach((c) => {
      const span = document.createElement('span');
      span.className = 'hero__title-char';
      span.textContent = c;
      el.appendChild(span);
    });
  });
}
splitTitleChars();

/* Loader → Hero entrance (premium version) */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(loader, {
    opacity: 0, duration: 0.7, delay: 1.9,
    onComplete: () => loader.style.display = 'none'
  })
    // 青十字が筆で描かれるように伸びる（横→縦）
    .from('.hero__cross-h', {
      scaleX: 0, duration: 1.6, ease: 'expo.inOut',
      transformOrigin: 'left center'
    }, '-=0.3')
    .from('.hero__cross-v', {
      scaleY: 0, duration: 1.3, ease: 'expo.inOut',
      transformOrigin: 'top center'
    }, '-=1.4')
    // 大タイトルを1文字ずつスライドアップ (stagger with skew for dynamic feel)
    .from('.hero__title-char', {
      yPercent: 120,
      rotationZ: 6,
      duration: 1.1,
      stagger: 0.055,
      ease: 'power4.out'
    }, '-=1.2')
    .to('.hero__title-char', {
      y: '0%',
      duration: 0.01
    }, '<')
    // ローマ字下線がスワイプ
    .from('.hero__romaji span', {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.2, ease: 'power4.inOut'
    }, '-=0.9')
    .to('.hero__romaji', {
      opacity: 1, y: 0, duration: 0.6
    }, '<')
    // 人物写真がスライドイン（下から浮き上がり）
    .to('.hero__figure', {
      opacity: 1, y: 0, duration: 1.4, ease: 'expo.out',
      scale: 1, transformOrigin: 'bottom center'
    }, '-=1.8')
    // 縦書きタグライン（各行stagger with mask）
    .to('.hero__tagline', {
      opacity: 1, y: 0, duration: 0.6
    }, '-=0.9')
    .from('.hero__tagline span', {
      opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out'
    }, '-=0.5')
    // SCROLL指示 ペン先追従
    .from('.hero__scroll', {
      opacity: 0, y: 20, duration: 0.6
    }, '-=0.3');

});

/* Header scroll state */
const header = document.getElementById('header');
ScrollTrigger.create({
  start: 'top -40',
  end: 99999,
  onUpdate: (self) => {
    if (self.scroll() > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
});

/* Common fade-up on scroll */
const fadeItems = [
  '.about__lead-side', '.about__body',
  '.business__title', '.business__desc',
  '.works__head',
  '.company__head', '.company__body',
  '.contact__eyebrow', '.contact__title', '.contact__desc', '.contact__cta'
];
fadeItems.forEach((sel) => {
  gsap.utils.toArray(sel).forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
});

/* Stat counters */
gsap.utils.toArray('.stat__num').forEach((el) => {
  const target = parseInt(el.dataset.count, 10);
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    onUpdate: () => { el.textContent = Math.floor(obj.val); }
  });
});
gsap.from('.stat', {
  y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '.about__stats', start: 'top 85%' }
});

/* Business cards */
gsap.from('.bcard', {
  y: 60, opacity: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out',
  scrollTrigger: { trigger: '.business__cards', start: 'top 82%' }
});

/* Works cards */
gsap.from('.wcard', {
  y: 60, opacity: 0, duration: 1.0, stagger: 0.12, ease: 'power3.out',
  scrollTrigger: { trigger: '.works__grid', start: 'top 82%' }
});

/* Company table rows */
gsap.from('.company__table tr', {
  y: 20, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
  scrollTrigger: { trigger: '.company__table', start: 'top 82%' }
});

/* Recruit */
gsap.from('.recruit__eyebrow, .recruit__title, .recruit__desc, .recruit__btn', {
  y: 40, opacity: 0, duration: 1.0, stagger: 0.15, ease: 'power3.out',
  scrollTrigger: { trigger: '.recruit', start: 'top 75%' }
});

/* Team band reveal + parallax */
gsap.from('.team-band__overlay', {
  y: 30, opacity: 0, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.team-band', start: 'top 75%' }
});
gsap.to('.team-band__photo', {
  yPercent: 12, ease: 'none',
  scrollTrigger: {
    trigger: '.team-band', start: 'top bottom', end: 'bottom top', scrub: true
  }
});

/* Business card photos parallax on scroll */
gsap.utils.toArray('.bcard__photo').forEach((el) => {
  gsap.from(el, {
    scale: 1.15, duration: 1.4, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

/* Hero slider (多田風: 4秒毎に切替、1.8秒フェード) */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('is-active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('is-active');
  }, 4000);
})();

/* Business Slider (Tada-style: 4s auto-cycle, 1.4s fade) */
(function initBusinessSlider() {
  const slider = document.getElementById('businessSlider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.bslide');
  const dots = slider.querySelectorAll('.bdot');
  if (slides.length < 2) return;
  let idx = 0;
  let interval;

  function goTo(next) {
    slides[idx].classList.remove('is-active');
    dots[idx].classList.remove('is-active');
    idx = (next + slides.length) % slides.length;
    slides[idx].classList.add('is-active');
    // Restart dot progress animation
    dots[idx].classList.remove('is-active');
    void dots[idx].offsetWidth;
    dots[idx].classList.add('is-active');
  }
  function next() { goTo(idx + 1); }
  function start() { interval = setInterval(next, 4000); }
  function stop() { clearInterval(interval); }

  dots.forEach((d) => {
    d.addEventListener('click', () => {
      stop();
      goTo(parseInt(d.dataset.idx, 10));
      start();
    });
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  start();
})();

/* Blue cross 呼吸 (subtle scale pulse) — フィルター除去済みなので滑らか */
gsap.to('.hero__cross-h, .hero__cross-v', {
  scale: 1.025,
  duration: 3.5,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center'
});

/* Parallax on hero cross */
gsap.to('.hero__cross-h', {
  yPercent: 15, ease: 'none',
  scrollTrigger: {
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
  }
});
gsap.to('.hero__cross-v', {
  yPercent: -10, ease: 'none',
  scrollTrigger: {
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
  }
});
gsap.to('.hero__figure', {
  yPercent: 5, ease: 'none',
  scrollTrigger: {
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
  }
});

/* Business title 微パララックス */
gsap.utils.toArray('.section__title-en, .news__title-en, .business__title-en').forEach((el) => {
  gsap.to(el, {
    y: -12, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
  });
});

/* ============================================
   PREMIUM ENHANCEMENTS (MiyabiAnim連携)
   ============================================ */
const A = window.MiyabiAnim;
if (A) {
  /* 見出し（和文タイトル）を行マスクリビールに格上げ */
  ['.team-band__title', '.recruit__title'].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => A.splitReveal(el, { stagger: 0.14 }));
  });

  /* 施工事例カードの画像を clip ワイプ登場 */
  gsap.utils.toArray('.wcard__img').forEach((el, i) => {
    gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2, ease: 'expo.inOut', delay: (i % 2) * 0.12,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* 施工事例カード内画像に微パララックス（枠固定・中身ズーム移動） */
  gsap.utils.toArray('.wcard').forEach((card) => {
    const img = card.querySelector('.wcard__img');
    if (!img) return;
    gsap.fromTo(img, { backgroundPosition: '50% 45%' }, {
      backgroundPosition: '50% 55%', ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Promo band 写真パララックス */
  gsap.utils.toArray('.promo-band__photo').forEach((el) => {
    gsap.fromTo(el, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: el.closest('.promo-band'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

/* 数字カウンター（stat）を強調イージングに */
gsap.utils.toArray('.stat').forEach((stat) => {
  gsap.fromTo(stat, { y: 40, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
    scrollTrigger: { trigger: stat, start: 'top 90%' }
  });
});
