/* ==========================================================================
   MY BIKE — Hafif hareket katmanı (GSAP)
   - ScrollSmoother: yumuşak kaydırma (smooth: 0.9, dokunmatikte kapalı)
   - Açılışta hero girişi (bir kez)
   - Bölüm başlıklarında hafif belirme
   Hareket azaltma tercihi açıksa hiçbiri çalışmaz, sayfa olduğu gibi görünür.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.gsap) return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.9,
      smoothTouch: false,
      effects: true,
      normalizeScroll: false
    });

    // Sayfa içi bağlantılar (#randevu gibi) yumuşak kaydırmayla gitsin; sabit üst menü kadar boşluk bırak.
    const offset = () => (document.querySelector(".site-header") || { offsetHeight: 0 }).offsetHeight + 16;
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      document.body.classList.remove("menu-open");
      smoother.scrollTo(target.offsetTop - offset(), true);
      history.replaceState(null, "", url.hash);
    });
    if (location.hash) {
      const t = document.querySelector(location.hash);
      if (t) requestAnimationFrame(() => smoother.scrollTo(t.offsetTop - offset(), false));
    }

    // Hero girişi — görünür varsayılandan, üstel yavaşlamayla
    const hero = document.querySelector("[data-enter]");
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.1 } });
      tl.from(hero.querySelectorAll("[data-enter-item]"), { y: 28, opacity: 0, stagger: 0.08 })
        .from(hero.querySelectorAll("[data-enter-media]"), { opacity: 0, scale: 1.04, stagger: 0.1, duration: 1.4 }, 0);
    }

    // Bölüm başlıkları: tek seferlik, kısa ve sakin
    gsap.utils.toArray(".sec-head").forEach((el) => {
      gsap.from(el, {
        y: 18, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    // Yazı tipleri yüklenince ölçüleri tazele
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());

    return () => smoother.kill();
  });
})();
