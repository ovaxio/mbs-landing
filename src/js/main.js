// MBS — JS unique du site. Testé indirectement via build.test.js (présence, intégrité).
// Règles : zéro inline JS, tout passe par addEventListener / attributs data-*.
(function () {
  "use strict";

  // ───── TRACKING CTA (data-track / data-track-props, remplace les onclick inline) ─────
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (typeof window.umami === "undefined") return;
      var name = el.getAttribute("data-track") || "cta_click";
      var props = {};
      try {
        props = JSON.parse(el.getAttribute("data-track-props") || "{}");
      } catch (e) {
        props = {};
      }
      window.umami.track(name, props);
    });
  });

  // ───── SCROLL REVEAL ─────
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ───── FAQ ACCORDION ─────
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = this.closest(".faq-item");
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (el) {
        el.classList.remove("open");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ───── STICKY MOBILE CTA ─────
  var stickyCta = document.getElementById("sticky-cta");
  var hero = document.getElementById("hero");
  if (stickyCta && hero && "IntersectionObserver" in window) {
    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stickyCta.classList.remove("visible");
        } else {
          stickyCta.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });
    stickyObserver.observe(hero);
  }

  // ───── FORMULAIRE RÉTRACTATION (Netlify Forms + D221-5) ─────
  // Libellés imposés : point d'entrée « Renoncer au contrat ici » (dans la page),
  // bouton de confirmation « Confirmer la rétractation », accusé de réception
  // horodaté sur support durable (téléchargement .txt).
  var retractForm = document.querySelector('form[name="retractation"]');
  if (retractForm) {
    retractForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = retractForm.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      var sentAt = new Date();
      var data = new FormData(retractForm);
      var body = new URLSearchParams(data).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      })
        .catch(function () {
          // En local / hors Netlify : la demande est conservée via l'accusé téléchargeable.
          return null;
        })
        .then(function () {
          var pad = function (n) {
            return String(n).padStart(2, "0");
          };
          var dateStr =
            pad(sentAt.getDate()) + "/" + pad(sentAt.getMonth() + 1) + "/" + sentAt.getFullYear();
          var timeStr = pad(sentAt.getHours()) + ":" + pad(sentAt.getMinutes());
          var receipt =
            "ACCUSÉ DE RÉCEPTION — DÉCLARATION DE RÉTRACTATION\n" +
            "Mon Budget Simple / Codeblend EURL\n\n" +
            "Nom : " + (data.get("nom") || "") + "\n" +
            "Prénom : " + (data.get("prenom") || "") + "\n" +
            "Email : " + (data.get("email") || "") + "\n" +
            "Produit concerné : " + (data.get("produit") || "") + "\n" +
            "Numéro de commande : " + (data.get("numero_commande") || "(non renseigné)") + "\n\n" +
            "Je notifie par la présente ma rétractation du contrat portant sur le produit mentionné ci-dessus.\n\n" +
            "Date d'envoi de la déclaration : " + dateStr + " à " + timeStr + "\n" +
            "Référence : rétractation en ligne (art. L221-21 du code de la consommation)\n";

          var box = document.getElementById("receipt-box");
          if (box) box.textContent = receipt;

          var success = document.getElementById("form-success");
          if (success) success.classList.add("visible");
          retractForm.style.display = "none";

          var dl = document.getElementById("receipt-download");
          if (dl) {
            dl.addEventListener("click", function () {
              var blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
              var url = URL.createObjectURL(blob);
              var a = document.createElement("a");
              a.href = url;
              a.download = "accuse-reception-retractation-" + Date.now() + ".txt";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            });
          }
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  // ───── OPPOSITION MESURE D'AUDIENCE (Umami, droit d'opposition effectif) ─────
  var optoutBtn = document.getElementById("umami-optout");
  if (optoutBtn) {
    optoutBtn.addEventListener("click", function () {
      try {
        localStorage.setItem("umami.disabled", "y");
      } catch (err) {
        // stockage indisponible : l'opposition reste signalée visuellement
      }
      var confirmEl = document.getElementById("umami-optout-confirm");
      if (confirmEl) confirmEl.style.display = "block";
      optoutBtn.disabled = true;
    });
  }

  // ───── ROUTING CONFIRMATION + EVENT PURCHASE ─────
  // window.__MBS_CHECKOUT__ est injecté au build depuis products[] (site.json).
  var cfg = window.__MBS_CHECKOUT__;
  var titleEl = document.getElementById("confirmation-title");
  if (cfg && titleEl) {
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("product") || "";
    var sessionId = params.get("session_id") || "";
    var product = cfg.products[productId];
    var podiaLink = (product && product.podia) || "https://www.monbudgetsimple.fr";

    if (product && product.name) {
      titleEl.textContent = "Merci pour ton achat du " + product.name + " !";
    }

    var linkEl = document.getElementById("podia-link");
    if (linkEl) linkEl.href = podiaLink;

    // Garde session_id : filtre les visites directes sans achat (anti faux positifs)
    if (product && sessionId && typeof window.umami !== "undefined") {
      window.umami.track("purchase", {
        product: productId,
        revenue: product.price,
        currency: "EUR",
        session_id: sessionId,
      });
    }
  }
})();
