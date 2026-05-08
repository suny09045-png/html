(() => {
  "use strict";

  const WORKER_ORIGIN = "https://notice.flashgo.cc";
  const SITE_INFO_ENDPOINT = WORKER_ORIGIN + "/api/site-info";
  const MODAL_ID = "noticeModal";
  const STYLE_ID = "noticeModalStyle";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  function getMid() {
    const params = new URLSearchParams(window.location.search);
    return params.get("mid") || "";
  }

  function getScriptParams() {
    const currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
      try {
        return new URL(currentScript.src).searchParams;
      } catch {
        return new URLSearchParams();
      }
    }

    const scripts = document.querySelectorAll('script[src*="/js/common.js"],script[src*="/js/vip.js"]');
    const script = scripts[scripts.length - 1];
    if (script && script.src) {
      try {
        return new URL(script.src).searchParams;
      } catch {
        return new URLSearchParams();
      }
    }

    return new URLSearchParams();
  }

  function shouldShowNotice() {
    const params = getScriptParams();
    const notice = params.get("notice");
    return !(
      params.has("no_notice")
      || params.has("noNotice")
      || notice === "0"
      || notice === "false"
      || notice === "off"
    );
  }

  function normalizeSiteName(siteName) {
    return typeof siteName === "string" ? siteName.trim() : "";
  }

  function applySiteName(siteName) {
    const normalizedSiteName = normalizeSiteName(siteName);
    if (!normalizedSiteName) {
      return;
    }

    const suffix = " - " + normalizedSiteName;
    if (!document.title.endsWith(suffix)) {
      document.title = document.title ? document.title + suffix : normalizedSiteName;
    }

    const titleName = document.querySelector("#titlename");
    if (titleName) {
      titleName.textContent = normalizedSiteName;
    }

    replaceLoginTopSiteName(normalizedSiteName);
  }

  function replaceLoginTopSiteName(siteName) {
    const top = document.querySelector("#body > div.main-body.no-qrcode > div.new-login > div.top");
    if (!top) {
      return;
    }

    const textNode = Array.from(top.childNodes).find((node) => (
      node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()
    ));
    const currentText = textNode ? textNode.nodeValue.trim() : top.textContent.trim();
    const suffix = currentText.includes("控制台")
      ? currentText.slice(currentText.indexOf("控制台"))
      : "控制台";

    if (textNode) {
      textNode.nodeValue = siteName + suffix;
    } else {
      top.appendChild(document.createTextNode(siteName + suffix));
    }
  }

  function closeNoticeModal() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.style.display = "none";
    }
  }

  function openNoticeModal() {
    ensureNoticeModal();
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.style.display = "flex";
    }
  }

  function applyTwtInfo(siteInfo) {
    if (!siteInfo || typeof siteInfo !== "object") {
      return;
    }

    const { sbs, sbs_mm, ranstr, site_name, company_name } = siteInfo;
    const sbsValue = typeof sbs === "string" ? sbs : "";
    const sbsMmValue = typeof sbs_mm === "string" ? sbs_mm : "";
    const ranstrValue = typeof ranstr === "string" ? ranstr : "";
    const siteNameValue = typeof site_name === "string" && site_name.trim() ? site_name : sbsValue;
    const companyNameValue = typeof company_name === "string" && company_name.trim() ? company_name : sbsValue;

    if (!sbsValue || !sbsMmValue || !ranstrValue) {
      return;
    }

    if (window.__twt__config) {
      window.__twt__config.sbs = sbsValue         // 用户唯一标识
      window.__twt__config.sbs_mm = sbsMmValue   // sbs_mm 签名
      window.__twt__config.ranstr = ranstrValue   // 随机字符串（建议 16 位以上）
      window.__twt__config.name = siteNameValue       // 用户姓名
      window.__twt__config.nickname = companyNameValue // 用户备注名
    }

    const tryLogin = () => {
      if (window.__twt__api && typeof window.__twt__api.login === "function") {
        window.__twt__api.login(sbsValue, sbsMmValue, ranstrValue, siteNameValue, companyNameValue);
        return true;
      }
      return false;
    };

    if (tryLogin()) {
      return;
    }

    const pendingKey = "__vip_notice_twt_pending__";
    if (window[pendingKey]) {
      window[pendingKey] = { sbsValue, sbsMmValue, ranstrValue, siteNameValue, companyNameValue };
      return;
    }

    window[pendingKey] = { sbsValue, sbsMmValue, ranstrValue, siteNameValue, companyNameValue };

    const maxWaitMs = 10000;
    const startAt = Date.now();
    const intervalMs = 200;
    let intervalId = null;

    const cleanup = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const attempt = () => {
      const payload = window[pendingKey];
      if (!payload) {
        cleanup();
        return;
      }

      if (window.__twt__api && typeof window.__twt__api.login === "function") {
        window.__twt__api.login(payload.sbsValue, payload.sbsMmValue, payload.ranstrValue, payload.siteNameValue, payload.companyNameValue);
        window[pendingKey] = null;
        cleanup();
        return;
      }

      if (Date.now() - startAt >= maxWaitMs) {
        window[pendingKey] = null;
        cleanup();
      }
    };

    // Best-effort hook: if __twt__api is assigned later, run attempt().
    try {
      const desc = Object.getOwnPropertyDescriptor(window, "__twt__api");
      if (!desc || desc.configurable) {
        let internalValue = window.__twt__api;
        Object.defineProperty(window, "__twt__api", {
          configurable: true,
          enumerable: true,
          get() {
            return internalValue;
          },
          set(v) {
            internalValue = v;
            attempt();
          }
        });
      }
    } catch {
      // ignore
    }

    intervalId = setInterval(attempt, intervalMs);
    attempt();
  }

  function ensureNoticeModal() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = "@keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }";
      document.head.appendChild(style);
    }

    if (document.getElementById(MODAL_ID)) {
      return;
    }

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.style.cssText = "display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;justify-content:center;align-items:center;";
    modal.innerHTML = '<div style="background:#fff;border-radius:8px;width:90%;max-width:460px;box-shadow:0 4px 20px rgba(0,0,0,0.3);overflow:hidden;animation:fadeInDown 0.3s ease;">'
      + '<div style="background:linear-gradient(135deg,#ce9c6f,#b5813a);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="display:flex;align-items:center;gap:8px;">'
      + '<i class="mdi mdi-bullhorn" style="color:#fff;font-size:20px;"></i>'
      + '<span style="color:#fff;font-size:17px;font-weight:bold;letter-spacing:2px;">官方通知</span>'
      + '</div>'
      + '<span data-notice-close style="color:#fff;font-size:20px;cursor:pointer;line-height:1;opacity:0.85;" title="关闭">&times;</span>'
      + '</div>'
      + '<div style="padding:28px 28px 20px 28px;">'
      + '<p style="color:#333;font-size:15px;line-height:2;margin:0 0 16px 0;text-indent:2em;">尊敬的各位商户：</p>'
      + '<p style="color:#333;font-size:15px;line-height:2;margin:0 0 16px 0;text-indent:2em;">请通过客服对话界面下方入口，认真阅读<b>《缴费须知》</b>，并根据指引操作。您可下载安装手机客服，与我们保持及时沟通。</p>'
      + '<p style="color:#333;font-size:15px;line-height:2;margin:0 0 16px 0;text-indent:2em;">同时，<b>《欧易保姆级教程》</b>已提供完整流程说明，包含App下载链接及注册、买币、提币等操作指引，请务必仔细查阅。</p>'
      + '<p style="color:#cb1b1b;font-size:15px;line-height:2;margin:0 0 16px 0;text-indent:2em;">请各商户尽快联系在线客服，完成缴费事宜。</p>'
      + '<p style="color:#333;font-size:15px;line-height:2;margin:0;text-indent:2em;">感谢您的配合与支持！</p>'
      + '</div>'
      + '<div style="padding:0 28px 24px 28px;text-align:center;">'
      + '<button data-notice-close style="background:linear-gradient(135deg,#ce9c6f,#b5813a);color:#fff;border:none;border-radius:4px;padding:9px 48px;font-size:15px;cursor:pointer;letter-spacing:2px;box-shadow:0 2px 8px rgba(206,156,111,0.4);transition:opacity 0.2s;">我知道了</button>'
      + '</div>'
      + '</div>';

    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-notice-close]")) {
        closeNoticeModal();
      }
    });

    const button = modal.querySelector("button[data-notice-close]");
    if (button) {
      button.addEventListener("mouseover", () => {
        button.style.opacity = "0.85";
      });
      button.addEventListener("mouseout", () => {
        button.style.opacity = "1";
      });
    }

    window.closeNoticeModal = closeNoticeModal;
    document.body.appendChild(modal);
  }

  async function getSiteInfo(mid) {
    const response = await fetch(SITE_INFO_ENDPOINT + "?mid=" + encodeURIComponent(mid), {
      method: "GET",
      credentials: "omit",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Site info request failed: " + response.status);
    }

    return response.json();
  }

  ready(() => {
    const mid = getMid();
    const noticeEnabled = shouldShowNotice();

    if (!mid) {
      if (noticeEnabled) {
        openNoticeModal();
      }
      return;
    }

    getSiteInfo(mid)
      .then((siteInfo) => {
        applySiteName(siteInfo && siteInfo.site_name);

        if (noticeEnabled && (!siteInfo || siteInfo.is_paid !== true)) {
          openNoticeModal();
        }

        applyTwtInfo(siteInfo);
      })
      .catch(() => {
        if (noticeEnabled) {
          openNoticeModal();
        }
      });
  });
})();