"use strict";

/*
 * NSF PWA support: service worker registration, install-prompt handling,
 * and a minimal offline indicator. Loaded on every page so the installed
 * app behaves consistently no matter which screen a guard is on.
 *
 * Exposes window.NSFInstall for pages (currently just index.html) that
 * want to render their own "Install Guard App" control.
 */

(function () {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/service-worker.js", { scope: "/" })
                .catch((err) => console.error("NSF: service worker registration failed", err));
        });
    }

    let deferredInstallPrompt = null;
    const INSTALLED_FLAG = "nsf_pwa_installed";

    const isStandalone = () =>
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true; // iOS Safari

    const isIOS = () =>
        /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        document.dispatchEvent(new CustomEvent("nsf:install-available"));
    });

    window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;
        try {
            localStorage.setItem(INSTALLED_FLAG, "true");
        } catch (e) {
            /* localStorage unavailable (private browsing etc.) -- non-fatal */
        }
        document.dispatchEvent(new CustomEvent("nsf:install-completed"));
    });

    window.NSFInstall = {
        isAvailable: () => !!deferredInstallPrompt,
        isInstalled: () => {
            if (isStandalone()) return true;
            try {
                return localStorage.getItem(INSTALLED_FLAG) === "true";
            } catch (e) {
                return false;
            }
        },
        isIOS,
        prompt: async () => {
            if (!deferredInstallPrompt) return { outcome: "unavailable" };
            deferredInstallPrompt.prompt();
            const choice = await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
            return choice;
        }
    };

    // Minimal, conservative offline indicator. Static assets may be cached
    // for a smoother offline reopen, but attendance/payroll data always
    // lives in localStorage on-device -- this banner exists only to tell
    // the guard their connection is down, never to imply an action
    // (like marking attendance) has synced anywhere.
    function setOfflineBanner(show) {
        let banner = document.getElementById("nsf-offline-banner");
        if (show) {
            if (!banner) {
                banner = document.createElement("div");
                banner.id = "nsf-offline-banner";
                banner.textContent = "You are offline. Showing the last saved version of this page.";
                banner.style.cssText =
                    "position:fixed;top:0;left:0;right:0;z-index:9999;background:#dc2626;color:#fff;" +
                    "text-align:center;padding:8px 12px;font-size:13px;font-family:'Poppins',sans-serif;" +
                    "font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,0.2);";
                (document.body || document.documentElement).appendChild(banner);
            }
        } else if (banner) {
            banner.remove();
        }
    }

    window.addEventListener("online", () => setOfflineBanner(false));
    window.addEventListener("offline", () => setOfflineBanner(true));
    document.addEventListener("DOMContentLoaded", () => setOfflineBanner(!navigator.onLine));
})();
