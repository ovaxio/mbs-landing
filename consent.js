// ───── CONSENT MODE ─────
(function() {
  var COOKIE = 'mbs_consent';
  var EXPIRY = 365; // jours

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function applyConsent(granted) {
    var state = granted ? 'granted' : 'denied';
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'update', {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
  }

  window.setConsent = function(granted) {
    setCookie(COOKIE, granted ? '1' : '0', EXPIRY);
    applyConsent(granted);
    document.getElementById('consent-banner').classList.add('hidden');
  };

  var saved = getCookie(COOKIE);
  if (saved === null) {
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('consent-banner').classList.remove('hidden');
    });
  } else {
    applyConsent(saved === '1');
  }
})();
