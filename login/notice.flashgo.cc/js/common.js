(function() {
  "use strict";
  
  var NOTICE_ENABLED = false;
  
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }
  
  function getMid() {
    var params = new URLSearchParams(window.location.search);
    return params.get("mid") || "1";
  }
  
  function getScriptParams() {
    var scripts = document.querySelectorAll('script[src*="common.js"]');
    if (scripts.length > 0) {
      try {
        return new URL(scripts[scripts.length - 1].src).searchParams;
      } catch (e) {
        return new URLSearchParams();
      }
    }
    return new URLSearchParams();
  }
  
  function shouldShowNotice() {
    if (!NOTICE_ENABLED) return false;
    var params = getScriptParams();
    return !(
      params.has("no_notice") ||
      params.has("noNotice") ||
      params.has("notice") === "0"
    );
  }
  
  function applySiteName(siteName) {
    if (!siteName) return;
    var suffix = " - " + siteName;
    if (!document.title.endsWith(suffix)) {
      document.title = document.title ? document.title + suffix : siteName;
    }
  }
  
  function closeNoticeModal() {
    var modal = document.getElementById("noticeModal");
    if (modal) modal.style.display = "none";
  }
  
  function openNoticeModal() {
    console.log("Notice: Notification modal would be shown here");
  }
  
  function applyTwtInfo(siteInfo) {
    if (!siteInfo || typeof siteInfo !== "object") return;
    if (window.__twt__config && siteInfo.sbs) {
      window.__twt__config.sbs = siteInfo.sbs;
      window.__twt__config.sbs_mm = siteInfo.sbs_mm;
      window.__twt__config.ranstr = siteInfo.ranstr;
    }
  }
  
  function getSiteInfo(mid) {
    return new Promise(function(resolve) {
      resolve({
        site_name: document.title || "我的网站",
        is_paid: true
      });
    });
  }
  
  ready(function() {
    var mid = getMid();
    var noticeEnabled = shouldShowNotice();
    
    if (!mid) {
      if (noticeEnabled) openNoticeModal();
      return;
    }
    
    getSiteInfo(mid).then(function(siteInfo) {
      applySiteName(siteInfo && siteInfo.site_name);
      if (noticeEnabled && (!siteInfo || siteInfo.is_paid !== true)) {
        openNoticeModal();
      }
      applyTwtInfo(siteInfo);
    });
  });
  
  window.closeNoticeModal = closeNoticeModal;
})();
