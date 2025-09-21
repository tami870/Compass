gsap.registerPlugin(ScrollTrigger);

jQuery(function ($) {
  // ===============================
  // 1) ヘッダー高さ → CSS変数へ同期
  // ===============================

  const headerEl = document.querySelector(".js-header");
  const setHeaderVar = () => {
    const h = headerEl ? headerEl.offsetHeight : 0;
    document.documentElement.style.setProperty("--header-height", `${h}px`);
  };
  setHeaderVar();

  if (window.ResizeObserver && headerEl) {
    const ro = new ResizeObserver(setHeaderVar);
    ro.observe(headerEl);
  } else {
    $(window).on("resize", setHeaderVar);
  }

  // ===============================
  // 2) ハンバーガー開閉 & ドロワー
  // ===============================

  $(".js-hamburger").on("click", function () {
    $(this).toggleClass("is-active");
    $(".js-drawer").toggleClass("is-open");
  });

  $('.js-drawer a[href^="#"]').on("click", function () {
    $(".js-hamburger").removeClass("is-active");
    $(".js-drawer").removeClass("is-open");
  });

  // ===============================
  // 3) 直リンク(#hash)・履歴移動にも確実に効かせる保険
  // ===============================

  const scrollToHash = () => {
    if (!location.hash) return;
    const t = document.querySelector(decodeURIComponent(location.hash));
    if (t) t.scrollIntoView({ block: "start" });
  };
  $(window).on("load", () => {
    setHeaderVar();
    scrollToHash();
  });
  $(window).on("hashchange", scrollToHash);

  // ===============================
  // 4) ページトップボタン
  // ===============================

  const $pageTop = $(".js-page-top");
  $pageTop.hide();

  $(window).on("scroll", function () {
    $(this).scrollTop() > 50 ? $pageTop.fadeIn() : $pageTop.fadeOut();
  });

  $pageTop.on("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return false;
  });

  // ===============================
  // 5) GSAPアニメーション
  // ===============================

  // 【heroセクション】
  // モデルとボタンはふわっと表示（ボタンはモバイル版のみ実装）
  gsap.from(".hero__image", {
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power2.out",
  });

  gsap.from(".hero__badge", {
    scale: 0.8,
    opacity: 0,
    stagger: 0.2,
    duration: 0.6,
    delay: 0.6,
  });

  gsap.matchMedia().add("(max-width: 767px)", () => {
    gsap.from(".hero__cta", {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      delay: 0.6,
      ease: "back.out(1.7)",
    });
  });

  // 【problemセクション】
  // 基本は下からフェードイン、テキストはふわっと表示
  gsap.from(".problem__heading", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".problem",
      start: "top 80%",
      once: true,
    },
  });

  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      gsap.utils.toArray(".problem__item").forEach((card, i) => {
        gsap.from(card, {
          x: i < 2 ? -100 : 100, // デスクトップ版は偶数枚目→左から、奇数枚目→右からフェードイン
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    },

    "(max-width: 767px)": function () {
      gsap.utils.toArray(".problem__item").forEach((card) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        });
      });
    },
  });
  gsap.from(".problem__solution-text", {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    scrollTrigger: {
      trigger: ".problem__solution",
      start: "top 90%",
      once: true,
    },
  });

  // 【contact-info（中段）セクション】
  // 下からフェードイン
  gsap.from(".contact-cta__info", {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-cta__info",
      start: "top 90%",
      once: true,
    },
  });

  gsap.from([".contact-cta__tel-number", ".contact-cta__tel-icon"], {
    scale: 0.95,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".contact-cta__info",
      start: "top 90%",
      once: true,
    },
  });

  gsap.from(".contact-cta__button", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-cta__info",
      start: "top 90%",
      once: true,
    },
  });

  // 【featureカード】
  // デスクトップ版のみ左右フェードイン、モバイル版は下からフェードイン
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      gsap.utils.toArray(".feature__card").forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -80 : 80, // 偶数は左から、奇数は右からフェードイン
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    },

    "(max-width: 767px)": function () {
      // ★修正: forEach に変更してSPも1枚ずつ出す
      gsap.utils.toArray(".feature__card").forEach((card) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
  });

  // 【expectationカード、voiceカード】
  // 下からフェードイン
  [".expectation", ".voice"].forEach((section) => {
    ScrollTrigger.batch(
      section + " .expectation__card, " + section + " .voice__card",
      {
        start: "top 90%",
        onEnter: (batch) => {
          gsap.from(batch, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power1.out",
            stagger: 0.2,
          });
        },
        once: true,
      }
    );
  });

  // 【実績を数字で見せるカード】
  // 数字がフェードインしたら、一度だけshineエフェクト
  window.addEventListener("load", () => {
    const counters = document.querySelectorAll(".management-stats__number");

    counters.forEach((el) => {
      el.style.display = "inline-block";
      el.style.textAlign = "right";
      const raw = el.dataset.target ?? el.textContent.replace(/,/g, "");
      el.style.minWidth = String(raw).length + "ch";
      el.style.fontVariantNumeric = "tabular-nums";
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".management-services__stats",
        start: "top 80%",
        once: true, // 1回だけ
      },
    });

    counters.forEach((el) => {
      tl.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          onStart() {
            const endText = el.dataset.target ?? el.textContent;
            el.textContent = Number(endText).toLocaleString();
          },
        },
        0
      );

      // フェードイン直後にshineエフェクト（1回だけ）
      tl.fromTo(
        el,
        { "--shine-x": "-150%", "--shine-opacity": 1 },
        {
          "--shine-x": "150%",
          "--shine-opacity": 0,
          duration: 3.0,
          ease: "power2.inOut",
          onStart: () => el.style.setProperty("--shine-opacity", 1),
          onComplete: () => el.style.setProperty("--shine-opacity", 0),
        },
        ">-0.2"
      );
    });

    ScrollTrigger.refresh();
  });

  // ===============================
  // 6) バリデーション
  // ===============================

  const form = document.querySelector(".contact-form__form-area");

  if (!form) return;

  const requiredFields = form.querySelectorAll(
    "input[required], textarea[required], select[required]"
  );
  const submitButton = form.querySelector('button[type="submit"]');

  // 送信時に未入力を目立たせる
  form.addEventListener("submit", function (e) {
    const invalidEl = form.querySelector(":invalid");
    if (invalidEl) {
      e.preventDefault();
      invalidEl.focus();
      invalidEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // フィールドに data-touched 属性をつける
  form.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("blur", () => {
      el.setAttribute("data-touched", "true");
      checkFormValidity(); // 状態を即時更新
    });

    el.addEventListener("input", checkFormValidity);
  });

  // メールアドレス形式チェック（強化）
  const emailInput = form.querySelector('input[type="email"]');
  emailInput.addEventListener("blur", function () {
    const email = emailInput.value.trim();
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      emailInput.setCustomValidity("メールアドレスを入力してください");
    } else if (!emailFormat.test(email)) {
      emailInput.setCustomValidity("メールアドレスの形式が正しくありません");
    } else {
      emailInput.setCustomValidity("");
    }

    checkFormValidity();
  });

  // フォーム全体のバリデーション状態をチェック
  function checkFormValidity() {
    const allValid = Array.from(requiredFields).every((el) => {
      return el.dataset.touched && el.checkValidity();
    });

    if (submitButton) {
      submitButton.disabled = !allValid;
    }
  }
});
