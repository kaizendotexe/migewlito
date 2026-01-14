
$(function() {
    "use strict";

    try {
        var path = (window.location && window.location.pathname) ? window.location.pathname : "";
        var isNested = path.indexOf("/games/") !== -1 || path.indexOf("/promo-detail/") !== -1;
        var prefix = isNested ? "../" : "";

        try {
            var currentAccent = (window.getComputedStyle ? getComputedStyle(document.documentElement).getPropertyValue("--warna_3") : "").trim();
            if (currentAccent === "#ffbd2b" || currentAccent === "rgb(255, 189, 43)" || currentAccent === "") {
                document.documentElement.style.setProperty("--warna_3", "#54CCC4");
                document.documentElement.style.setProperty("--warna_hover", "#44BDB5");
                document.documentElement.style.setProperty("--warna_border_1", "#86E6DF");
                document.documentElement.style.setProperty("--warna_border_2", "#1C5C9C");
                document.documentElement.style.setProperty("--warna_border_3", "#042434");
            }
        } catch (e) {}

        try {
            var icon = document.querySelector('link[rel="shortcut icon"], link[rel="icon"]');
            if (icon) icon.setAttribute("href", prefix + "assets/images/logo.png");
        } catch (e) {}

        try {
            var style = document.createElement("style");
            style.textContent = [
                ".radio-nominale:hover+label,.radio-nominale:checked+label{box-shadow:0 0 0 3px var(--warna_3) !important}",
                ".migewlito-sep{font-weight:700;color:rgba(255,255,255,0.28);letter-spacing:1px;line-height:1;margin:14px 0;user-select:none}",
            ].join("");
            document.head.appendChild(style);
        } catch (e) {}

        var brand = document.querySelector(".navbar .navbar-brand");
        if (brand) {
            brand.setAttribute("href", prefix + "index.html");
            var brandImg = brand.querySelector("img");
            if (brandImg) {
                brandImg.setAttribute("src", prefix + "assets/images/banner1.png");
                brandImg.setAttribute("alt", "Logo Migewlito");
            }
        }

        var navLinks = document.querySelectorAll(".navbar a[href]");
        navLinks.forEach(function (a) {
            var href = a.getAttribute("href");
            if (!href) return;

            if (href.indexOf("https://gogogo.com/en-ph") === 0 || href.indexOf("http://gogogo.com/en-ph") === 0) {
                var local = href.replace(/^https?:\/\/gogogo\.com\/en-ph\/?/, "");
                if (!local) local = "index.html";
                if (local === "payment") local = "payment.html";
                if (local === "promotion") local = "promotion.html";
                if (local === "privacy-policy") local = "privacy-policy.html";
                if (local === "terms-and-conditions") local = "terms-and-conditions.html";
                if (local === "register") local = "register.html";
                a.setAttribute("href", prefix + local);
                return;
            }
        });
    } catch (e) {}

    try {
        var path2 = (window.location && window.location.pathname) ? window.location.pathname : "";
        var isNested2 = path2.indexOf("/games/") !== -1 || path2.indexOf("/promo-detail/") !== -1;
        var prefix2 = isNested2 ? "../" : "";

        var applySharedFooter = function () {
            var existingFooter = document.querySelector("footer[data-shared-footer='1']");
            if (existingFooter) return;

            fetch(prefix2 + "index.html", { cache: "no-store" })
                .then(function (r) { return r.text(); })
                .then(function (html) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, "text/html");
                    var footer = doc.querySelector("footer#aboutus") || doc.querySelector("footer");
                    if (!footer) return;

                    var clone = footer.cloneNode(true);
                    clone.setAttribute("data-shared-footer", "1");

                    var nodes = clone.querySelectorAll("[href],[src]");
                    nodes.forEach(function (el) {
                        var attr = el.hasAttribute("href") ? "href" : "src";
                        var v = el.getAttribute(attr);
                        if (!v) return;
                        if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(v)) return;
                        if (v.startsWith("/") && !v.startsWith("/gogogo.com/")) return;
                        if (v.startsWith(prefix2)) return;
                        if (v.startsWith("assets/") || v.startsWith("terms-and-conditions") || v.startsWith("privacy-policy") || v.startsWith("promo-detail/")) {
                            el.setAttribute(attr, prefix2 + v);
                        }
                    });

                    var current = document.querySelector("footer");
                    if (current) {
                        current.replaceWith(clone);
                    } else {
                        document.body.appendChild(clone);
                    }
                })
                .catch(function () {});
        };

        applySharedFooter();
    } catch (e) {}

    try {
        var path3 = (window.location && window.location.pathname) ? window.location.pathname : "";
        var isNested3 = path3.indexOf("/games/") !== -1 || path3.indexOf("/promo-detail/") !== -1;
        var prefix3 = isNested3 ? "../" : "";
        var isLocal3 = window.location && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:");

        var escapeHtml3 = function (str) {
            return String(str || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };

        var getOrders3 = function () {
            try {
                var raw = localStorage.getItem("migewlito_orders");
                var list = raw ? JSON.parse(raw) : [];
                return Array.isArray(list) ? list : [];
            } catch (e) {
                return [];
            }
        };

        var setOrders3 = function (list) {
            try {
                localStorage.setItem("migewlito_orders", JSON.stringify(list || []));
            } catch (e) {}
        };

        var upsertOrder3 = function (order) {
            var orders = getOrders3();
            var idx = orders.findIndex(function (o) { return o && o.order_id === order.order_id; });
            if (idx >= 0) orders[idx] = order;
            else orders.unshift(order);
            setOrders3(orders);
        };

        var findOrder3 = function (orderId) {
            var orders = getOrders3();
            return orders.find(function (o) { return o && o.order_id === orderId; }) || null;
        };

        var swal3 = function (opts) {
            if (window.Swal && Swal.fire) return Swal.fire(opts);
            var ok = window.confirm((opts.title ? String(opts.title) + "\n\n" : "") + (opts.text || ""));
            return Promise.resolve({ isConfirmed: ok, isDismissed: !ok });
        };

        var swalInput3 = function (opts) {
            if (window.Swal && Swal.fire) return Swal.fire(opts);
            var val = window.prompt((opts.title ? String(opts.title) + "\n\n" : "") + (opts.text || ""), opts.inputValue || "");
            return Promise.resolve({ isConfirmed: val !== null && val !== undefined, value: val });
        };

        var isPlaceholderNickname3 = function (nickname) {
            var n = String(nickname || "").trim();
            if (!n) return true;
            return /^Player\\s+[0-9a-f]{6}$/i.test(n);
        };

        var saveNicknameToServer3 = function (user_id, zone_id, nickname) {
            try {
                var u = String(user_id || "").trim();
                var z = String(zone_id || "").trim();
                var n = String(nickname || "").trim();
                if (!u || !z || !n) return;
                fetch(prefix3 + "api/mlbb_nickname_set.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                    body: "user_id=" + encodeURIComponent(u) + "&zone_id=" + encodeURIComponent(z) + "&nickname=" + encodeURIComponent(n),
                    cache: "no-store"
                }).catch(function () {});
            } catch (e) {}
        };

        var formatPhpCurrency3 = function (value) {
            var num = Number(value);
            if (!isFinite(num)) {
                var cleaned = String(value || "").replace(/[^\d.]/g, "");
                num = Number(cleaned);
            }
            if (!isFinite(num)) num = 0;
            try {
                return new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(num);
            } catch (e) {
                try { return "₱ " + num.toFixed(2); } catch (e2) { return "₱ 0.00"; }
            }
        };

        var refreshCurrencyBlocks3 = function (rootEl) {
            try {
                if (!rootEl || !rootEl.querySelectorAll) return;
                var els = rootEl.querySelectorAll(".currency-idr,.currency-idr1");
                els.forEach(function (el) {
                    var txt = String(el.textContent || "").trim();
                    el.textContent = formatPhpCurrency3(txt);
                });
            } catch (e) {}
        };

        var computeOffText3 = function (price, original) {
            var pr = Number(price);
            var dr = Number(original);
            if (!isFinite(pr) || !isFinite(dr) || pr <= 0 || dr <= 0 || dr <= pr) return "";
            var pct = Math.round(((dr - pr) / dr) * 100);
            if (!isFinite(pct) || pct <= 0) return "";
            return pct + "% OFF";
        };

        var ensureAdminEditIndicatorStyles3 = function () {
            try {
                if (document.getElementById("migewlito-edit-indicator-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-edit-indicator-style";
                style.textContent = [
                    "html[data-migewlito-edit='1'] .itemspro:not(.migewlito-add-slot) label .bottom-price{position:relative}",
                    "html[data-migewlito-edit='1'] .itemspro:not(.migewlito-add-slot) label .bottom-price{padding-right:60px}",
                    "html[data-migewlito-edit='1'] .itemspro:not(.migewlito-add-slot) label .bottom-price::after{content:'🛠';position:absolute;right:16px;top:50%;transform:translateY(-50%);width:26px;height:26px;border-radius:999px;background:var(--warna_3);border:1px solid rgba(255,255,255,0.35);color:#0b2a2f;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;box-shadow:0 6px 14px rgba(0,0,0,0.35);pointer-events:none}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var findOrCreateProductCard3 = function (pid, priceText, hostOverride) {
            try {
                var input = document.querySelector('input[name="product"][value="' + String(pid) + '"]') || document.getElementById("product-" + String(pid));
                if (input) {
                    var label = null;
                    try { label = document.querySelector('label[for="' + input.id + '"]'); } catch (e) {}
                    return { input: input, label: label };
                }

                var host = hostOverride || document.querySelector(".row-category") || document.querySelector("#productsection .row") || null;
                if (!host) return { input: null, label: null };

                var col = document.createElement("div");
                col.className = "col-lg-3 col-md-4 col-sm-6 col-6 d-flex relative itemspro";

                var newId = "product-" + String(pid);
                var html = ""
                    + "<input type=\"radio\" id=\"" + escapeHtml3(newId) + "\" class=\"radio-nominale\" name=\"product\" data-price=\"" + escapeHtml3(String(priceText || "")) + "\" value=\"" + escapeHtml3(String(pid)) + "\">"
                    + "<label for=\"" + escapeHtml3(newId) + "\" class=\"d-flex align-items-start\">"
                    + "<div class=\"d-flex flex-column align-items-start justify-content-start w-100 h-100\" style=\"padding: 1rem 1rem 0.5rem 1rem;\">"
                    + "<div style=\"background:#eee;padding:5px;border-radius:5px;\">"
                    + "<img src=\"" + escapeHtml3(prefix3 + "assets/images/logo.png") + "\" loading=\"lazy\" class=\"icon-produk-games\" alt=\"" + escapeHtml3(String(pid)) + "\">"
                    + "</div>"
                    + "<div class=\"d-flex flex-column mt-2 mb-0\">"
                    + "<span class=\"product-name\">New item</span>"
                    + "<span class=\"product-subname\" style=\"display:none\"></span>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"bottom-price w-100 d-flex flex-column justify-content-start align-items-start\">"
                    + "<span class=\"currency-idr1\">" + escapeHtml3(String(priceText || "")) + "</span>"
                    + "<span class=\"currency-idr discount-price mb-0\" style=\"display:none\"></span>"
                    + "</div>"
                    + "</label>";
                col.innerHTML = html;
                host.appendChild(col);

                var input2 = col.querySelector('input[name="product"]');
                var label2 = col.querySelector('label[for="' + newId + '"]');
                return { input: input2, label: label2 };
            } catch (e) {
                return { input: null, label: null };
            }
        };

        var ensureAddSlotStyles3 = function () {
            try {
                if (document.getElementById("migewlito-addslot-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-addslot-style";
                style.textContent = [
                    "html[data-migewlito-edit='1'] .migewlito-add-slot{display:block!important}",
                    "html[data-migewlito-edit='0'] .migewlito-add-slot{display:none!important}",
                    ".migewlito-add-slot .migewlito-add-label{cursor:pointer}",
                    ".migewlito-add-slot .bottom-price{position:relative}",
                    ".migewlito-add-slot .migewlito-add-action{position:absolute;right:16px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:999px;background:var(--warna_3);border:1px solid rgba(255,255,255,0.35);color:#0b2a2f;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;box-shadow:0 6px 14px rgba(0,0,0,0.25)}",
                    ".migewlito-add-slot .bottom-price{padding-right:64px}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var syncAddSlotHeight3 = function (row) {
            try {
                if (!row || !row.querySelector) return;
                var sample = row.querySelector('label[for^="product-"]');
                var add = row.querySelector(".migewlito-add-slot .migewlito-add-label");
                if (!sample || !add) return;
                var h = Math.round(sample.getBoundingClientRect().height || 0);
                if (h > 0) add.style.height = String(h) + "px";
            } catch (e) {}
        };

        var ensureNavUserStyles3 = function () {
            try {
                if (document.getElementById("migewlito-nav-user-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-nav-user-style";
                style.textContent = [
                    ".migewlito-nav-user{display:flex;align-items:center;gap:10px}",
                    ".migewlito-avatar{width:34px;height:34px;border-radius:999px;background:rgba(255,255,255,0.10);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;cursor:pointer;user-select:none}",
                    ".migewlito-user-menu{position:relative}",
                    ".migewlito-user-dropdown{position:absolute;right:0;top:44px;min-width:180px;background:#2e2e2e;border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:8px;display:none;z-index:2000}",
                    ".migewlito-user-dropdown a,.migewlito-user-dropdown button{width:100%;text-align:left;background:transparent;border:none;color:#fff;padding:10px 10px;border-radius:10px;font-weight:600;display:block}",
                    ".migewlito-user-dropdown a:hover,.migewlito-user-dropdown button:hover{background:rgba(255,255,255,0.08)}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var ensureNoFlashStyles3 = function () {
            try {
                if (document.getElementById("migewlito-no-flash-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-no-flash-style";
                style.textContent = [
                    ".banner-games-images-top{display:none!important}",
                    "#voucherandwa1,#scrollToKontak{display:none!important}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var ensureAuthModalStyles3 = function () {
            try {
                if (document.getElementById("migewlito-auth-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-auth-style";
                style.textContent = [
                    ".migewlito-auth-modal .modal-dialog{max-width:420px;width:420px;margin-left:auto;margin-right:auto}",
                    ".migewlito-auth-modal .modal-content{background:#303030;border:1px solid rgba(255,255,255,0.12);border-radius:18px}",
                    ".migewlito-auth-modal .modal-header{border-bottom:none;padding:18px 18px 0 18px}",
                    ".migewlito-auth-modal .modal-body{padding:14px 22px 22px 22px}",
                    ".migewlito-auth-brand{display:flex;justify-content:center;align-items:center;margin-top:4px}",
                    ".migewlito-auth-title{color:#fff;font-size:26px;font-weight:900;text-align:center;margin:12px 0 14px 0}",
                    ".migewlito-auth-sub{color:rgba(255,255,255,0.85);font-size:14px;text-align:center;margin-bottom:16px}",
                    ".migewlito-auth-box{background:rgba(0,0,0,0.18);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:14px}",
                    ".migewlito-auth-form{display:none}",
                    ".migewlito-auth-form.active{display:block}",
                    ".migewlito-auth-label{color:rgba(255,255,255,0.88);font-weight:700;font-size:13px;margin-bottom:6px}",
                    ".migewlito-auth-input{width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.14);background:#1f1f1f;color:#fff;padding:10px 12px;outline:none}",
                    ".migewlito-auth-input:focus{border-color:var(--warna_3);box-shadow:0 0 0 3px rgba(84,204,196,0.15)}",
                    ".migewlito-auth-row{display:flex;flex-direction:column;gap:10px}",
                    ".migewlito-auth-btn{width:100%;border-radius:12px;padding:12px 14px;font-weight:900}",
                    ".migewlito-auth-switch{color:rgba(255,255,255,0.85);text-align:center;font-size:13px;margin-top:12px}",
                    ".migewlito-auth-switch a{color:var(--warna_3);font-weight:800;text-decoration:none}",
                    ".migewlito-auth-terms{display:flex;gap:10px;align-items:flex-start;color:rgba(255,255,255,0.85);font-size:12px;margin:14px 0}",
                    ".migewlito-auth-terms input{margin-top:3px;width:18px;height:18px;accent-color:var(--warna_3)}",
                    ".migewlito-auth-error{display:none;margin-top:10px;background:rgba(198,31,77,0.14);border:1px solid rgba(198,31,77,0.35);color:#fff;border-radius:12px;padding:10px 12px;font-size:13px}",
                    ".migewlito-auth-error.show{display:block}",
                    "@media (max-width:576px){.migewlito-auth-modal .modal-dialog{width:auto;max-width:calc(100% - 24px)}.migewlito-auth-modal .modal-body{padding:14px 16px 18px 16px}.migewlito-auth-title{font-size:22px}}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var ensureMlbbCheckerModal3 = function () {
            try {
                ensureAuthModalStyles3();
                if (document.getElementById("migewlito-mlbb-modal")) return;

                var container = document.createElement("div");
                container.innerHTML = ""
                    + "<div class=\"modal fade migewlito-auth-modal\" id=\"migewlito-mlbb-modal\" tabindex=\"-1\" aria-hidden=\"true\">"
                    + "  <div class=\"modal-dialog modal-dialog-centered\">"
                    + "    <div class=\"modal-content\">"
                    + "      <div class=\"modal-header\">"
                    + "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" data-bs-dismiss=\"modal\" aria-label=\"Close\" style=\"color:#fff;opacity:1;background:transparent;border:none;font-size:28px;line-height:1;margin-left:auto\">×</button>"
                    + "      </div>"
                    + "      <div class=\"modal-body\">"
                    + "        <div class=\"migewlito-auth-brand\">"
                    + "          <img src=\"" + escapeHtml3(prefix3 + "assets/images/banner1.png") + "\" alt=\"Migewlito\" style=\"height:34px;object-fit:contain\">"
                    + "        </div>"
                    + "        <div class=\"migewlito-auth-title\">MLBB ID Checker</div>"
                    + "        <div class=\"migewlito-auth-sub\">Enter User ID and Zone ID to fetch nickname.</div>"
                    + "        <div class=\"migewlito-auth-box\">"
                    + "          <div class=\"migewlito-auth-row\">"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">User ID</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-mlbb-user\" inputmode=\"numeric\" placeholder=\"e.g. 1234567890\">"
                    + "            </div>"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">Zone ID</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-mlbb-zone\" inputmode=\"numeric\" placeholder=\"e.g. 1234\">"
                    + "            </div>"
                    + "          </div>"
                    + "          <div class=\"migewlito-auth-error\" id=\"mgw-mlbb-error\"></div>"
                    + "          <div style=\"margin-top:12px\">"
                    + "            <button class=\"btn btn-primary migewlito-auth-btn\" type=\"button\" id=\"mgw-mlbb-check\" style=\"padding:10px 14px\">Check</button>"
                    + "          </div>"
                    + "          <div id=\"mgw-mlbb-result\" style=\"display:none;margin-top:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:12px\">"
                    + "            <div class=\"text-white\" style=\"font-weight:900\">Nickname</div>"
                    + "            <div class=\"text-white\" id=\"mgw-mlbb-nickname\" style=\"margin-top:4px\"></div>"
                    + "            <div style=\"display:flex;gap:10px;margin-top:12px\">"
                    + "              <button class=\"btn btn-outline-light migewlito-auth-btn\" type=\"button\" id=\"mgw-mlbb-apply\" style=\"padding:10px 14px\">Apply to form</button>"
                    + "              <button class=\"btn btn-outline-light migewlito-auth-btn\" type=\"button\" id=\"mgw-mlbb-close\" style=\"padding:10px 14px\">Close</button>"
                    + "            </div>"
                    + "          </div>"
                    + "        </div>"
                    + "      </div>"
                    + "    </div>"
                    + "  </div>"
                    + "</div>";

                document.body.appendChild(container.firstChild);

                var closeBtn = document.getElementById("mgw-mlbb-close");
                if (closeBtn) closeBtn.addEventListener("click", function () {
                    try {
                        if (window.bootstrap && bootstrap.Modal) {
                            var inst = bootstrap.Modal.getInstance(document.getElementById("migewlito-mlbb-modal"));
                            if (inst) inst.hide();
                            return;
                        }
                    } catch (e) {}
                    try {
                        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                            window.jQuery("#migewlito-mlbb-modal").modal("hide");
                        }
                    } catch (e) {}
                });
            } catch (e) {}
        };

        var openMlbbCheckerModal3 = function (prefill) {
            try {
                ensureMlbbCheckerModal3();
                var modalEl = document.getElementById("migewlito-mlbb-modal");
                if (!modalEl) return;

                var err = document.getElementById("mgw-mlbb-error");
                var resBox = document.getElementById("mgw-mlbb-result");
                var nickEl = document.getElementById("mgw-mlbb-nickname");
                if (err) { err.textContent = ""; err.classList.remove("show"); }
                if (resBox) resBox.style.display = "none";
                if (nickEl) nickEl.textContent = "";

                var uEl = document.getElementById("mgw-mlbb-user");
                var zEl = document.getElementById("mgw-mlbb-zone");
                if (prefill && uEl) uEl.value = String(prefill.user_id || "");
                if (prefill && zEl) zEl.value = String(prefill.zone_id || "");

                try {
                    if (window.bootstrap && bootstrap.Modal) {
                        var inst = bootstrap.Modal.getOrCreateInstance(modalEl);
                        inst.show();
                        return;
                    }
                } catch (e) {}
                try {
                    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                        window.jQuery(modalEl).modal("show");
                    }
                } catch (e) {}
            } catch (e) {}
        };

        var ensureAdminItemModal3 = function () {
            try {
                ensureAuthModalStyles3();
                if (document.getElementById("migewlito-admin-item-modal")) return;

                var container = document.createElement("div");
                container.innerHTML = ""
                    + "<div class=\"modal fade migewlito-auth-modal\" id=\"migewlito-admin-item-modal\" tabindex=\"-1\" aria-hidden=\"true\">"
                    + "  <div class=\"modal-dialog modal-dialog-centered\">"
                    + "    <div class=\"modal-content\">"
                    + "      <div class=\"modal-header\">"
                    + "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" data-bs-dismiss=\"modal\" aria-label=\"Close\" style=\"color:#fff;opacity:1;background:transparent;border:none;font-size:28px;line-height:1;margin-left:auto\">×</button>"
                    + "      </div>"
                    + "      <div class=\"modal-body\">"
                    + "        <div class=\"migewlito-auth-brand\">"
                    + "          <img src=\"" + escapeHtml3(prefix3 + "assets/images/banner1.png") + "\" alt=\"Migewlito\" style=\"height:34px;object-fit:contain\">"
                    + "        </div>"
                    + "        <div class=\"migewlito-auth-title\" id=\"mgw-admin-item-title\">Edit item</div>"
                    + "        <div class=\"migewlito-auth-sub\" id=\"mgw-admin-item-sub\">Update item details and save.</div>"
                    + "        <div class=\"migewlito-auth-box\">"
                    + "          <div class=\"migewlito-auth-row\">"
                    + "            <div id=\"mgw-admin-item-id-wrap\" style=\"display:none\">"
                    + "              <div class=\"migewlito-auth-label\">Product ID</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-admin-item-id\" inputmode=\"numeric\" placeholder=\"e.g. 9999\">"
                    + "            </div>"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">Name</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-admin-item-name\" placeholder=\"Item name\">"
                    + "            </div>"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">Sub name (optional)</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-admin-item-subname\" placeholder=\"Bonus text\">"
                    + "            </div>"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">Image URL</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-admin-item-image\" placeholder=\"/path/to/image.webp\">"
                    + "            </div>"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">Price (PHP)</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-admin-item-price\" inputmode=\"decimal\" placeholder=\"0.00\">"
                    + "            </div>"
                    + "            <div>"
                    + "              <div class=\"migewlito-auth-label\">Original price (optional)</div>"
                    + "              <input class=\"migewlito-auth-input\" id=\"mgw-admin-item-original\" inputmode=\"decimal\" placeholder=\"0.00\">"
                    + "            </div>"
                    + "          </div>"
                    + "          <div class=\"migewlito-auth-error\" id=\"mgw-admin-item-error\"></div>"
                    + "          <div style=\"display:flex;gap:10px;margin-top:14px\">"
                    + "            <button class=\"btn btn-primary migewlito-auth-btn\" type=\"button\" id=\"mgw-admin-item-save\" style=\"padding:10px 14px\">Save</button>"
                    + "            <button class=\"btn btn-outline-light migewlito-auth-btn\" type=\"button\" id=\"mgw-admin-item-close\" style=\"padding:10px 14px\">Close</button>"
                    + "          </div>"
                    + "          <button class=\"btn btn-outline-light migewlito-auth-btn\" type=\"button\" id=\"mgw-admin-item-delete\" style=\"padding:10px 14px;margin-top:10px;border-color:rgba(255,90,90,0.55);color:#ff6b6b\">Delete item</button>"
                    + "          <div class=\"text-white\" style=\"opacity:.72;font-size:12px;margin-top:10px\">Discount badge and line-through are automatic.</div>"
                    + "        </div>"
                    + "      </div>"
                    + "    </div>"
                    + "  </div>"
                    + "</div>";

                document.body.appendChild(container.firstChild);

                var closeBtn = document.getElementById("mgw-admin-item-close");
                if (closeBtn) closeBtn.addEventListener("click", function () {
                    try {
                        if (window.bootstrap && bootstrap.Modal) {
                            var inst = bootstrap.Modal.getInstance(document.getElementById("migewlito-admin-item-modal"));
                            if (inst) inst.hide();
                            return;
                        }
                    } catch (e) {}
                    try {
                        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                            window.jQuery("#migewlito-admin-item-modal").modal("hide");
                        }
                    } catch (e) {}
                });
            } catch (e) {}
        };

        var openAdminItemModal3 = function (mode, data) {
            try {
                ensureAdminItemModal3();
                var modalEl = document.getElementById("migewlito-admin-item-modal");
                if (!modalEl) return;

                var titleEl = document.getElementById("mgw-admin-item-title");
                var subEl = document.getElementById("mgw-admin-item-sub");
                var idWrap = document.getElementById("mgw-admin-item-id-wrap");
                var err = document.getElementById("mgw-admin-item-error");

                var idEl = document.getElementById("mgw-admin-item-id");
                var nameEl = document.getElementById("mgw-admin-item-name");
                var subnameEl = document.getElementById("mgw-admin-item-subname");
                var imgEl = document.getElementById("mgw-admin-item-image");
                var priceEl = document.getElementById("mgw-admin-item-price");
                var origEl = document.getElementById("mgw-admin-item-original");
                var delBtn = document.getElementById("mgw-admin-item-delete");

                if (err) { err.textContent = ""; err.classList.remove("show"); }

                var page = data && data.page ? String(data.page) : "";
                var pid = data && data.pid ? String(data.pid) : "";
                var existing = data && data.existing ? data.existing : {};
                var hostSectionId = data && data.hostSectionId ? String(data.hostSectionId) : "";

                modalEl.setAttribute("data-page", page);
                modalEl.setAttribute("data-mode", mode === "add" ? "add" : "edit");
                modalEl.setAttribute("data-pid", pid);
                if (hostSectionId) modalEl.setAttribute("data-host-section", hostSectionId);
                else modalEl.removeAttribute("data-host-section");

                if (mode === "add") {
                    if (titleEl) titleEl.textContent = "Add item";
                    if (subEl) subEl.textContent = "Create a new item card and set its pricing.";
                    if (idWrap) idWrap.style.display = "";
                    if (idEl) idEl.value = "";
                    if (delBtn) delBtn.style.display = "none";
                } else {
                    if (titleEl) titleEl.textContent = "Edit item";
                    if (subEl) subEl.textContent = "Update item details and save.";
                    if (idWrap) idWrap.style.display = "none";
                    if (delBtn) delBtn.style.display = "";
                }

                if (nameEl) nameEl.value = String(existing.name || "");
                if (subnameEl) subnameEl.value = String(existing.subname || "");
                if (imgEl) imgEl.value = String(existing.image_url || "");
                if (priceEl) priceEl.value = String(existing.price || "");
                if (origEl) origEl.value = String(existing.discount_price || "");

                try {
                    if (window.bootstrap && bootstrap.Modal) {
                        var inst = bootstrap.Modal.getOrCreateInstance(modalEl);
                        inst.show();
                        return;
                    }
                } catch (e) {}
                try {
                    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                        window.jQuery(modalEl).modal("show");
                    }
                } catch (e) {}
            } catch (e) {}
        };

        var ensureAuthModal3 = function () {
            try {
                ensureAuthModalStyles3();
                if (document.getElementById("migewlito-auth-modal")) return;

                var container = document.createElement("div");
                container.innerHTML = ""
                    + "<div class=\"modal fade migewlito-auth-modal\" id=\"migewlito-auth-modal\" tabindex=\"-1\" aria-hidden=\"true\">"
                    + "  <div class=\"modal-dialog modal-dialog-centered\">"
                    + "    <div class=\"modal-content\">"
                    + "      <div class=\"modal-header\">"
                    + "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" data-bs-dismiss=\"modal\" aria-label=\"Close\" style=\"color:#fff;opacity:1;background:transparent;border:none;font-size:28px;line-height:1;margin-left:auto\">×</button>"
                    + "      </div>"
                    + "      <div class=\"modal-body\">"
                    + "        <div class=\"migewlito-auth-brand\">"
                    + "          <img src=\"" + escapeHtml3(prefix3 + "assets/images/banner1.png") + "\" alt=\"Migewlito\" style=\"height:34px;object-fit:contain\">"
                    + "        </div>"
                    + "        <div class=\"migewlito-auth-title\" id=\"migewlito-auth-title\">Welcome!</div>"
                    + "        <div class=\"migewlito-auth-sub\" id=\"migewlito-auth-sub\">Log in or create an account to continue.</div>"
                    + "        <div class=\"migewlito-auth-box\">"
                    + "          <div class=\"migewlito-auth-form active\" id=\"migewlito-login-form\">"
                    + "            <div class=\"migewlito-auth-row\">"
                    + "              <div>"
                    + "                <div class=\"migewlito-auth-label\">Username or Email</div>"
                    + "                <input class=\"migewlito-auth-input\" id=\"mgw-login-identifier\" autocomplete=\"username\" placeholder=\"username or email\">"
                    + "              </div>"
                    + "              <div>"
                    + "                <div class=\"migewlito-auth-label\">Password</div>"
                    + "                <input class=\"migewlito-auth-input\" id=\"mgw-login-password\" type=\"password\" autocomplete=\"current-password\" placeholder=\"••••••••\">"
                    + "              </div>"
                    + "            </div>"
                    + "            <div class=\"migewlito-auth-terms\">"
                    + "              <input type=\"checkbox\" id=\"mgw-terms\">"
                    + "              <div>By logging in, I agree to the <a href=\"" + escapeHtml3(prefix3 + "terms-and-conditions.html") + "\">Terms & Conditions</a> and <a href=\"" + escapeHtml3(prefix3 + "privacy-policy.html") + "\">Privacy Policy</a>.</div>"
                    + "            </div>"
                    + "            <button class=\"btn btn-primary migewlito-auth-btn\" type=\"button\" id=\"mgw-btn-login\">Log in</button>"
                    + "            <div class=\"migewlito-auth-error\" id=\"mgw-auth-error\"></div>"
                    + "            <div class=\"migewlito-auth-switch\">Don’t have an account? <a href=\"#\" id=\"mgw-switch-register\">Create account</a></div>"
                    + "          </div>"
                    + "          <div class=\"migewlito-auth-form\" id=\"migewlito-register-form\">"
                    + "            <div class=\"migewlito-auth-row\">"
                    + "              <div>"
                    + "                <div class=\"migewlito-auth-label\">Username</div>"
                    + "                <input class=\"migewlito-auth-input\" id=\"mgw-reg-username\" autocomplete=\"username\" placeholder=\"username\">"
                    + "              </div>"
                    + "              <div>"
                    + "                <div class=\"migewlito-auth-label\">Email</div>"
                    + "                <input class=\"migewlito-auth-input\" id=\"mgw-reg-email\" type=\"email\" autocomplete=\"email\" placeholder=\"you@email.com\">"
                    + "              </div>"
                    + "              <div>"
                    + "                <div class=\"migewlito-auth-label\">Name</div>"
                    + "                <input class=\"migewlito-auth-input\" id=\"mgw-reg-name\" autocomplete=\"name\" placeholder=\"Your name\">"
                    + "              </div>"
                    + "              <div>"
                    + "                <div class=\"migewlito-auth-label\">Password</div>"
                    + "                <input class=\"migewlito-auth-input\" id=\"mgw-reg-password\" type=\"password\" autocomplete=\"new-password\" placeholder=\"Minimum 6 characters\">"
                    + "              </div>"
                    + "            </div>"
                    + "            <div class=\"migewlito-auth-terms\">"
                    + "              <input type=\"checkbox\" id=\"mgw-terms2\">"
                    + "              <div>By creating an account, I agree to the <a href=\"" + escapeHtml3(prefix3 + "terms-and-conditions.html") + "\">Terms & Conditions</a> and <a href=\"" + escapeHtml3(prefix3 + "privacy-policy.html") + "\">Privacy Policy</a>.</div>"
                    + "            </div>"
                    + "            <button class=\"btn btn-primary migewlito-auth-btn\" type=\"button\" id=\"mgw-btn-register\">Create account</button>"
                    + "            <div class=\"migewlito-auth-error\" id=\"mgw-auth-error2\"></div>"
                    + "            <div class=\"migewlito-auth-switch\">Already have an account? <a href=\"#\" id=\"mgw-switch-login\">Log in</a></div>"
                    + "          </div>"
                    + "        </div>"
                    + "      </div>"
                    + "    </div>"
                    + "  </div>"
                    + "</div>";

                document.body.appendChild(container.firstChild);

                var showError = function (id, msg) {
                    var el = document.getElementById(id);
                    if (!el) return;
                    el.textContent = String(msg || "Something went wrong");
                    el.classList.add("show");
                };
                var clearError = function () {
                    ["mgw-auth-error", "mgw-auth-error2"].forEach(function (id) {
                        var el = document.getElementById(id);
                        if (!el) return;
                        el.textContent = "";
                        el.classList.remove("show");
                    });
                };

                var setMode = function (mode) {
                    clearError();
                    var login = document.getElementById("migewlito-login-form");
                    var reg = document.getElementById("migewlito-register-form");
                    var title = document.getElementById("migewlito-auth-title");
                    var sub = document.getElementById("migewlito-auth-sub");
                    if (!login || !reg) return;
                    if (mode === "register") {
                        login.classList.remove("active");
                        reg.classList.add("active");
                        if (title) title.textContent = "Create your account";
                        if (sub) sub.textContent = "Create an account to manage transactions and admin tools.";
                    } else {
                        reg.classList.remove("active");
                        login.classList.add("active");
                        if (title) title.textContent = "Welcome!";
                        if (sub) sub.textContent = "Log in to continue.";
                    }
                };

                var swReg = document.getElementById("mgw-switch-register");
                var swLog = document.getElementById("mgw-switch-login");
                if (swReg) swReg.addEventListener("click", function (e) { e.preventDefault(); setMode("register"); });
                if (swLog) swLog.addEventListener("click", function (e) { e.preventDefault(); setMode("login"); });

                var closeModal = function () {
                    try {
                        if (window.bootstrap && bootstrap.Modal) {
                            var inst = bootstrap.Modal.getInstance(document.getElementById("migewlito-auth-modal"));
                            if (inst) inst.hide();
                            return;
                        }
                    } catch (e) {}
                    try {
                        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                            window.jQuery("#migewlito-auth-modal").modal("hide");
                        }
                    } catch (e) {}
                };

                var postJson = function (url, body) {
                    return fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body || {}),
                        cache: "no-store"
                    }).then(function (r) { return r.json(); });
                };

                var btnLogin = document.getElementById("mgw-btn-login");
                if (btnLogin) {
                    btnLogin.addEventListener("click", function () {
                        clearError();
                        var ok = document.getElementById("mgw-terms");
                        if (ok && !ok.checked) return showError("mgw-auth-error", "Please agree to the Terms & Conditions and Privacy Policy.");
                        var identifier = String((document.getElementById("mgw-login-identifier") || {}).value || "").trim();
                        var password = String((document.getElementById("mgw-login-password") || {}).value || "");
                        if (!identifier || !password) return showError("mgw-auth-error", "Username/email and password are required.");
                        postJson(prefix3 + "api/auth_login.php", { identifier: identifier, password: password })
                            .then(function (res) {
                                if (!res || !res.success) throw new Error((res && res.error) || "Login failed");
                                closeModal();
                                window.location.reload();
                            })
                            .catch(function (e) { showError("mgw-auth-error", e.message || "Login failed"); });
                    });
                }

                var btnReg = document.getElementById("mgw-btn-register");
                if (btnReg) {
                    btnReg.addEventListener("click", function () {
                        clearError();
                        var ok = document.getElementById("mgw-terms2");
                        if (ok && !ok.checked) return showError("mgw-auth-error2", "Please agree to the Terms & Conditions and Privacy Policy.");
                        var username = String((document.getElementById("mgw-reg-username") || {}).value || "").trim();
                        var email = String((document.getElementById("mgw-reg-email") || {}).value || "").trim();
                        var name = String((document.getElementById("mgw-reg-name") || {}).value || "").trim();
                        var password = String((document.getElementById("mgw-reg-password") || {}).value || "");
                        if (!email || !password) return showError("mgw-auth-error2", "Email and password are required.");
                        postJson(prefix3 + "api/auth_register.php", { username: username, email: email, name: name, password: password })
                            .then(function (res) {
                                if (!res || !res.success) throw new Error((res && res.error) || "Register failed");
                                closeModal();
                                window.location.reload();
                            })
                            .catch(function (e) { showError("mgw-auth-error2", e.message || "Register failed"); });
                    });
                }

                container._migewlitoSetMode = setMode;
            } catch (e) {}
        };

        var openAuthModal3 = function (mode) {
            try {
                ensureAuthModal3();
                var modalEl = document.getElementById("migewlito-auth-modal");
                if (!modalEl) return;
                try {
                    var any = document.getElementById("migewlito-auth-modal");
                    if (any && any.parentElement && any.parentElement._migewlitoSetMode) {
                        any.parentElement._migewlitoSetMode(mode === "register" ? "register" : "login");
                    }
                } catch (e) {}
                try {
                    if (window.bootstrap && bootstrap.Modal) {
                        var inst = bootstrap.Modal.getOrCreateInstance(modalEl);
                        inst.show();
                        return;
                    }
                } catch (e) {}
                try {
                    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                        window.jQuery(modalEl).modal("show");
                    }
                } catch (e) {}
            } catch (e) {}
        };

        var replaceModalLoginLinks3 = function () {
            try {
                var targets = document.querySelectorAll('[data-bs-target="#modalLogin"],[data-target="#modalLogin"]');
                targets.forEach(function (el) {
                    try {
                        el.removeAttribute("data-bs-toggle");
                        el.removeAttribute("data-toggle");
                        el.removeAttribute("data-bs-target");
                        el.removeAttribute("data-target");
                    } catch (e) {}
                    el.setAttribute("data-migewlito-auth", "1");
                });
            } catch (e) {}
        };

        var replacePromoWithMlbbChecker3 = function () {
            try {
                var links = document.querySelectorAll(".navbar a[href]");
                links.forEach(function (a) {
                    try {
                        var href = String(a.getAttribute("href") || "");
                        var txt = String(a.textContent || "").trim().toLowerCase();
                        var isPromoHref = /(^|\/)promotion(\.html)?(\?|#|$)/i.test(href);
                        var isPromoText = txt === "promo" || txt === "promos" || txt === "promotion";
                        if (!isPromoHref && !isPromoText) return;
                        a.setAttribute("href", "#");
                        a.setAttribute("data-migewlito-mlbb", "1");
                        a.textContent = "MLBB Checker";
                    } catch (e) {}
                });
            } catch (e) {}
        };

        var updateNavbarAuthLinks3 = function (user) {
            try {
                var navs = document.querySelectorAll(".navbar .navbar-nav");
                navs.forEach(function (nav) {
                    if (!nav || !nav.querySelectorAll) return;
                    var loginLinks = nav.querySelectorAll('a[data-migewlito-auth],a[href="#"][data-migewlito-auth]');
                    if (user) {
                        loginLinks.forEach(function (a) { try { a.remove(); } catch (e) {} });
                    } else {
                        if (loginLinks.length === 0) {
                            var a2 = document.createElement("a");
                            a2.className = "nav-item nav-link bang";
                            a2.setAttribute("href", "#");
                            a2.setAttribute("data-migewlito-auth", "1");
                            a2.textContent = "Login";
                            nav.appendChild(a2);
                        }
                    }
                });
            } catch (e) {}
        };

        var injectNavUser3 = function () {
            ensureNavUserStyles3();
            replaceModalLoginLinks3();
            replacePromoWithMlbbChecker3();
            try {
                var legacy = document.querySelector(".navbar .logdarf");
                if (legacy) legacy.style.display = "none";
            } catch (e) {}
            var slot = document.getElementById("migewlito-nav-user-slot");
            if (!slot) {
                var desktopNav = document.querySelector(".navbar .navbar-nav.ml-auto");
                if (desktopNav) {
                    slot = document.createElement("div");
                    slot.id = "migewlito-nav-user-slot";
                    desktopNav.appendChild(slot);
                }
            }
            if (!slot) return;

            fetch(prefix3 + "api/auth_me.php", { cache: "no-store" })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    var user = res && res.success ? res.user : null;
                    updateNavbarAuthLinks3(user);
                    if (!user) { slot.innerHTML = ""; return; }
                    var initial = (String(user.name || user.email || "U").trim().slice(0, 1) || "U").toUpperCase();
                    var role = String(user.role || "member");
                    var menu = ""
                        + "<div class=\"migewlito-nav-user\">"
                        + "<div class=\"migewlito-user-menu\">"
                        + "<div class=\"migewlito-avatar\" id=\"migewlito-avatar-btn\">" + escapeHtml3(initial) + "</div>"
                        + "<div class=\"migewlito-user-dropdown\" id=\"migewlito-user-dropdown\">"
                        + "<a href=\"" + prefix3 + "user.html\">Profile</a>"
                        + (role === "admin" ? ("<a href=\"" + prefix3 + "admin.html\">Admin</a>") : "")
                        + "<button type=\"button\" id=\"migewlito-logout\">Logout</button>"
                        + "</div>"
                        + "</div>"
                        + "</div>";
                    slot.innerHTML = menu;

                    var btn = document.getElementById("migewlito-avatar-btn");
                    var dd = document.getElementById("migewlito-user-dropdown");
                    var logout = document.getElementById("migewlito-logout");

                    if (btn && dd) {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            dd.style.display = (dd.style.display === "block") ? "none" : "block";
                        });
                        document.addEventListener("click", function () {
                            try { dd.style.display = "none"; } catch (e) {}
                        });
                    }

                    if (logout) {
                        logout.addEventListener("click", function () {
                            fetch(prefix3 + "api/auth_logout.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}", cache: "no-store" })
                                .then(function () { window.location.href = prefix3 + "index.html"; })
                                .catch(function () { window.location.href = prefix3 + "index.html"; });
                        });
                    }
                })
                .catch(function () {});
        };

        var applyGameConfig3 = function () {
            try {
                if (path3.indexOf("/games/") === -1) return;
                var idx = path3.indexOf("/en-ph/");
                var rel = idx >= 0 ? path3.slice(idx + 7) : "";
                if (!rel) {
                    var gi = path3.indexOf("/games/");
                    if (gi >= 0) rel = "games/" + path3.slice(gi + 7).replace(/^\/+/, "");
                }
                rel = String(rel || "").replace(/^\/+/, "");
                if (rel.indexOf("games/") !== 0) return;

                fetch(prefix3 + "api/game_config.php?page=" + encodeURIComponent(rel), { cache: "no-store" })
                    .then(function (r) { return r.json(); })
                    .then(function (res) {
                        if (!res || !res.success) return;

                        var products = res.products || {};
                        Object.keys(products || {}).forEach(function (pid) {
                            var cfg = products[pid] || {};
                            var found = findOrCreateProductCard3(pid, (cfg.price != null ? String(cfg.price) : ""));
                            var input = found.input;
                            var label = found.label;
                            if (!input || !label) return;
                            var wrap = input.closest ? input.closest(".itemspro") : null;

                            if (cfg && cfg.hidden) {
                                try { input.disabled = true; } catch (e) {}
                                if (wrap) wrap.style.display = "none";
                                return;
                            }

                            var price = (cfg.price != null && String(cfg.price).trim() !== "") ? String(cfg.price) : "";
                            var discount = (cfg.discount_price != null && String(cfg.discount_price).trim() !== "") ? String(cfg.discount_price) : "";
                            var nameOverride = String(cfg.name || "").trim();
                            var subOverride = String(cfg.subname || "").trim();
                            var imgOverride = String(cfg.image_url || "").trim();

                            if (price) {
                                input.setAttribute("data-price", price);
                                if (label) {
                                    var pEl = label.querySelector(".currency-idr1");
                                    if (pEl) pEl.textContent = price;
                                }
                            }

                            if (label) {
                                if (nameOverride) {
                                    try {
                                        var nEl = label.querySelector(".product-name");
                                        if (nEl) nEl.textContent = nameOverride;
                                    } catch (e) {}
                                }
                                if (subOverride) {
                                    try {
                                        var sEl = label.querySelector(".product-subname");
                                        if (sEl) sEl.textContent = subOverride;
                                    } catch (e) {}
                                }
                                if (imgOverride) {
                                    try {
                                        var imgEl = label.querySelector("img.icon-produk-games") || label.querySelector("img");
                                        if (imgEl) imgEl.setAttribute("src", imgOverride);
                                    } catch (e) {}
                                }

                                var dEl = label.querySelector(".discount-price");
                                var pEl2 = label.querySelector(".currency-idr1");

                                var pr2 = Number(price || input.getAttribute("data-price") || (pEl2 ? String(pEl2.textContent || "").replace(/[^\d.]/g, "") : "0") || "0");
                                if (!isFinite(pr2)) pr2 = 0;

                                var dr2 = 0;
                                if (discount && isFinite(Number(discount)) && Number(discount) > 0) {
                                    dr2 = Number(discount);
                                } else if (dEl) {
                                    var txtD = String(dEl.textContent || "").trim();
                                    var parsedD = Number(txtD.replace(/[^\d.]/g, ""));
                                    if (isFinite(parsedD) && parsedD > 0) dr2 = parsedD;
                                }

                                if (!dr2) {
                                    var rbExistingSpan = null;
                                    try {
                                        var rbExisting = label.querySelector(".ribbon");
                                        rbExistingSpan = rbExisting ? rbExisting.querySelector("span") : null;
                                    } catch (e) {}
                                    if (rbExistingSpan) {
                                        var mPct = String(rbExistingSpan.textContent || "").match(/(\d{1,2})\s*%/);
                                        if (mPct && mPct[1] && pr2 > 0) {
                                            var pct2 = Number(mPct[1]);
                                            if (isFinite(pct2) && pct2 > 0 && pct2 < 99) {
                                                dr2 = pr2 / (1 - (pct2 / 100));
                                                dr2 = Math.round(dr2 * 100) / 100;
                                            }
                                        }
                                    }
                                }

                                var shouldShowDiscount = (dr2 > 0 && pr2 > 0 && dr2 > pr2);
                                if (shouldShowDiscount) {
                                    if (!dEl) {
                                        var bottom = label.querySelector(".bottom-price");
                                        if (bottom) {
                                            dEl = document.createElement("span");
                                            dEl.className = "currency-idr discount-price mb-0";
                                            bottom.appendChild(dEl);
                                        }
                                    }
                                    if (dEl) {
                                        dEl.textContent = String(dr2);
                                        dEl.style.display = "";
                                    }
                                } else if (dEl) {
                                    dEl.style.display = "none";
                                }

                                var rb = label.querySelector(".ribbon");
                                var rbSpan = rb ? rb.querySelector("span") : null;
                                var offText = computeOffText3(pr2, dr2);
                                if (offText) {
                                    if (!rb) {
                                        rb = document.createElement("div");
                                        rb.className = "ribbon";
                                        rb.innerHTML = "<span></span>";
                                        label.insertBefore(rb, label.firstChild);
                                        rbSpan = rb.querySelector("span");
                                    }
                                    if (rbSpan) rbSpan.textContent = offText;
                                } else if (rb) {
                                    rb.style.display = "none";
                                }

                                refreshCurrencyBlocks3(label);
                            }
                        });
                    })
                    .catch(function () {});
            } catch (e) {}
        };

        var injectAdminEditMode3 = function () {
            try {
                if (path3.indexOf("/games/") === -1) return;
                var idx = path3.indexOf("/en-ph/");
                var rel = idx >= 0 ? path3.slice(idx + 7) : "";
                if (!rel) {
                    var gi = path3.indexOf("/games/");
                    if (gi >= 0) rel = "games/" + path3.slice(gi + 7).replace(/^\/+/, "");
                }
                rel = String(rel || "").replace(/^\/+/, "");
                if (rel.indexOf("games/") !== 0) return;

                var category = document.querySelector("#productsection .category-produk-games");
                if (!category) return;

                fetch(prefix3 + "api/auth_me.php", { cache: "no-store" })
                    .then(function (r) { return r.json(); })
                    .then(function (res) {
                        var user = res && res.success ? res.user : null;
                        if (!user || String(user.role || "") !== "admin") return;

                        if (document.getElementById("migewlito-editmode-btn")) return;

                        try {
                            category.style.position = category.style.position || "relative";
                        } catch (e) {}
                        try { if (document.documentElement) document.documentElement.setAttribute("data-migewlito-edit", "0"); } catch (e) {}
                        var wrap = document.createElement("div");
                        wrap.style.position = "absolute";
                        wrap.style.right = "10px";
                        wrap.style.top = "50%";
                        wrap.style.transform = "translateY(-50%)";
                        wrap.style.zIndex = "4";
                        wrap.style.display = "flex";
                        wrap.style.gap = "8px";

                        var btn = document.createElement("button");
                        btn.type = "button";
                        btn.id = "migewlito-editmode-btn";
                        btn.className = "btn btn-outline-light";
                        btn.textContent = "Edit mode";
                        btn.style.borderRadius = "12px";
                        btn.style.fontWeight = "800";
                        btn.style.padding = "6px 12px";

                        wrap.appendChild(btn);
                        category.appendChild(wrap);

                        var editOn = false;
                        ensureAddSlotStyles3();
                        var setBtnState = function () {
                            btn.textContent = editOn ? "Edit mode: ON" : "Edit mode";
                            btn.classList.toggle("btn-primary", editOn);
                            btn.classList.toggle("btn-outline-light", !editOn);
                            try {
                                if (!document.documentElement) return;
                                if (editOn) document.documentElement.setAttribute("data-migewlito-edit", "1");
                                else document.documentElement.setAttribute("data-migewlito-edit", "0");
                            } catch (e) {}
                            if (editOn) {
                                try {
                                    var rows2 = document.querySelectorAll("#productsection .row-category");
                                    rows2.forEach(function (r) { syncAddSlotHeight3(r); });
                                } catch (e) {}
                            }
                        };
                        try { if (document.documentElement) document.documentElement.setAttribute("data-migewlito-edit", "0"); } catch (e) {}
                        setBtnState();

                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            editOn = !editOn;
                            setBtnState();
                            if (editOn) {
                                swal3({
                                    title: "Edit mode",
                                    text: "Click any item card to edit its price.",
                                    icon: "info",
                                    confirmButtonText: "OK",
                                    confirmButtonColor: "var(--warna_3)",
                                    background: "#333333",
                                    color: "white"
                                });
                            }
                        });
                        try {
                            var rows = document.querySelectorAll("#productsection .row-category");
                            rows.forEach(function (row, idx) {
                                if (!row || !row.appendChild) return;
                                if (!row.dataset.migewlitoSection) row.dataset.migewlitoSection = String(idx + 1);
                                if (row.querySelector(".migewlito-add-slot")) return;
                                var col = document.createElement("div");
                                col.className = "col-lg-3 col-md-4 col-sm-6 col-6 relative itemspro migewlito-add-slot";
                                col.setAttribute("data-host-section", row.dataset.migewlitoSection);
                                var addId = "migewlito-add-" + String(row.dataset.migewlitoSection);
                                col.innerHTML = ""
                                    + "<input type=\"radio\" id=\"" + escapeHtml3(addId) + "\" class=\"radio-nominale\" disabled style=\"display:none\">"
                                    + "<label for=\"" + escapeHtml3(addId) + "\" class=\"d-flex align-items-start migewlito-add-label\">"
                                    + "<div class=\"d-flex flex-column align-items-start justify-content-start w-100 h-100\" style=\"padding: 1rem 1rem 0.5rem 1rem;\">"
                                    + "<div style=\"background:#eee;padding:5px;border-radius:5px;\">"
                                    + "<img src=\"" + escapeHtml3(prefix3 + "assets/images/logo.png") + "\" loading=\"lazy\" class=\"icon-produk-games\" alt=\"add\">"
                                    + "</div>"
                                    + "<div class=\"d-flex flex-column mt-2 mb-0\">"
                                    + "<span class=\"product-name\">Add item</span>"
                                    + "<span class=\"product-subname\" style=\"display:none\"></span>"
                                    + "</div>"
                                    + "</div>"
                                    + "<div class=\"bottom-price w-100 d-flex flex-column justify-content-start align-items-start\">"
                                    + "<span class=\"currency-idr1\" style=\"visibility:hidden\">0</span>"
                                    + "<span class=\"currency-idr discount-price mb-0\" style=\"visibility:hidden\">0</span>"
                                    + "<span class=\"migewlito-add-action\">+</span>"
                                    + "</div>"
                                    + "</label>";
                                col.addEventListener("click", function (ev) {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    if (!document.documentElement || document.documentElement.getAttribute("data-migewlito-edit") !== "1") return;
                                    var sid = String(col.getAttribute("data-host-section") || "");
                                    openAdminItemModal3("add", { page: rel, pid: "", hostSectionId: sid, existing: { name: "", subname: "", image_url: "", price: "", discount_price: "" } });
                                });
                                row.appendChild(col);
                                try {
                                    requestAnimationFrame(function () { syncAddSlotHeight3(row); });
                                } catch (e) {}
                            });
                        } catch (e) {}

                        try {
                            var saveBtn = document.getElementById("mgw-admin-item-save");
                            if (saveBtn && !saveBtn._migewlitoBound) {
                                saveBtn._migewlitoBound = true;
                                saveBtn.addEventListener("click", function () {
                                    var modalEl = document.getElementById("migewlito-admin-item-modal");
                                    if (!modalEl) return;
                                    var mode = String(modalEl.getAttribute("data-mode") || "edit");
                                    var page = String(modalEl.getAttribute("data-page") || "");
                                    var pid = String(modalEl.getAttribute("data-pid") || "");
                                    var hostSection = String(modalEl.getAttribute("data-host-section") || "");

                                    var err = document.getElementById("mgw-admin-item-error");
                                    var setErr = function (msg) {
                                        if (!err) return;
                                        err.textContent = String(msg || "Failed");
                                        err.classList.add("show");
                                    };
                                    if (err) { err.textContent = ""; err.classList.remove("show"); }

                                    var idEl = document.getElementById("mgw-admin-item-id");
                                    var nameEl = document.getElementById("mgw-admin-item-name");
                                    var subEl = document.getElementById("mgw-admin-item-subname");
                                    var imgEl = document.getElementById("mgw-admin-item-image");
                                    var priceEl = document.getElementById("mgw-admin-item-price");
                                    var origEl = document.getElementById("mgw-admin-item-original");

                                    if (mode === "add") {
                                        pid = String((idEl && idEl.value) || "").trim();
                                        if (!pid || !/^[0-9]{1,10}$/.test(pid)) return setErr("Enter a numeric Product ID");
                                    }
                                    if (!page) return setErr("Page is missing");

                                    var nm = String((nameEl && nameEl.value) || "").trim();
                                    var subn = String((subEl && subEl.value) || "").trim();
                                    var img = String((imgEl && imgEl.value) || "").trim();
                                    var price = String((priceEl && priceEl.value) || "").trim();
                                    var orig = String((origEl && origEl.value) || "").trim();

                                    if (!price || !isFinite(Number(price))) return setErr("Enter a valid price");
                                    if (orig && !isFinite(Number(orig))) return setErr("Original price must be a number");

                                    var payload = { name: nm, subname: subn, image_url: img, price: price, discount_price: orig, off_text: "" };
                                    var body = { page: page, products: (function () { var o = {}; o[String(pid)] = payload; return o; })() };

                                    fetch(prefix3 + "api/admin_set_game_config.php", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(body),
                                        cache: "no-store"
                                    }).then(function (r) { return r.json(); })
                                        .then(function (res2) {
                                            if (!res2 || !res2.success) throw new Error((res2 && res2.error) || "Save failed");
                                            var hostEl = null;
                                            if (hostSection) {
                                                hostEl = document.querySelector('#productsection .row-category[data-migewlito-section="' + hostSection + '"]') || document.querySelector('.row-category[data-migewlito-section="' + hostSection + '"]');
                                            }
                                            var found = findOrCreateProductCard3(pid, price, hostEl);
                                            if (!found.input || !found.label) return;
                                            found.input.setAttribute("data-price", price);
                                            var pEl = found.label.querySelector(".currency-idr1");
                                            if (pEl) pEl.textContent = price;
                                            if (nm) {
                                                var nEl = found.label.querySelector(".product-name");
                                                if (nEl) nEl.textContent = nm;
                                            }
                                            var sEl = found.label.querySelector(".product-subname");
                                            if (sEl) {
                                                if (subn) { sEl.textContent = subn; sEl.style.display = ""; } else { sEl.style.display = "none"; }
                                            }
                                            if (img) {
                                                var img2 = found.label.querySelector("img.icon-produk-games") || found.label.querySelector("img");
                                                if (img2) img2.setAttribute("src", img);
                                            }

                                            var pr = Number(String(price).replace(/[^\d.]/g, ""));
                                            var dr = orig ? Number(String(orig).replace(/[^\d.]/g, "")) : 0;
                                            if (!isFinite(pr)) pr = 0;
                                            if (!isFinite(dr)) dr = 0;

                                            var dEl = found.label.querySelector(".discount-price");
                                            if (dr > 0 && pr > 0 && dr > pr) {
                                                if (!dEl) {
                                                    var bottom = found.label.querySelector(".bottom-price");
                                                    if (bottom) {
                                                        dEl = document.createElement("span");
                                                        dEl.className = "currency-idr discount-price mb-0";
                                                        bottom.appendChild(dEl);
                                                    }
                                                }
                                                if (dEl) { dEl.textContent = String(dr); dEl.style.display = ""; }
                                            } else if (dEl) {
                                                dEl.style.display = "none";
                                            }

                                            var badge = computeOffText3(pr, dr);
                                            var rb = found.label.querySelector(".ribbon");
                                            var rbS = rb ? rb.querySelector("span") : null;
                                            if (badge) {
                                                if (!rb) {
                                                    rb = document.createElement("div");
                                                    rb.className = "ribbon";
                                                    rb.innerHTML = "<span></span>";
                                                    found.label.insertBefore(rb, found.label.firstChild);
                                                    rbS = rb.querySelector("span");
                                                }
                                                if (rbS) rbS.textContent = badge;
                                                rb.style.display = "";
                                            } else if (rb) {
                                                rb.style.display = "none";
                                            }

                                            refreshCurrencyBlocks3(found.label);
                                            try {
                                                if (window.bootstrap && bootstrap.Modal) {
                                                    var inst = bootstrap.Modal.getInstance(document.getElementById("migewlito-admin-item-modal"));
                                                    if (inst) inst.hide();
                                                } else if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                                                    window.jQuery("#migewlito-admin-item-modal").modal("hide");
                                                }
                                            } catch (e) {}
                                        })
                                        .catch(function (e2) { setErr(e2.message || "Save failed"); });
                                });
                            }
                        } catch (e) {}

                        try {
                            var delBtn = document.getElementById("mgw-admin-item-delete");
                            if (delBtn && !delBtn._migewlitoBound) {
                                delBtn._migewlitoBound = true;
                                delBtn.addEventListener("click", function () {
                                    var modalEl = document.getElementById("migewlito-admin-item-modal");
                                    if (!modalEl) return;
                                    var mode = String(modalEl.getAttribute("data-mode") || "edit");
                                    if (mode !== "edit") return;
                                    var page = String(modalEl.getAttribute("data-page") || "");
                                    var pid = String(modalEl.getAttribute("data-pid") || "");
                                    if (!page || !pid) return;

                                    swal3({
                                        title: "Delete item?",
                                        text: "This will remove it from the list (you can re-add later).",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Delete",
                                        cancelButtonText: "Cancel",
                                        confirmButtonColor: "var(--warna_3)",
                                        background: "#333333",
                                        color: "white"
                                    }).then(function (res2) {
                                        if (!res2 || !res2.isConfirmed) return;
                                        fetch(prefix3 + "api/admin_set_game_config.php", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ page: page, products: (function () { var o = {}; o[String(pid)] = { hidden: true }; return o; })() }),
                                            cache: "no-store"
                                        }).then(function (r) { return r.json(); })
                                            .then(function (resp) {
                                                if (!resp || !resp.success) throw new Error((resp && resp.error) || "Delete failed");
                                                var input = document.querySelector('input[name="product"][value="' + String(pid) + '"]') || document.getElementById("product-" + String(pid));
                                                var wrap = input && input.closest ? input.closest(".itemspro") : null;
                                                try { if (input) input.disabled = true; } catch (e) {}
                                                if (wrap) wrap.style.display = "none";
                                                try {
                                                    if (window.bootstrap && bootstrap.Modal) {
                                                        var inst = bootstrap.Modal.getInstance(document.getElementById("migewlito-admin-item-modal"));
                                                        if (inst) inst.hide();
                                                    } else if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
                                                        window.jQuery("#migewlito-admin-item-modal").modal("hide");
                                                    }
                                                } catch (e) {}
                                            })
                                            .catch(function (e3) {
                                                swal3({
                                                    title: "Failed",
                                                    text: e3.message || "Delete failed",
                                                    icon: "error",
                                                    confirmButtonText: "OK",
                                                    confirmButtonColor: "var(--warna_3)",
                                                    background: "#333333",
                                                    color: "white"
                                                });
                                            });
                                    });
                                });
                            }
                        } catch (e) {}

                        document.addEventListener("click", function (ev) {
                            if (!editOn) return;
                            var label = ev.target && ev.target.closest ? ev.target.closest('label[for^="product-"]') : null;
                            if (!label) return;
                            var input = null;
                            try {
                                var forId = label.getAttribute("for");
                                input = forId ? document.getElementById(forId) : null;
                            } catch (e) {}
                            if (!input || String(input.getAttribute("name") || "") !== "product") return;

                            ev.preventDefault();
                            ev.stopPropagation();

                            var pid = String(input.value || "").trim();
                            var nameEl = label.querySelector(".product-name");
                            var subEl = label.querySelector(".product-subname");
                            var title = (nameEl ? String(nameEl.textContent || "").trim() : "Item") + (subEl && String(subEl.textContent || "").trim() ? (" (" + String(subEl.textContent || "").trim() + ")") : "");

                            var priceVal = String(input.getAttribute("data-price") || "").trim();
                            if (!priceVal) {
                                var pEl = label.querySelector(".currency-idr1");
                                priceVal = pEl ? String(pEl.textContent || "").replace(/[^\d.]/g, "") : "";
                            }
                            var dEl = label.querySelector(".discount-price");
                            var discountVal = dEl ? String(dEl.textContent || "").replace(/[^\d.]/g, "") : "";
                            var imgEl0 = label.querySelector("img.icon-produk-games") || label.querySelector("img");
                            var imgVal = imgEl0 ? String(imgEl0.getAttribute("src") || "") : "";
                            var nameVal = nameEl ? String(nameEl.textContent || "").trim() : "";
                            var subVal = subEl ? String(subEl.textContent || "").trim() : "";

                            openAdminItemModal3("edit", {
                                page: rel,
                                pid: pid,
                                existing: {
                                    name: nameVal,
                                    subname: subVal,
                                    image_url: imgVal,
                                    price: priceVal,
                                    discount_price: discountVal
                                }
                            });
                        }, true);
                    })
                    .catch(function () {});
            } catch (e) {}
        };

        injectNavUser3();
        ensureNoFlashStyles3();
        ensureAdminEditIndicatorStyles3();
        applyGameConfig3();
        injectAdminEditMode3();

        try {
            document.addEventListener("click", function (ev) {
                var t = ev.target && ev.target.closest ? ev.target.closest("[data-migewlito-auth]") : null;
                if (!t) return;
                ev.preventDefault();
                openAuthModal3("login");
            }, true);
        } catch (e) {}

        try {
            document.addEventListener("click", function (ev) {
                var t = ev.target && ev.target.closest ? ev.target.closest("[data-migewlito-mlbb]") : null;
                if (!t) return;
                ev.preventDefault();
                var userIdInput = document.querySelector('input[name="user_id"]');
                var zoneSel = document.querySelector('select[name="zone_id"]');
                var zoneInput = document.querySelector('input[name="zone_id"]');
                var user_id = userIdInput ? String(userIdInput.value || "").trim() : "";
                var zone_id = zoneSel && zoneSel.value ? String(zoneSel.value).trim() : (zoneInput ? String(zoneInput.value || "").trim() : "");
                openMlbbCheckerModal3({ user_id: user_id, zone_id: zone_id });
            }, true);
        } catch (e) {}

        try {
            if (path3.indexOf("/games/") !== -1 && /mobile-legends/i.test(path3)) {
                var titleEl = document.querySelector(".migewlito-inputdata-title");
                if (titleEl && !document.getElementById("migewlito-mlbb-btn")) {
                    var btn = document.createElement("button");
                    btn.type = "button";
                    btn.id = "migewlito-mlbb-btn";
                    btn.className = "btn btn-outline-light";
                    btn.textContent = "ID Checker";
                    btn.style.borderRadius = "12px";
                    btn.style.fontWeight = "800";
                    btn.style.padding = "6px 10px";
                    btn.style.fontSize = "12px";
                    titleEl.appendChild(btn);
                    btn.addEventListener("click", function () {
                        var userIdInput = document.querySelector('input[name="user_id"]');
                        var zoneSel = document.querySelector('select[name="zone_id"]');
                        var zoneInput = document.querySelector('input[name="zone_id"]');
                        var user_id = userIdInput ? String(userIdInput.value || "").trim() : "";
                        var zone_id = zoneSel && zoneSel.value ? String(zoneSel.value).trim() : (zoneInput ? String(zoneInput.value || "").trim() : "");
                        openMlbbCheckerModal3({ user_id: user_id, zone_id: zone_id });
                    });
                }

                ensureMlbbCheckerModal3();
                var checkBtn = document.getElementById("mgw-mlbb-check");
                if (checkBtn && !checkBtn._migewlitoBound) {
                    checkBtn._migewlitoBound = true;
                    checkBtn.addEventListener("click", function () {
                        var err = document.getElementById("mgw-mlbb-error");
                        var resBox = document.getElementById("mgw-mlbb-result");
                        var nickEl = document.getElementById("mgw-mlbb-nickname");
                        if (err) { err.textContent = ""; err.classList.remove("show"); }
                        if (resBox) resBox.style.display = "none";
                        if (nickEl) nickEl.textContent = "";

                        var u = String((document.getElementById("mgw-mlbb-user") || {}).value || "").trim();
                        var z = String((document.getElementById("mgw-mlbb-zone") || {}).value || "").trim();
                        if (!u || !z) {
                            if (err) { err.textContent = "User ID and Zone ID are required."; err.classList.add("show"); }
                            return;
                        }
                        fetch(prefix3 + "api/mlbb_id_checker.php?user_id=" + encodeURIComponent(u) + "&zone_id=" + encodeURIComponent(z), { cache: "no-store" })
                            .then(function (r) { return r.json(); })
                            .then(function (payload) {
                                var ok = payload && payload.success;
                                var nn = ok ? String(payload.nickname || "").trim() : "";
                                if (!ok || !nn) throw new Error("Nickname not found");
                                if (nickEl) nickEl.textContent = nn;
                                if (resBox) resBox.style.display = "";
                            })
                            .catch(function (e2) {
                                if (err) { err.textContent = e2.message || "Failed to check"; err.classList.add("show"); }
                            });
                    });
                }

                var applyBtn = document.getElementById("mgw-mlbb-apply");
                if (applyBtn && !applyBtn._migewlitoBound) {
                    applyBtn._migewlitoBound = true;
                    applyBtn.addEventListener("click", function () {
                        var u = String((document.getElementById("mgw-mlbb-user") || {}).value || "").trim();
                        var z = String((document.getElementById("mgw-mlbb-zone") || {}).value || "").trim();
                        var userIdInput = document.querySelector('input[name="user_id"]');
                        var zoneSel = document.querySelector('select[name="zone_id"]');
                        var zoneInput = document.querySelector('input[name="zone_id"]');
                        if (userIdInput) userIdInput.value = u;
                        if (zoneSel) zoneSel.value = z;
                        if (!zoneSel && zoneInput) zoneInput.value = z;
                        try { if (userIdInput) userIdInput.dispatchEvent(new Event("input")); } catch (e) {}
                        try { if (zoneSel) zoneSel.dispatchEvent(new Event("change")); } catch (e) {}
                        try { if (zoneInput) zoneInput.dispatchEvent(new Event("input")); } catch (e) {}
                    });
                }
            }
        } catch (e) {}

        try {
            if (!window._migewlitoAddSlotResizeBound) {
                window._migewlitoAddSlotResizeBound = true;
                window.addEventListener("resize", function () {
                    try {
                        var rows = document.querySelectorAll("#productsection .row-category");
                        rows.forEach(function (r) { syncAddSlotHeight3(r); });
                    } catch (e) {}
                });
            }
        } catch (e) {}

        var renderOrderBlock3 = function (order, containerEl) {
            if (!containerEl) return;
            var existing = document.getElementById("migewlito-order-summary");
            if (existing) existing.remove();

            var wrap = document.createElement("div");
            wrap.id = "migewlito-order-summary";
            wrap.className = "card mb-3";
            wrap.style.background = "var(--warna_2)";
            wrap.style.border = "1px solid rgba(255,255,255,0.08)";

            var body = document.createElement("div");
            body.className = "card-body";

            var statusText = order.status || "PENDING";
            var html = ""
                + "<h4 class=\"text-white mb-2\">Transaction</h4>"
                + "<div class=\"text-white\" style=\"opacity:.9;font-size:14px;line-height:1.5\">"
                + "<div><strong>Transaction Number:</strong> " + escapeHtml3(order.order_id) + "</div>"
                + "<div><strong>Status:</strong> " + escapeHtml3(statusText) + "</div>"
                + "<div><strong>Game:</strong> " + escapeHtml3(order.game || "") + "</div>"
                + "<div><strong>Nickname:</strong> " + escapeHtml3(order.nickname || "") + "</div>"
                + "<div><strong>Player ID:</strong> " + escapeHtml3(order.user_id || "") + "</div>"
                + "<div><strong>Server:</strong> " + escapeHtml3(order.zone_id || "") + "</div>"
                + "<div><strong>Product:</strong> " + escapeHtml3(order.product_name || "") + "</div>"
                + "<div><strong>Method:</strong> " + escapeHtml3(order.method_name || "") + "</div>"
                + "<div><strong>Total:</strong> " + escapeHtml3(order.total_display || "") + "</div>"
                + "</div>"
                + "<div class=\"mt-3 d-flex\" style=\"gap:10px;flex-wrap:wrap\">"
                + "<button type=\"button\" class=\"btn btn-primary\" id=\"migewlito-confirm-transaction\">Confirm Transaction</button>"
                + "</div>";

            body.innerHTML = html;
            wrap.appendChild(body);
            containerEl.prepend(wrap);

            var btn = document.getElementById("migewlito-confirm-transaction");
            if (btn) {
                btn.addEventListener("click", function () {
                    swal3({
                        title: "Confirm transaction?",
                        text: "This will mark the transaction as CONFIRMED locally.",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        confirmButtonColor: "var(--warna_3)",
                        background: "#333333",
                        color: "white"
                    }).then(function (res) {
                        if (!res || !res.isConfirmed) return;
                        order.status = "CONFIRMED";
                        order.updated_at = new Date().toISOString();
                        upsertOrder3(order);
                        renderOrderBlock3(order, containerEl);
                    });
                });
            }
        };

        var ensurePaymentDetailsStyles3 = function () {
            try {
                if (document.getElementById("migewlito-payment-details-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-payment-details-style";
                style.textContent = [
                    ".payment-box{background-color:var(--warna_7);border-radius:15px;padding:20px}",
                    ".payment-detailsi{background-color:var(--warna_7);padding:20px;border-radius:10px;display:flex;flex-direction:column;gap:1rem;justify-content:center}",
                    ".img-payment-games{width:60px;height:60px;border-radius:8px;object-fit:cover}",
                    ".paygames{font-weight:700;font-size:16px}",
                    ".paypro{font-size:14px;font-weight:500}",
                    ".price-pay{color:#fff;font-weight:700;font-size:16px}",
                    ".detail-teks-1{display:flex;justify-content:space-between;align-items:center;width:100%}",
                    ".border-top-dash{border-top:2px solid #fff;border-top-style:dashed}",
                    ".method-img-pay{width:62px;height:auto;object-fit:contain;background:#fff;padding:3px;border-radius:6px}",
                    ".status-transaksi{border-radius:16px;padding:3px 15px;font-weight:500}",
                    ".status-transaksi.Pending{color:#655123!important;background:#FDEBBE!important}",
                    ".status-transaksi.Confirmed{color:#0a4a40!important;background:#B8F1E9!important}",
                    ".status-transaksi.Failed{color:#7a2222!important;background:#f8d7da!important}",
                    ".payment-header{background-color:var(--warna_7);color:#fff;padding:16px;border-radius:10px;display:flex;justify-content:center;flex-direction:column}",
                    ".payment-header.Pending{background:#FDCF62;text-align:start;align-items:start}",
                    ".payment-header.Confirmed{background:#34D1B7;text-align:start;align-items:start}",
                    ".payment-header .one{font-size:18px;font-weight:700}",
                    ".payment-header .two{font-size:14px;font-weight:500}",
                    ".payment-header .two .timer{color:#C61F4D;background:#FDE9EF;border-radius:20px;padding:2px 5px 1px 5px;box-shadow:0px 5px 5px 0px rgb(0 0 0/24%);gap:4px}",
                    ".timer-contain{font-size:12px;font-weight:700;line-height:18px}",
                    ".separator-time{color:#F9B6C9!important;font-size:12px;font-weight:700;line-height:18px}",
                    ".text-end{text-align:end}",
                    ".text-progress{font-size:14px;font-weight:700}",
                    ".progessbar-bars{border:1px solid rgba(255,255,255,0.85);width:99%}",
                    ".progessbar-order{margin:30px 0px 5px 0;position:relative;min-height:30px}",
                    "@media (min-width:768px){.progessbar-order{margin:50px 0px 20px 0}}",
                    ".bg-circle_pay{background:#fff}",
                    ".breadcrumb{padding:0;background-color:transparent}",
                    ".breadcrumb-item+.breadcrumb-item::before{content:\" > \";font-size:13px;color:#fff}",
                    ".breadcrumb-item{font-size:13px;font-weight:500}",
                    ".product-detail-text{display:flex;justify-content:space-between;align-items:center}",
                    "@media (max-width:768px){.product-detail-text{display:grid;grid-template-columns:6.5rem 1fr;gap:1rem;align-items:center}}",
                    ".bayarcu{background:green;font-size:14px;padding-right:5px;padding-left:5px;font-weight:700;width:21rem;border:none}",
                    ".bayarcu:hover{background:#03ae03!important}",
                    "@media (max-width:576px){.bayarcu{width:100%;font-size:13px}}",
                    ".deskrips{background:var(--warna_7);border-radius:10px;padding:20px;font-weight:500}",
                    ".text-desk{font-size:14px!important;font-weight:400!important}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var ensureGameTopUpLayoutStyles3 = function () {
            try {
                if (document.getElementById("migewlito-game-topup-layout-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-game-topup-layout-style";
                style.textContent = [
                    "@media (min-width:576px){.congames>.container>.row{flex-direction:row-reverse}}",
                    ".migewlito-inputdata-block{margin-top:12px}",
                    ".migewlito-inputdata-title{font-size:14px;font-weight:700;margin:0 0 10px 0;display:flex;align-items:center;justify-content:space-between;gap:10px}",
                    ".migewlito-inputdata-content .form-row{margin-left:0;margin-right:0}",
                    ".migewlito-inputdata-content .form-row>.col,.migewlito-inputdata-content .form-row>[class*='col-']{padding-left:0;padding-right:0}",
                    ".migewlito-inputdata-content .form-row{display:flex;flex-direction:column;gap:10px}",
                    ".migewlito-inputdata-content .form-row>.col,.migewlito-inputdata-content .form-row>[class*='col-']{width:100%;max-width:100%;flex:0 0 auto}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var ensureMissingDetailsPopupStyles3 = function () {
            try {
                if (document.getElementById("migewlito-missing-details-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-missing-details-style";
                style.textContent = [
                    ".swal2-popup.migewlito-md-popup{border-radius:16px;padding:22px 22px 18px 22px;max-width:420px;width:420px}",
                    ".swal2-title.migewlito-md-title{font-size:22px;font-weight:800;margin:10px 0 2px 0}",
                    ".swal2-html-container.migewlito-md-html{margin:0;text-align:left}",
                    ".migewlito-md-sub{font-size:14px;opacity:.92;margin-top:6px}",
                    ".migewlito-md-list{display:flex;flex-direction:column;gap:10px;margin-top:14px}",
                    ".migewlito-md-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10)}",
                    ".migewlito-md-dot{width:10px;height:10px;border-radius:999px;background:var(--warna_3);flex:0 0 auto;box-shadow:0 0 0 4px rgba(84,204,196,0.15)}",
                    ".migewlito-md-text{font-size:14px;font-weight:700;letter-spacing:.1px}",
                    ".swal2-actions{margin-top:18px}",
                    ".swal2-confirm.migewlito-md-ok{border-radius:12px;padding:10px 16px;min-width:120px;font-weight:800}",
                    "@media (max-width:480px){.swal2-popup.migewlito-md-popup{width:auto;max-width:calc(100% - 24px);padding:18px 16px 14px 16px}.swal2-title.migewlito-md-title{font-size:20px}}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var ensureAdminEditPopupStyles3 = function () {
            try {
                if (document.getElementById("migewlito-admin-edit-style")) return;
                var style = document.createElement("style");
                style.id = "migewlito-admin-edit-style";
                style.textContent = [
                    ".swal2-popup.migewlito-edit-popup{border-radius:16px;padding:22px 22px 18px 22px;max-width:520px}",
                    ".swal2-title.migewlito-edit-title{font-size:22px;font-weight:900;margin:10px 0 6px 0}",
                    ".swal2-html-container.migewlito-edit-html{margin:0;text-align:left}",
                    ".migewlito-edit-head{display:flex;align-items:center;gap:12px;margin:6px 0 14px 0}",
                    ".migewlito-edit-img{width:44px;height:44px;border-radius:12px;object-fit:cover;background:rgba(255,255,255,0.08)}",
                    ".migewlito-edit-name{font-size:16px;font-weight:900;line-height:1.2}",
                    ".migewlito-edit-sub{font-size:12px;opacity:.75;margin-top:2px}",
                    ".migewlito-edit-field{margin-top:12px}",
                    ".migewlito-edit-label{font-size:12px;font-weight:800;opacity:.85;margin-bottom:6px}",
                    ".migewlito-edit-input{width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.06);color:#fff;padding:10px 12px;outline:none}",
                    ".migewlito-edit-input:focus{border-color:var(--warna_3);box-shadow:0 0 0 3px rgba(84,204,196,0.15)}",
                    ".migewlito-edit-hint{font-size:12px;opacity:.72;margin-top:10px}",
                    ".swal2-confirm.migewlito-edit-save{border-radius:12px;padding:10px 16px;min-width:130px;font-weight:900}",
                    ".swal2-cancel.migewlito-edit-cancel{border-radius:12px;padding:10px 16px;min-width:130px;font-weight:900;background:rgba(255,255,255,0.12)!important}",
                ].join("");
                document.head.appendChild(style);
            } catch (e) {}
        };

        var copyText3 = function (text) {
            var t = String(text || "");
            if (!t) return Promise.resolve(false);
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(t).then(function () { return true; }).catch(function () { return false; });
                }
            } catch (e) {}
            try {
                var ta = document.createElement("textarea");
                ta.value = t;
                ta.setAttribute("readonly", "readonly");
                ta.style.position = "fixed";
                ta.style.top = "-1000px";
                ta.style.left = "-1000px";
                document.body.appendChild(ta);
                ta.select();
                var ok = document.execCommand("copy");
                ta.remove();
                return Promise.resolve(!!ok);
            } catch (e) {
                return Promise.resolve(false);
            }
        };

        var formatPaymentTime3 = function (iso) {
            try {
                var d = iso ? new Date(iso) : new Date();
                if (isNaN(d.getTime())) d = new Date();
                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                var dd = String(d.getDate()).padStart(2, "0");
                var mm = months[d.getMonth()] || "";
                var yyyy = d.getFullYear();
                var hh = String(d.getHours()).padStart(2, "0");
                var min = String(d.getMinutes()).padStart(2, "0");
                return dd + " " + mm + " " + yyyy + ", " + hh + "." + min + " WIB";
            } catch (e) {
                return "";
            }
        };

        var startCountdown3 = function (timerEl, createdAtIso) {
            try {
                if (!timerEl) return;
                var start = createdAtIso ? new Date(createdAtIso) : new Date();
                if (isNaN(start.getTime())) start = new Date();
                var expiresAt = new Date(start.getTime() + 24 * 60 * 60 * 1000);

                var parts = {
                    h: timerEl.querySelector(".timer-contain[data-part='h']"),
                    m: timerEl.querySelector(".timer-contain[data-part='m']"),
                    s: timerEl.querySelector(".timer-contain[data-part='s']"),
                };

                var tick = function () {
                    var ms = expiresAt.getTime() - Date.now();
                    if (!isFinite(ms)) ms = 0;
                    if (ms < 0) ms = 0;
                    var totalSec = Math.floor(ms / 1000);
                    var h = Math.floor(totalSec / 3600);
                    var m = Math.floor((totalSec % 3600) / 60);
                    var s = totalSec % 60;
                    if (parts.h) parts.h.textContent = String(h).padStart(2, "0");
                    if (parts.m) parts.m.textContent = String(m).padStart(2, "0");
                    if (parts.s) parts.s.textContent = String(s).padStart(2, "0");
                };

                tick();
                if (timerEl._migewlitoTimer) clearInterval(timerEl._migewlitoTimer);
                timerEl._migewlitoTimer = setInterval(tick, 1000);
            } catch (e) {}
        };

        var renderPaymentDetailsPage3 = function (order) {
            try {
                if (!order || !order.order_id) return false;
                ensurePaymentDetailsStyles3();

                var path = (window.location && window.location.pathname) ? window.location.pathname : "";
                if (path.indexOf("payment.html") === -1) return false;

                var root = document.querySelector(".mb-0[style*=\"min-height\"]") || document.querySelector(".mb-0") || document.querySelector("main") || document.body;
                if (!root) return false;

                var status = String(order.status || "PENDING").toUpperCase();
                var statusClass = status === "CONFIRMED" ? "Confirmed" : (status === "FAILED" ? "Failed" : "Pending");
                var statusText = statusClass === "Confirmed" ? "Confirmed" : (statusClass === "Failed" ? "Failed" : "Not Processed");
                var headerText = statusClass === "Confirmed" ? "Payment received" : "Please complete your payment";
                var headerSub = statusClass === "Confirmed" ? "Thank you, we are processing your order" : "Complete payment in";

                var gameName = String(order.game || "").trim() || "Game";
                var productName = String(order.product_name || "").trim() || "-";
                var nickname = String(order.nickname || "").trim() || "-";
                var player = String(order.user_id || "").trim();
                var server = String(order.zone_id || "").trim();
                var userIdLabel = player ? (server ? (player + " (" + server + ")") : player) : "-";
                var amount = (order.quantity != null && String(order.quantity).trim() !== "") ? String(order.quantity) : "1";
                var email = String(order.email_order || "").trim() || "-";
                var wa = String(order.wa || "").trim() || "-";
                var methodName = String(order.method_name || "").trim() || "-";
                var totalPayment = String(order.total_display || "").trim() || "-";
                var basePrice = String(order.total_transaction_display || "").trim() || String(order.total_display || "").trim() || "-";
                var txTime = formatPaymentTime3(order.created_at);
                var gameHref = prefix3 + "index.html";
                try {
                    var src = String(order.source_path || "");
                    var m = src.match(/\/gogogo\.com\/en-ph\/(games\/[^\s?]+\.html)/i);
                    if (m && m[1]) gameHref = prefix3 + m[1].replace(/\\/g, "/");
                } catch (e) {}

                try { document.title = "Payment Details - The most affordable top-up platform for Mobile Legends and many more games!"; } catch (e) {}

                var methodImgSrc = prefix3 + "assets/images/method/spoy.png";

                root.innerHTML = ""
                    + "<div class=\"relative\">"
                    + "<div class=\"container\" style=\"max-width:700px;margin-top:7rem\">"
                    + "<nav aria-label=\"breadcrumb\">"
                    + "<ol class=\"breadcrumb\">"
                    + "<li class=\"breadcrumb-item\"><a href=\"" + escapeHtml3(prefix3 + "index.html") + "\" style=\"color:var(--warna_3)\">Home</a></li>"
                    + "<li class=\"breadcrumb-item\"><a href=\"" + escapeHtml3(gameHref) + "\">" + escapeHtml3(gameName) + "</a></li>"
                    + "<li class=\"breadcrumb-item\"><a href=\"" + escapeHtml3(prefix3 + "payment.html?order_id=" + encodeURIComponent(order.order_id)) + "\">" + escapeHtml3(order.order_id) + "</a></li>"
                    + "</ol>"
                    + "</nav>"
                    + "<div class=\"progessbar-order\">"
                    + "<div class=\"progessbar-bars\"></div>"
                    + "<div class=\"d-flex w-100\" style=\"position:absolute;top:-12px\">"
                    + "<div class=\"flex-fill text-start d-flex justify-content-start\">"
                    + "<div class=\"d-flex align-items-center px-1\" style=\"background:var(--warna_6)\">"
                    + "<span class=\"rounded-circle text-progress text-dark bg-circle_pay d-inline-flex justify-content-center align-items-center circle-pay-1\" style=\"width:25px;height:25px;background:var(--warna_3)\">1</span>"
                    + "<span class=\"px-1\">Pay</span>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"flex-fill text-center d-flex justify-content-center\">"
                    + "<div class=\"d-flex align-items-center px-1\" style=\"background:var(--warna_6)\">"
                    + "<span class=\"rounded-circle text-progress text-dark bg-circle_pay d-inline-flex justify-content-center align-items-center circle-pay-2\" style=\"width:25px;height:25px\">2</span>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"flex-fill text-end d-flex justify-content-end\">"
                    + "<div class=\"d-flex align-items-center px-1\" style=\"background:var(--warna_6)\">"
                    + "<span class=\"rounded-circle text-progress text-dark bg-circle_pay d-inline-flex justify-content-center align-items-center circle-pay-3\" style=\"width:25px;height:25px\">3</span>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"payment-header " + escapeHtml3(statusClass) + "\">"
                    + "<span class=\"one text-dark\">" + escapeHtml3(headerText) + "</span>"
                    + "<span class=\"two text-dark d-flex flex-row align-items-center gap-2\">"
                    + escapeHtml3(headerSub)
                    + (statusClass === "Pending"
                        ? (" <span class=\"timer ml-1 d-flex flex-row align-items-center justify-content-center\" id=\"timer\">"
                            + "<span class=\"mb-0 timer-contain\" data-part=\"h\">00</span><span class=\"separator-time\">:</span>"
                            + "<span class=\"mb-0 timer-contain\" data-part=\"m\">00</span><span class=\"separator-time\">:</span>"
                            + "<span class=\"mb-0 timer-contain\" data-part=\"s\">00</span>"
                            + "</span>")
                        : "")
                    + "</span>"
                    + "</div>"
                    + "<div class=\"payment-box mt-3 d-flex flex-column gap-4\">"
                    + "<div class=\"detail-1\">"
                    + "<div class=\"d-flex flex-row align-items-center justify-content-center gap-3\">"
                    + "<img alt=\"" + escapeHtml3(gameName) + "\" src=\"" + escapeHtml3(prefix3 + "assets/images/logo.png") + "\" class=\"img-payment-games\" loading=\"lazy\">"
                    + "<div class=\"d-flex flex-column align-items-start justify-content-center\">"
                    + "<span class=\"paygames\">" + escapeHtml3(productName) + "</span>"
                    + "<p class=\"paypro mb-0\">" + escapeHtml3(gameName) + "</p>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"detail-teks-1\">"
                    + "<span class=\"paypro\">Total Payment</span>"
                    + "<div class=\"price-pay\">" + escapeHtml3(totalPayment) + "</div>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"border-top-dash\"></div>"
                    + "<div class=\"d-none d-md-flex flex-row justify-content-center align-items-center gap-2\">"
                    + "<span>Pay with</span>"
                    + "<div class=\"d-flex flex-row align-items-center gap-2\">"
                    + "<img src=\"" + escapeHtml3(methodImgSrc) + "\" class=\"method-img-pay\" width=\"62\" height=\"62\" alt=\"" + escapeHtml3(methodName) + "\">"
                    + "<span class=\"text-nowrap font-bold\">" + escapeHtml3(methodName) + "</span>"
                    + "</div>"
                    + "</div>"
                    + "<div>"
                    + "<div class=\"d-flex flex-column justify-content-between align-items-center gap-3\">"
                    + "<span class=\"text-center\">Make Payment</span>"
                    + "<button class=\"space-x-232 bayarcu inline-flex items-center justify-center rounded-md py-2 text-sm font-medium text-white duration-300\" type=\"button\" id=\"migewlito-make-payment\">"
                    + "<span>Click here to make payment</span>"
                    + "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" aria-hidden=\"true\" class=\"h-4 w-4\">"
                    + "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25\"></path>"
                    + "</svg>"
                    + "</button>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"d-flex flex-row justify-content-center align-items-center gap-2\">"
                    + "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"
                    + "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.3306 3.03209C12.1824 2.98932 12.0248 2.9893 11.8766 3.03204L4.58308 5.13427C4.23754 5.23387 4 5.54672 4 5.90223V10.2114C4 15.0883 7.16027 19.4178 11.8451 20.959C12.0113 21.0137 12.1909 21.0137 12.3571 20.959C17.0407 19.4177 20.2 15.0891 20.2 10.2134V5.90223C20.2 5.5468 19.9626 5.23399 19.6171 5.13433L12.3306 3.03209ZM17.2364 9.9364C17.5879 9.58492 17.5879 9.01508 17.2364 8.6636C16.8849 8.31213 16.3151 8.31213 15.9636 8.6636L11.2 13.4272L9.13638 11.3636C8.78491 11.0121 8.21506 11.0121 7.86359 11.3636C7.51212 11.7151 7.51212 12.2849 7.86359 12.6364L11.2 15.9728L17.2364 9.9364Z\" fill=\"#34D1B7\"></path>"
                    + "</svg>"
                    + "<span>Your transaction is secure!</span>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"payment-detailsi mt-3\">"
                    + "<div class=\"d-flex justify-content-between align-items-center\">"
                    + "<span>Transaction Status</span>"
                    + "<span class=\"status-transaksi " + escapeHtml3(statusClass) + "\">" + escapeHtml3(statusText) + "</span>"
                    + "</div>"
                    + "<div class=\"d-flex justify-content-between align-items-center\">"
                    + "<span>Transaction Description</span>"
                    + "</div>"
                    + "<div class=\"d-flex justify-content-between align-items-center\">"
                    + "<span>Transaction ID</span>"
                    + "<button type=\"button\" class=\"d-flex flex-row align-items-center bg-transparent text-white gap-2 p-0\" id=\"migewlito-copy-tx\" data-clipboard-text=\"" + escapeHtml3(order.order_id) + "\">"
                    + "<div class=\"truncate md:w-auto md:max-w-none font-bold\">" + escapeHtml3(order.order_id) + "</div>"
                    + "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"
                    + "<path d=\"M9.27 5.71C7.08333 5.43 5.98333 5.43 3.79667 5.71C3.03667 5.80333 2.30333 6.53667 2.21 7.29667C1.93 9.48333 1.93 10.5833 2.21 12.77C2.31 13.5233 3.04333 14.2633 3.79667 14.3567C5.98333 14.6367 7.08333 14.6367 9.27 14.3567C10.0233 14.2567 10.7633 13.5233 10.8567 12.77C11.1367 10.5833 11.1367 9.48333 10.8567 7.29667C10.7567 6.53667 10.0233 5.80333 9.27 5.71Z\" stroke=\"#FFBD2B\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>"
                    + "<path d=\"M6.74662 9.1665C6.89458 9.16651 7.03919 9.21048 7.16211 9.29282C7.28503 9.37516 7.38072 9.49217 7.43702 9.62899C7.49332 9.76581 7.5077 9.91628 7.47833 10.0613C7.44897 10.2063 7.37718 10.3393 7.27208 10.4434C7.16698 10.5476 7.03331 10.6181 6.88803 10.6462C6.74276 10.6742 6.59244 10.6584 6.45614 10.6009C6.31984 10.5433 6.20372 10.4465 6.12251 10.3229C6.04131 10.1992 5.99867 10.0542 6.00003 9.90624C6.01977 9.71564 6.10495 9.53777 6.24107 9.4029C6.3772 9.26803 6.55585 9.18449 6.74662 9.1665Z\" fill=\"#FFBD2B\"></path>"
                    + "<path d=\"M11.07 11.49C11.4367 11.4567 11.83 11.41 12.27 11.3567C13.0233 11.2567 13.7633 10.5233 13.8567 9.77C14.1367 7.58333 14.1367 6.48333 13.8567 4.29667C13.7567 3.54333 13.0233 2.80333 12.27 2.71C10.0833 2.43 8.98334 2.43 6.79667 2.71C6.03667 2.80333 5.30334 3.53667 5.21001 4.29667C5.15001 4.76333 5.10334 5.17667 5.07001 5.57\" stroke=\"#FFBD2B\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>"
                    + "</svg>"
                    + "</button>"
                    + "</div>"
                    + "<div class=\"d-flex justify-content-between align-items-center\">"
                    + "<span>Transaction Time</span>"
                    + "<span class=\"font-bold\">" + escapeHtml3(txTime) + "</span>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"payment-detailsi mt-3 product-detailsi w-100\">"
                    + "<div class=\"d-flex justify-content-start align-items-center\">"
                    + "<h5 class=\"mb-0\">Product Detail</h5>"
                    + "</div>"
                    + "<div class=\"d-flex flex-column justify-content-between w-100 gap-3\">"
                    + "<div class=\"product-detail-text\"><span>Product</span><span class=\"text-end\">" + escapeHtml3(productName) + "</span></div>"
                    + "<div class=\"product-detail-text\"><span>Price</span><span class=\"text-end\">" + escapeHtml3(basePrice) + "</span></div>"
                    + "<div class=\"product-detail-text\"><span>Nickname</span><span class=\"text-end\">" + escapeHtml3(nickname) + "</span></div>"
                    + "<div class=\"product-detail-text\"><span>User ID</span><span class=\"text-end\"><p class=\"mb-0\">" + escapeHtml3(userIdLabel) + "</p></span></div>"
                    + "<div class=\"product-detail-text\"><span>Whatsapp No.</span><span class=\"text-end\">" + escapeHtml3(wa) + "</span></div>"
                    + "<div class=\"product-detail-text\"><span>Amount</span><span class=\"text-end\">" + escapeHtml3(amount) + "</span></div>"
                    + "<div class=\"product-detail-text\"><span>Email</span><span class=\"text-end\">" + escapeHtml3(email) + "</span></div>"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"deskrips d-flex flex-column gap-3 my-3\">"
                    + "<div class=\"d-flex justify-content-start align-items-center\"><h5 class=\"mb-2\">Additional Information</h5></div>"
                    + "<div class=\"text-desk text-white\"><p><strong>Payment locally is not connected yet.</strong><br>Layout matches Gogogo, but the payment gateway is disabled on localhost.</p></div>"
                    + "</div>"
                    + "</div>"
                    + "</div>";

                var timer = document.getElementById("timer");
                if (timer) startCountdown3(timer, order.created_at);

                var copyBtn = document.getElementById("migewlito-copy-tx");
                if (copyBtn) {
                    copyBtn.addEventListener("click", function () {
                        copyText3(order.order_id).then(function (ok) {
                            if (!ok) return;
                            swal3({
                                title: "Copied",
                                text: "Transaction ID copied.",
                                icon: "success",
                                confirmButtonText: "OK",
                                confirmButtonColor: "var(--warna_3)",
                                background: "#333333",
                                color: "white"
                            });
                        });
                    });
                }

                var payBtn = document.getElementById("migewlito-make-payment");
                if (payBtn) {
                    payBtn.addEventListener("click", function () {
                        swal3({
                            title: "Make Payment",
                            text: "Payment gateway is not available locally yet.",
                            icon: "info",
                            confirmButtonText: "OK",
                            confirmButtonColor: "var(--warna_3)",
                            background: "#333333",
                            color: "white"
                        });
                    });
                }

                return true;
            } catch (e) {
                return false;
            }
        };

        var removeSectionWithDividers3 = function (el) {
            try {
                if (!el) return;
                var prev = el.previousElementSibling;
                var next = el.nextElementSibling;
                if (prev && prev.classList && prev.classList.contains("devider")) prev.remove();
                if (next && next.classList && next.classList.contains("devider")) next.remove();
                el.remove();
            } catch (e) {}
        };

        var tweakGameTopUpLayout3 = function () {
            try {
                ensureGameTopUpLayoutStyles3();

                var banners = document.querySelectorAll(".banner-games-images-top");
                banners.forEach(function (b) { try { b.remove(); } catch (e) {} });

                var byId = function (id) {
                    try {
                        var els = document.querySelectorAll("#" + id);
                        els.forEach(function (el) { removeSectionWithDividers3(el); });
                    } catch (e) {}
                };
                byId("voucherandwa1");
                byId("scrollToKontak");

                try {
                    var voucherInput = document.querySelector('input[name="voucher"]');
                    if (voucherInput) removeSectionWithDividers3(voucherInput.closest(".section") || voucherInput.closest("div.section"));
                } catch (e) {}
                try {
                    var waInput = document.querySelector('input[name="wa"]');
                    if (waInput) removeSectionWithDividers3(waInput.closest(".section") || waInput.closest("div.section"));
                } catch (e) {}

                var descContainer = document.querySelector(".desc-container");
                if (!descContainer) return;

                var inputSection = document.querySelector(".section#inputdata");
                if (!inputSection) {
                    var anyInput = document.querySelector('input[name="user_id"], input[name="zone_id"]');
                    if (anyInput) inputSection = anyInput.closest(".section") || anyInput.closest("div.section");
                }
                if (!inputSection) return;

                var title = "";
                try {
                    var t = inputSection.querySelector(".title-card-gem");
                    title = t ? String(t.textContent || "").trim() : "";
                } catch (e) {}
                if (!title) title = "Enter User ID";

                var body = inputSection.querySelector(".card-body.pt-0") || inputSection.querySelector(".card-body.padding-left-sec-2") || inputSection;
                var moved = document.createDocumentFragment();
                try {
                    while (body.firstChild) moved.appendChild(body.firstChild);
                } catch (e) {}

                var block = document.createElement("div");
                block.className = "migewlito-inputdata-block";
                var titleEl = document.createElement("div");
                titleEl.className = "migewlito-inputdata-title";
                titleEl.textContent = title;
                var contentEl = document.createElement("div");
                contentEl.className = "migewlito-inputdata-content";
                contentEl.appendChild(moved);
                try {
                    var helper = contentEl.querySelectorAll(".inputdesk");
                    helper.forEach(function (n) { try { n.remove(); } catch (e) {} });
                } catch (e) {}
                block.appendChild(titleEl);
                block.appendChild(contentEl);

                var insertBeforeEl = descContainer.children && descContainer.children.length > 1 ? descContainer.children[1] : null;
                descContainer.insertBefore(block, insertBeforeEl);

                removeSectionWithDividers3(inputSection);
            } catch (e) {}
        };

        if (path3.indexOf("/games/") !== -1) {
            tweakGameTopUpLayout3();
        }

        if (isLocal3) {
            var formatCurrency3 = function (n) {
                var num = Number(n);
                if (!isFinite(num)) num = 0;
                try {
                    return "₱ " + num.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } catch (e) {
                    return "₱ " + String(num);
                }
            };

            var nicknameKey3 = function (user_id, zone_id) {
                return "migewlito_nickname:" + String(user_id || "") + ":" + String(zone_id || "");
            };

            var getNickname3 = function (user_id, zone_id) {
                try {
                    return localStorage.getItem(nicknameKey3(user_id, zone_id)) || "";
                } catch (e) {
                    return "";
                }
            };

            var setNickname3 = function (user_id, zone_id, nickname) {
                try {
                    localStorage.setItem(nicknameKey3(user_id, zone_id), String(nickname || ""));
                } catch (e) {}
            };

            var enableMethods3 = function () {
                try {
                    var inputs = document.querySelectorAll('input[name="method"]');
                    inputs.forEach(function (i) {
                        i.disabled = false;
                        var label = document.querySelector('label[for="' + i.id + '"]');
                        if (label) label.classList.remove("method-disabled");
                    });
                    var firstEnabled = document.querySelector('input[name="method"]:not([disabled])');
                    var checked = document.querySelector('input[name="method"]:checked');
                    if (!checked && firstEnabled) firstEnabled.checked = true;
                } catch (e) {}
            };

            var localGetPrice3 = function (id) {
                try {
                    var qtyEl = document.getElementById("quantity") || document.querySelector('input[name="quantity"]');
                    var qty = qtyEl ? Number(qtyEl.value) : 1;
                    if (!qty || qty < 1) qty = 1;

                    var productEl = null;
                    if (id != null) productEl = document.querySelector('input[name="product"][value="' + id + '"]');
                    if (!productEl) productEl = document.querySelector('input[name="product"]:checked');
                    if (!productEl) return;

                    var base = 0;
                    if (productEl.dataset && productEl.dataset.price) base = Number(String(productEl.dataset.price).replace(/,/g, ""));
                    if (!isFinite(base) || !base) {
                        var priceTextEl = productEl.closest("label") ? productEl.closest("label").querySelector(".currency-idr1") : null;
                        if (priceTextEl) base = Number(String(priceTextEl.textContent || "").replace(/,/g, ""));
                    }
                    if (!isFinite(base) || !base) base = 0;

                    var total = base * qty;
                    var methodInputs = document.querySelectorAll('input[name="method"]');
                    methodInputs.forEach(function (m) {
                        m.disabled = false;
                        if (m.dataset) {
                            m.dataset.basePrice = String(total);
                            m.dataset.feePersen = "0";
                            m.dataset.feeNominal = "0";
                        }
                        var lbl = document.querySelector('label[for="' + m.id + '"]');
                        if (lbl) lbl.classList.remove("method-disabled");
                        var box = document.getElementById("price-method-" + m.value);
                        if (box) box.textContent = formatCurrency3(total);
                    });

                    try {
                        var selectedPriceEl = document.getElementById("selectedPrice");
                        if (selectedPriceEl) {
                            selectedPriceEl.textContent = formatCurrency3(total);
                            selectedPriceEl.dataset.baseValue = String(base);
                            selectedPriceEl.dataset.discount = "0";
                            selectedPriceEl.dataset.fee = "0";
                            selectedPriceEl.dataset.value = String(total);
                        }
                    } catch (e) {}

                    if (typeof window.updateOrderSummary === "function") window.updateOrderSummary();
                    enableMethods3();
                } catch (e) {}
            };

            try {
                window.get_price = function (id) { localGetPrice3(id); };
            } catch (e) {}

            try {
                window.cek_voucher = function () {
                    swal3({
                        title: "Voucher",
                        text: "Voucher validation is not available locally yet.",
                        icon: "info",
                        confirmButtonText: "OK",
                        confirmButtonColor: "var(--warna_3)",
                        background: "#333333",
                        color: "white"
                    });
                };
            } catch (e) {}

            enableMethods3();

            try {
                var scheduleNicknameLookup3 = function () {
                    var userIdInput = document.querySelector('input[name="user_id"]');
                    if (!userIdInput) return;

                    var zoneSel = document.querySelector('select[name="zone_id"]');
                    var zoneInput = document.querySelector('input[name="zone_id"]');

                    var timer = null;
                    var lastKey = "";

                    var trigger = function () {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            var user_id = String((userIdInput && userIdInput.value) || "").trim();
                            var zone_id = "";
                            if (zoneSel && zoneSel.value) zone_id = String(zoneSel.value).trim();
                            if (!zone_id && zoneInput) zone_id = String(zoneInput.value || "").trim();
                            if (!user_id || !zone_id) return;

                            var key = user_id + ":" + zone_id;
                            if (key === lastKey) return;
                            lastKey = key;

                            fetch(prefix3 + "api/mlbb_id_checker.php?user_id=" + encodeURIComponent(user_id) + "&zone_id=" + encodeURIComponent(zone_id), { cache: "no-store" })
                                .then(function (r) { return r.json(); })
                                .then(function (payload) {
                                    var nn = payload && payload.success ? String(payload.nickname || "").trim() : "";
                                    if (nn && !isPlaceholderNickname3(nn)) setNickname3(user_id, zone_id, nn);
                                })
                                .catch(function () {});
                        }, 350);
                    };

                    userIdInput.addEventListener("input", trigger);
                    if (zoneSel) zoneSel.addEventListener("change", trigger);
                    if (zoneInput) zoneInput.addEventListener("input", trigger);
                    trigger();
                };

                scheduleNicknameLookup3();
            } catch (e) {}

            document.addEventListener("click", function (ev) {
                var buyBtn = ev.target && ev.target.closest ? ev.target.closest("#buyButton") : null;
                if (!buyBtn) return;
                ev.preventDefault();
                ev.stopPropagation();

                try { buyBtn.disabled = true; } catch (e) {}

                var userIdEl = document.querySelector("input[name=\"user_id\"]");
                var user_id = userIdEl ? String(userIdEl.value || "").trim() : "";

                var zoneSelEl = document.querySelector("select[name=\"zone_id\"]");
                var zone_id = zoneSelEl && zoneSelEl.value ? String(zoneSelEl.value).trim() : "";
                if (!zone_id) {
                    var zoneInputEl = document.querySelector("input[name=\"zone_id\"]");
                    zone_id = zoneInputEl ? String(zoneInputEl.value || "").trim() : "";
                }

                var productEl = document.querySelector("input[name=\"product\"]:checked");
                var methodEl = document.querySelector("input[name=\"method\"]:checked");
                var quantityEl = document.querySelector("input[name=\"quantity\"]");
                var quantity = quantityEl ? Number(quantityEl.value) : 0;

                var voucherEl = document.querySelector("input[name=\"voucher\"]");
                var voucher = voucherEl ? String(voucherEl.value || "").trim() : "";

                var emailEl = document.querySelector("input[name=\"email_order\"]");
                var email_order = emailEl ? String(emailEl.value || "").trim() : "";

                var waEl = document.querySelector("input[name=\"wa\"]");
                var wa = waEl ? String(waEl.value || "").trim() : "";

                var missing = [];
                if (!user_id) missing.push("User ID");
                if (!zone_id) missing.push("Zone ID / Server");
                if (zone_id && (zone_id.indexOf("Pilih") !== -1 || zone_id.indexOf("Masukkan") !== -1 || zone_id.indexOf("Masukan") !== -1)) missing.push("Valid server");
                if (!quantity || quantity < 1) missing.push("Quantity");
                if (!productEl) missing.push("Nominal / Package");
                if (!methodEl) missing.push("Payment method");
                if (!email_order) missing.push("Email address");

                if (missing.length) {
                    ensureMissingDetailsPopupStyles3();
                    var listHtml = "<div class=\"migewlito-md-sub\">Fill these fields to continue.</div>"
                        + "<div class=\"migewlito-md-list\">"
                        + missing.map(function (m) {
                            return "<div class=\"migewlito-md-item\"><span class=\"migewlito-md-dot\"></span><span class=\"migewlito-md-text\">" + escapeHtml3(m) + "</span></div>";
                        }).join("")
                        + "</div>";

                    swal3({
                        title: "Missing details",
                        html: listHtml,
                        text: "Please fill in the following before confirming:\n- " + missing.join("\n- "),
                        icon: "warning",
                        showCloseButton: true,
                        confirmButtonText: "Got it",
                        confirmButtonColor: "var(--warna_3)",
                        background: "#333333",
                        color: "white",
                        customClass: {
                            popup: "migewlito-md-popup",
                            title: "migewlito-md-title",
                            htmlContainer: "migewlito-md-html",
                            confirmButton: "migewlito-md-ok"
                        }
                    }).then(function () { try { buyBtn.disabled = false; } catch (e) {} });
                    return;
                }

                var selectedProductEl = document.getElementById("selectedProduct");
                var selectedMethodEl = document.getElementById("selectedMethod");
                var selectedPriceEl = document.getElementById("selectedPrice");

                var product_name = selectedProductEl ? String(selectedProductEl.textContent || "").trim() : "";
                var method_name = selectedMethodEl ? String(selectedMethodEl.textContent || "").trim() : "";
                method_name = method_name.replace(/^\s*,\s*/, "");
                var total_display = selectedPriceEl ? String(selectedPriceEl.textContent || "").trim() : "";
                var total_value = selectedPriceEl && selectedPriceEl.dataset ? String(selectedPriceEl.dataset.value || "") : "";

                var game = document.title ? document.title.split("-").slice(0, 2).join("-").trim() : "";

                var labelEl = null;
                try {
                    if (productEl) {
                        labelEl = productEl.closest ? productEl.closest("label") : null;
                        if (!labelEl && productEl.id) labelEl = document.querySelector('label[for="' + productEl.id + '"]');
                        if (!labelEl && productEl.nextElementSibling && String(productEl.nextElementSibling.tagName || "").toUpperCase() === "LABEL") {
                            labelEl = productEl.nextElementSibling;
                        }
                    }
                } catch (e) {}
                var productTitleEl = labelEl ? labelEl.querySelector(".product-name") : null;
                var productSubEl = labelEl ? labelEl.querySelector(".product-subname") : null;
                var nominal = productTitleEl ? String(productTitleEl.textContent || "").trim() : product_name;
                if (productSubEl && String(productSubEl.textContent || "").trim()) {
                    nominal = nominal + " ( " + String(productSubEl.textContent || "").trim() + " )";
                }

                var baseValue = selectedPriceEl && selectedPriceEl.dataset ? Number(selectedPriceEl.dataset.baseValue || "0") : 0;
                var discountValue = selectedPriceEl && selectedPriceEl.dataset ? Number(selectedPriceEl.dataset.discount || "0") : 0;
                var feeValue = selectedPriceEl && selectedPriceEl.dataset ? Number(selectedPriceEl.dataset.fee || "0") : 0;
                var finalValue = selectedPriceEl && selectedPriceEl.dataset ? Number(selectedPriceEl.dataset.value || "0") : 0;
                if (!isFinite(baseValue)) baseValue = 0;
                if (!isFinite(discountValue)) discountValue = 0;
                if (!isFinite(feeValue)) feeValue = 0;
                if (!isFinite(finalValue)) finalValue = 0;

                var totalTransaction = (baseValue * quantity) - discountValue;
                if (!isFinite(totalTransaction)) totalTransaction = 0;
                if (totalTransaction < 0) totalTransaction = 0;
                var totalPayment = finalValue;

                var modal = document.getElementById("modal-detail");
                var modalBody = modal ? modal.querySelector(".modal-body") : null;
                var alertText = "";
                try {
                    var pageAlert = document.querySelector('.text-alert');
                    alertText = pageAlert ? String(pageAlert.textContent || "").trim() : "";
                } catch (e) {}

                if (!modal || !modalBody) {
                    swal3({
                        title: "Confirm Transaction",
                        text: "Confirm Transaction modal is not available on this page.",
                        icon: "warning",
                        confirmButtonText: "OK",
                        confirmButtonColor: "var(--warna_3)",
                        background: "#333333",
                        color: "white"
                    }).then(function () { try { buyBtn.disabled = false; } catch (e) {} });
                    return;
                }

                var showModalWithNickname3 = function (nickname) {
                    try {
                        var modalAlert = modal.querySelector(".alert-custom-container");
                        var modalAlertText = modalAlert ? modalAlert.querySelector(".text-alert") : null;
                        if (modalAlert) modalAlert.style.display = alertText ? "" : "none";
                        if (modalAlertText) modalAlertText.textContent = alertText;
                    } catch (e) {}

                    var sepRowStyle = "border-top:2px dashed rgba(255,255,255,0.28)";
                    var bodyHtml = ""
                    + "<form action=\"\" method=\"POST\">"
                    + "<span class=\"detail-heading\">Product Detail</span>"
                    + "<table style=\"width:100%\">"
                    + "<tbody>"
                    + "<tr>"
                    + "<td class=\"text-left pt-2 pb-1\">Nickname</td>"
                    + "<td class=\"text-end pt-2 pb-1 font-bold\"><b>" + escapeHtml3((nickname && !isPlaceholderNickname3(nickname)) ? nickname : "-") + "</b></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td class=\"text-left pt-1 pb-1\">User ID</td>"
                    + "<td class=\"text-end pt-1 pb-1 font-bold\">" + escapeHtml3(user_id + " ( " + zone_id + " )") + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td class=\"text-left pt-1 pb-1\">Games</td>"
                    + "<td class=\"text-end pt-1 pb-1 font-bold\">" + escapeHtml3(game) + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td class=\"text-left pt-1 pb-1\">Nominal</td>"
                    + "<td class=\"text-end pt-1 pb-1 font-bold\">" + escapeHtml3(nominal) + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td class=\"text-left pt-1 pb-3\">Amount</td>"
                    + "<td class=\"text-end pt-1 pb-3 font-bold\">" + escapeHtml3(String(quantity)) + "</td>"
                    + "</tr>"
                    + "<tr class=\"detail-heading\" style=\"" + sepRowStyle + "\">"
                    + "<td class=\"text-left pt-3 pb-2\">Payment Detail</td>"
                    + "<td class=\"text-end pt-3 pb-2 font-bold\"></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td class=\"text-left pt-1 pb-3\">Payment Method</td>"
                    + "<td class=\"text-end pt-1 pb-3 font-bold\">" + escapeHtml3(method_name) + "</td>"
                    + "</tr>"
                    + "<tr class=\"detail-heading\" style=\"" + sepRowStyle + "\">"
                    + "<td class=\"text-left pt-3 pb-1\">Total Transaction</td>"
                    + "<td class=\"text-end pt-3 pb-1 font-bold\">" + escapeHtml3(formatCurrency3(totalTransaction)) + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td class=\"text-left pt-1 pb-1\">Total Payment</td>"
                    + "<td class=\"text-end pt-3 pb-1 font-bold\">" + escapeHtml3(formatCurrency3(totalPayment)) + "</td>"
                    + "</tr>"
                    + "</tbody>"
                    + "</table>"
                    + "<div class=\"text-center pt-3 w-100\">"
                    + "<button class=\"btn btn-primary w-100\" type=\"button\" id=\"migewlito-pay-now\">Pay Now</button>"
                    + "</div>"
                    + "</form>";

                    modalBody.innerHTML = bodyHtml;

                    try {
                        $("#modal-detail").off("hidden.bs.modal.migewlito");
                        $("#modal-detail").on("hidden.bs.modal.migewlito", function () {
                            try { buyBtn.disabled = false; } catch (e) {}
                        });
                    } catch (e) {}

                    try {
                        $("#modal-detail").modal("show");
                    } catch (e) {}

                    var payBtn = document.getElementById("migewlito-pay-now");
                    if (payBtn) {
                        payBtn.addEventListener("click", function () {
                        var order_id = "MGW-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
                        var order = {
                            order_id: order_id,
                            status: "PENDING",
                            game: game,
                            nickname: nickname || "",
                            user_id: user_id,
                            zone_id: zone_id,
                            product_id: String(productEl.value || ""),
                            product_name: nominal,
                            method_id: String(methodEl.value || ""),
                            method_name: method_name,
                            quantity: quantity,
                            voucher: voucher,
                            email_order: email_order,
                            wa: wa,
                            total_value: String(totalPayment),
                            total_display: formatCurrency3(totalPayment),
                            total_transaction_value: String(totalTransaction),
                            total_transaction_display: formatCurrency3(totalTransaction),
                            fee_value: String(feeValue),
                            discount_value: String(discountValue),
                            created_at: new Date().toISOString(),
                            source_path: path3
                        };

                        upsertOrder3(order);

                        try { $("#modal-detail").modal("hide"); } catch (e) {}
                        window.location.href = prefix3 + "payment.html?order_id=" + encodeURIComponent(order_id);
                    });
                    }
                };

                var nicknameStored = getNickname3(user_id, zone_id);
                var openModalWithResolvedNickname3 = function (nicknameMaybe) {
                    var nn0 = String(nicknameMaybe || "").trim();
                    if (nn0 && !isPlaceholderNickname3(nn0)) {
                        setNickname3(user_id, zone_id, nn0);
                        saveNicknameToServer3(user_id, zone_id, nn0);
                        showModalWithNickname3(nn0);
                        return;
                    }

                    var nnStored = String(getNickname3(user_id, zone_id) || "").trim();
                    if (nnStored && !isPlaceholderNickname3(nnStored)) {
                        showModalWithNickname3(nnStored);
                        return;
                    }
                    showModalWithNickname3("");
                };

                fetch(prefix3 + "api/mlbb_id_checker.php?user_id=" + encodeURIComponent(user_id) + "&zone_id=" + encodeURIComponent(zone_id), { cache: "no-store" })
                    .then(function (r) { return r.json(); })
                    .then(function (payload) {
                        var nn = payload && payload.success ? String(payload.nickname || "").trim() : "";
                        openModalWithResolvedNickname3(nn);
                    })
                    .catch(function () { openModalWithResolvedNickname3(""); });
            }, true);

            document.addEventListener("submit", function (ev) {
                var form = ev.target;
                if (!form || !form.querySelector) return;
                var orderInput = form.querySelector("input[name=\"order_id\"]");
                if (!orderInput) return;
                ev.preventDefault();
                var id = String(orderInput.value || "").trim();
                if (!id) return;

                var order = findOrder3(id);
                if (!order) {
                    swal3({
                        title: "Not found",
                        text: "This transaction number doesn't exist locally.",
                        icon: "error",
                        confirmButtonText: "OK",
                        confirmButtonColor: "var(--warna_3)",
                        background: "#333333",
                        color: "white"
                    });
                    return;
                }

                if (!renderPaymentDetailsPage3(order)) {
                    renderOrderBlock3(order, form.closest(".col-lg-9") || form.parentElement || document.body);
                }
            }, true);

            try {
                var params = new URLSearchParams(window.location.search || "");
                var q = params.get("order_id");
                if (q) {
                    var order2 = findOrder3(q);
                    var input2 = document.querySelector("input[name=\"order_id\"]");
                    if (input2) input2.value = q;
                    if (order2 && input2) {
                        if (!renderPaymentDetailsPage3(order2)) {
                            var host = input2.closest(".col-lg-9") || input2.parentElement || document.body;
                            renderOrderBlock3(order2, host);
                        }
                    }
                }
            } catch (e) {}
        }
    } catch (e) {}

//   $(document).ready(function () {
// 		 $("#respMenu").horizontalMenu({
// 			 resizeWidth: '1024', // Set the same in Media query
// 			 animationSpeed: 'fast', //slow, medium, fast
// 			 accoridonExpAll: false //Expands all the accordion menu on click
// 		 });
// 	 });

	 

// === toggle-menu js
$(".toggle-menu").on("click", function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });	 
	   
// === sidebar menu activation js

$(function() {
        for (var i = window.location, o = $(".sidebar-menu a").filter(function() {
            return this.href == i;
        }).addClass("active").parent().addClass("active"); ;) {
            if (!o.is("li")) break;
            o = o.parent().addClass("in").parent().addClass("active");
        }
    }), 	   
	   
/* sticky menu */

$(document).ready(function(){ 
    $(window).on("scroll", function(){ 
        if ($(this).scrollTop() > 60) { 
            $('.horizontal-menu').addClass('sticky-menu'); 
        } else { 
            $('.horizontal-menu').removeClass('sticky-menu'); 
        } 
    });

 });


/* Back To Top */

$(document).ready(function(){ 
    $(window).on("scroll", function(){ 
        if ($(this).scrollTop() > 300) { 
            $('.back-to-top').fadeIn(); 
        } else { 
            $('.back-to-top').fadeOut(); 
        } 
    }); 

    $('.back-to-top').on("click", function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 
});	   
	   

  // page loader

    $(window).on('load', function(){

     $('#pageloader-overlay').fadeOut(1000);

    })  
   
   
   
	$(function () {
	  $('[data-toggle="popover"]').popover()
	})


	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})


	
	
	
	
	
	

});
