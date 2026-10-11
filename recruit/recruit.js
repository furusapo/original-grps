"use strict";
// 現段階で採用ページ固有のJavaScriptは不要です。
// 動作が必要になったときだけ、ここに追加します。


// GRPS navigation
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".slide-menu");
  const close = document.querySelector(".menu-close");
  const backdrop = document.querySelector(".menu-backdrop");

  if (!toggle || !menu || !close || !backdrop) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "メニューを閉じる" : "メニューを開く"
    );
    backdrop.hidden = !open;
    document.body.classList.toggle("menu-open", open);

    if (open) close.focus();
    else toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(true));
  close.addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" &&
        menu.classList.contains("is-open")) {
      setOpen(false);
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
})();
