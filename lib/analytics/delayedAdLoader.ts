/**
 * Copied from sbmain: optimized AdSense + GA loader (non-blocking)
 */

declare global {
  interface Window {
    adsbygoogle: any[];
    __adsenseLoaded?: boolean;
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    __analyticsLoaded?: boolean;
    __gaInitialized?: boolean;
  }
}

const GA_MEASUREMENT_ID = "G-7JTM90LHN4";
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

interface LoadOptions {
  delayAfterLoad?: number;
  useIdleCallback?: boolean;
  minDelay?: number;
}

const DEFAULT_OPTIONS: LoadOptions = {
  delayAfterLoad: 3000,
  useIdleCallback: true,
  minDelay: 5000,
};

const ensureGtagStub = () => {
  if (typeof window === "undefined") return;

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  if (!window.__gaInitialized) {
    window.__gaInitialized = true;
    window.gtag("js", new Date());
  }
};

const loadGoogleAnalyticsScript = async (
  options: LoadOptions = {}
): Promise<void> => {
  if (typeof window === "undefined") return;

  ensureGtagStub();

  if (window.__analyticsLoaded) {
    return Promise.resolve();
  }

  const existingScript =
    document.querySelector<HTMLScriptElement>(`script[src="${GA_SCRIPT_SRC}"]`);
  if (existingScript) {
    window.__analyticsLoaded = true;
    return Promise.resolve();
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve) => {
    const appendScript = () => {
      try {
        const script = document.createElement("script");
        script.src = GA_SCRIPT_SRC;
        script.async = true;
        script.id = "ga-gtag";

        script.onload = () => {
          window.__analyticsLoaded = true;
          window.gtag?.("config", GA_MEASUREMENT_ID, { send_page_view: false });
          resolve();
        };

        script.onerror = () => {
          window.__analyticsLoaded = true;
          resolve();
        };

        const inject = () => {
          if ("requestIdleCallback" in window && opts.useIdleCallback) {
            window.requestIdleCallback(
              () => {
                document.head.appendChild(script);
              },
              { timeout: 2000 }
            );
          } else {
            document.head.appendChild(script);
          }
        };

        inject();
      } catch {
        window.__analyticsLoaded = true;
        resolve();
      }
    };

    const executeWithDelay = () => {
      const delay = Math.max(opts.delayAfterLoad || 0, opts.minDelay || 0);
      if (delay > 0) {
        setTimeout(appendScript, delay);
      } else {
        appendScript();
      }
    };

    if (document.readyState === "complete") {
      executeWithDelay();
    } else {
      window.addEventListener("load", executeWithDelay, { once: true });
    }
  });
};

export const trackGoogleAnalyticsPageview = (url: string) => {
  if (typeof window === "undefined") return;

  ensureGtagStub();
  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const initializeGoogleAnalyticsStub = () => {
  if (typeof window === "undefined") return;
  ensureGtagStub();
};

const loadAdSenseScript = async (
  options: LoadOptions = {}
): Promise<void> => {
  if (typeof window === "undefined") return;

  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (window.__adsenseLoaded) {
    return Promise.resolve();
  }

  const existingScript = document.querySelector(
    'script[src*="adsbygoogle.js"]'
  );
  if (existingScript) {
    window.__adsenseLoaded = true;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const loadScript = () => {
      try {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8490171049418387";
        script.async = true;
        script.crossOrigin = "anonymous";

        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }

        script.onload = () => {
          window.__adsenseLoaded = true;
          resolve();
        };

        script.onerror = () => {
          window.__adsenseLoaded = true;
          resolve();
        };

        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(
            () => {
              document.head.appendChild(script);
            },
            { timeout: 2000 }
          );
        } else {
          document.head.appendChild(script);
        }
      } catch {
        window.__adsenseLoaded = true;
        resolve();
      }
    };

    const waitForLoad = () => {
      if (document.readyState === "complete") {
        executeWithDelay();
      } else {
        window.addEventListener("load", executeWithDelay, { once: true });
      }
    };

    const executeWithDelay = () => {
      const delay = Math.max(opts.delayAfterLoad || 0, opts.minDelay || 0);

      if (opts.useIdleCallback && "requestIdleCallback" in window) {
        window.requestIdleCallback(
          () => {
            setTimeout(loadScript, delay);
          },
          { timeout: delay + 2000 }
        );
      } else {
        setTimeout(loadScript, delay);
      }
    };

    waitForLoad();
  });
};

export const loadGoogleScriptsDelayed = async (
  options: LoadOptions = {}
) => {
  if (typeof window === "undefined") return;

  try {
    await Promise.all([loadAdSenseScript(options), loadGoogleAnalyticsScript(options)]);
  } catch {
    // ignore
  }
};

export const loadGoogleScriptsOnInteraction = () => {
  if (typeof window === "undefined") return;

  let loaded = false;

  const loadScripts = () => {
    if (loaded) return;
    loaded = true;
    void loadAdSenseScript({ delayAfterLoad: 0, minDelay: 0 });
    void loadGoogleAnalyticsScript();

    window.removeEventListener("scroll", loadScripts);
    window.removeEventListener("click", loadScripts);
    window.removeEventListener("touchstart", loadScripts);
    window.removeEventListener("mousemove", loadScripts);
    window.removeEventListener("keydown", loadScripts);
  };

  window.addEventListener("scroll", loadScripts, {
    once: true,
    passive: true,
  } as AddEventListenerOptions);
  window.addEventListener("click", loadScripts, {
    once: true,
    passive: true,
  } as AddEventListenerOptions);
  window.addEventListener("touchstart", loadScripts, {
    once: true,
    passive: true,
  } as AddEventListenerOptions);
  window.addEventListener("mousemove", loadScripts, {
    once: true,
    passive: true,
  } as AddEventListenerOptions);
  window.addEventListener("keydown", loadScripts, {
    once: true,
    passive: true,
  } as AddEventListenerOptions);

  setTimeout(() => {
    if (!loaded) {
      loadScripts();
    }
  }, 8000);
};

