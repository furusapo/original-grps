(()=> {
  // Shared lightweight loading screen for every site page.
  try {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const style = document.createElement("style");
      style.textContent = `
        #grps-global-loading{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:#fff;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .5s ease,visibility .5s ease}
        html.grps-global-loading #grps-global-loading{opacity:1;visibility:visible;pointer-events:auto}
        #grps-global-loading .grps-loading-inner{display:grid;justify-items:center;gap:20px}
        #grps-global-loading .grps-loading-ring{width:42px;height:42px;border:1px solid #e3edf0;border-top-color:#20b6ca;border-right-color:#45d5a2;border-radius:50%;animation:grps-global-spin .9s linear infinite}
        #grps-global-loading .grps-loading-label{color:#91a6ae;font:500 9px/1 system-ui,sans-serif;letter-spacing:.32em}
        #grps-global-loading .grps-loading-line{width:112px;height:1px;background:#edf2f3;overflow:hidden}
        #grps-global-loading .grps-loading-line:after{content:"";display:block;width:38%;height:100%;background:linear-gradient(90deg,#249bf0,#16b8cb,#3cd59b);animation:grps-global-progress 1.15s ease-in-out infinite}
        @keyframes grps-global-spin{to{transform:rotate(360deg)}}
        @keyframes grps-global-progress{0%{transform:translateX(-110%)}100%{transform:translateX(290%)}}
      `;
      document.head.appendChild(style);
      const loader = document.createElement("div");
      loader.id = "grps-global-loading";
      loader.setAttribute("role","status");
      loader.setAttribute("aria-label","読み込み中");
      loader.innerHTML = '<div class="grps-loading-inner" aria-hidden="true"><span class="grps-loading-ring"></span><span class="grps-loading-label">LOADING</span><span class="grps-loading-line"></span></div>';
      document.documentElement.classList.add("grps-global-loading");
      document.body.appendChild(loader);
      const started = performance.now();
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        const delay = Math.max(0, 750 - (performance.now() - started));
        setTimeout(() => {
          document.documentElement.classList.remove("grps-global-loading");
          loader.remove();
          style.remove();
        }, delay);
      };
      window.addEventListener("load", finish, {once:true});
      setTimeout(finish, 5200);
      if (document.readyState === "complete") finish();
    }
  } catch (e) {
    document.documentElement.classList.remove("grps-global-loading");
  }

  const header = document.getElementById("grps-new-header");
  if (!header) return;

  const find = selector => header.querySelector(selector);
  const href = selector => find(selector)?.getAttribute("href") || "#";
  const links = {
    home: href(".gnh-brand"),
    service: href('.gnh-nav-inner a[href*="service/"]'),
    results: href('.gnh-nav-inner a[href*="results/"]'),
    recruit: href(".gnh-recruit"),
    company: href('.gnh-mobile-only[href*="company/"]:not([href*="#"])') || href('.gnh-links a[href*="company/"]'),
    access: href('.gnh-mobile-only[href*="#access"]'),
    privacy: href('.gnh-nav-inner a[href*="privacy/"]'),
    sitemap: href('.gnh-nav-inner a[href*="sitemap/"]'),
    contact: href(".gnh-contact")
  };
  const current = selector => find(selector)?.getAttribute("aria-current") === "page";
  const esc = value => String(value).replaceAll("&","&amp;").replaceAll('"',"&quot;");

  const top = header.querySelector(".gnh-top");
  let button = document.getElementById("menuOpen");
  if (!button) {
    button = document.createElement("button");
    button.id = "menuOpen";
    button.className = "gnh-mobile-menu-toggle";
    button.type = "button";
    button.setAttribute("aria-label","メニューを開く");
    button.setAttribute("aria-controls","sideMenu");
    button.setAttribute("aria-expanded","false");
    button.innerHTML = "<span></span><span></span><span></span>";
  }
  if (button.parentElement !== top) top.appendChild(button);

  if (!header.querySelector(".gnh-mobile-shortcuts")) {
    const shortcuts = document.createElement("nav");
    shortcuts.className = "gnh-mobile-shortcuts";
    shortcuts.setAttribute("aria-label","クイックリンク");
    shortcuts.innerHTML = [
      ["service","サービス",current('.gnh-nav-inner a[href*="service/"]')],
      ["results","実績",current('.gnh-nav-inner a[href*="results/"]')],
      ["recruit","採用",current(".gnh-recruit")],
      ["company","会社概要",current('.gnh-mobile-only[href*="company/"]:not([href*="#"])')]
    ].map(([key,label,active]) =>
      `<a href="${esc(links[key])}"${active?' aria-current="page"':""}>${label}</a>`
    ).join("");
    header.insertBefore(shortcuts,header.querySelector(".gnh-nav"));
  }

  let overlay = document.getElementById("menuOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "menuOverlay";
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }
  let menu = document.getElementById("sideMenu");
  if (!menu) {
    menu = document.createElement("aside");
    menu.id = "sideMenu";
    menu.className = "side-menu";
    document.body.appendChild(menu);
  }
  menu.setAttribute("aria-label","サイトメニュー");
  menu.setAttribute("aria-hidden","true");
  menu.setAttribute("inert","");

  const icon = {
    home:'<path d="m3 10 9-7 9 7M5.5 9v12h13V9M9.5 21v-7h5v7"/>',
    service:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 8h6M9 12h6M9 16h6"/>',
    results:'<path d="M4 20V12h4v8M10 20V7h4v13M16 20V3h4v17M3 21h18"/>',
    recruit:'<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.5-4 2.8-6 6.5-6s6 2 6.5 6M14 15c3.8-.5 6 1.2 6.5 4.5"/>',
    company:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>'
  };
  const row = (key,label) =>
    `<a href="${esc(links[key])}"><span class="gnh-mobile-menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icon[key]}</svg></span><span class="gnh-mobile-menu-label">${label}</span><span class="gnh-mobile-menu-chevron">›</span></a>`;

  const logo = find(".gnh-brand img");
  menu.innerHTML = `
    <div class="gnh-mobile-menu-content">
      <div class="gnh-mobile-menu-top">
        <img class="gnh-mobile-menu-logo" src="${esc(logo?.src || "")}" alt="グローパス">
        <button id="menuClose" class="menu-close" type="button" aria-label="メニューを閉じる">×</button>
      </div>
      <nav class="gnh-mobile-menu-links" aria-label="サイトメニュー">
        ${row("home","HOME")}
        ${row("service","サービス内容")}
        ${row("results","実績")}
        ${row("recruit","採用情報")}
        ${row("company","会社概要")}
      </nav>
      <div class="gnh-mobile-menu-actions">
        <a href="${esc(links.contact)}"><span aria-hidden="true">✉</span>お問い合わせ <span aria-hidden="true">›</span></a>
        <a href="${esc(links.recruit)}"><span aria-hidden="true">♧</span>採用情報 <span aria-hidden="true">↗</span></a>
      </div>
      <div class="gnh-mobile-menu-legal">
        <a href="${esc(links.access)}">アクセス</a>
        <a href="${esc(links.privacy)}">個人情報保護方針</a>
        <a href="${esc(links.sitemap)}">サイトマップ</a>
      </div>
    </div>`;

  const close = menu.querySelector("#menuClose");
  const toggle = open => {
    menu.classList.toggle("active",open);
    overlay.classList.toggle("active",open);
    menu.setAttribute("aria-hidden",String(!open));
    if ("inert" in menu) menu.inert = !open;
    button.setAttribute("aria-expanded",String(open));
    document.body.classList.toggle("menu-open",open);
    (open ? close : button).focus();
  };

  button.addEventListener("click",()=>toggle(true));
  close.addEventListener("click",()=>toggle(false));
  overlay.addEventListener("click",()=>toggle(false));
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggle(false)));
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape" && menu.classList.contains("active")) toggle(false);
  });
  // GRPS SHARED MOBILE FOOTER 20261023
  const pageFooter = document.querySelector("footer.grps-site-footer");
  if (pageFooter && !pageFooter.querySelector(".grps-mobile-footer")) {
    const mobileFooter = document.createElement("div");
    mobileFooter.className = "grps-mobile-footer";
    mobileFooter.innerHTML = `
      <div class="grps-mobile-footer-row">
        <img class="grps-mobile-footer-brand" alt="グローパス">
        <a class="grps-mobile-footer-top" href="#" aria-label="ページの先頭に戻る">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15l7-7 7 7"/>
          </svg>
        </a>
      </div>
      <p class="grps-mobile-footer-copy">© 2026 グローパス. All Rights Reserved.</p>`;
    const footerLogo = mobileFooter.querySelector(".grps-mobile-footer-brand");
    const headerLogo = find(".gnh-brand img");
    if (headerLogo?.src) footerLogo.src = headerLogo.src;
    pageFooter.appendChild(mobileFooter);
  }
  /* GRPS MOBILE COMMON FOOTER 20261023 */
  document.querySelectorAll("footer.grps-site-footer").forEach((pageFooter) => {
    if (pageFooter.querySelector(".grps-mobile-footer")) return;

    const mobileFooter = document.createElement("div");
    mobileFooter.className = "grps-mobile-footer";
    mobileFooter.innerHTML = `
      <div class="grps-mobile-footer-row">
        <img class="grps-mobile-footer-brand" alt="グローパス">
        <a class="grps-mobile-footer-top" href="#" aria-label="ページの先頭に戻る">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15l7-7 7 7"/>
          </svg>
        </a>
      </div>
      <p class="grps-mobile-footer-copy">© 2026 グローパス. All Rights Reserved.</p>`;

    const footerLogo = mobileFooter.querySelector(".grps-mobile-footer-brand");
    const headerLogo = document.querySelector("#grps-new-header .gnh-brand img");
    if (headerLogo?.src) footerLogo.src = headerLogo.src;
    pageFooter.appendChild(mobileFooter);
  });

})();
