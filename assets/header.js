document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#gp-unified-header").forEach(function (header) {
    const main = header.querySelector(".service-copy-header-main");
    const nav = header.querySelector(".service-copy-nav");
    const navInner = header.querySelector(".service-copy-nav-inner");
    const links = header.querySelector(".service-copy-links");

    if (!main || !nav || !navInner) return;

    if (!main.querySelector(".gp-mobile-menu-button")) {
      const button = document.createElement("button");
      button.className = "gp-mobile-menu-button";
      button.type = "button";
      button.setAttribute("aria-label", "メニューを開く");
      button.setAttribute("aria-expanded", "false");
      button.innerHTML =
        "<span></span><span></span><span></span>";

      main.appendChild(button);

      button.addEventListener("click", function () {
        const open = header.classList.toggle("gp-menu-open");

        button.setAttribute("aria-expanded", String(open));
        button.setAttribute(
          "aria-label",
          open ? "メニューを閉じる" : "メニューを開く"
        );
      });
    }

    /* 上段にある会社概要・アクセス・お問い合わせを
       スマホメニュー末尾にも追加 */
    if (links && !navInner.querySelector(".gp-mobile-extra")) {
      links.querySelectorAll("a").forEach(function (link) {
        const clone = link.cloneNode(true);
        clone.classList.remove("service-copy-contact");
        clone.classList.add("gp-mobile-extra");
        navInner.appendChild(clone);
      });
    }

    /* メニュー項目を押したら閉じる */
    navInner.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("gp-menu-open");

        const button =
          main.querySelector(".gp-mobile-menu-button");

        if (button) {
          button.setAttribute("aria-expanded", "false");
          button.setAttribute("aria-label", "メニューを開く");
        }
      });
    });

    /* PC幅へ戻ったら開閉状態をリセット */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        header.classList.remove("gp-menu-open");
      }
    });
  });
});
