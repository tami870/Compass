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

  // $(".js-hamburger").on("click", function () {
  //   $(this).toggleClass("is-active");
  //   $(".js-drawer").fadeToggle();
  // });

  // $('.js-drawer a[href^="#"]').on("click", function () {
  //   $(".js-hamburger").removeClass("is-active");
  //   $(".js-drawer").fadeOut();
  // });

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
