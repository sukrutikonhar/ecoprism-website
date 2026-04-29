/**
 * Automatic Cache Buster
 * Automatically appends timestamps to CSS/JS files to prevent caching issues
 * Usage: Include this script BEFORE any other scripts in your HTML
 */

(function () {
  // Get current date for daily cache busting (changes once per day)
  const today = new Date();
  const version = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;

  // For development: use timestamp for immediate updates (changes every second)
  // Uncomment the line below for development mode
  // const version = Date.now();

  // Store version globally
  window.CACHE_VERSION = version;

  /**
   * Automatically update all CSS and JS file URLs with cache buster
   */
  function applyCacheBuster() {
    // Update all stylesheet links
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http") && !href.includes("?v=")) {
        // Only update local files without existing version parameter
        link.setAttribute("href", `${href}?v=${version}`);
      }
    });

    // Update all script tags
    document.querySelectorAll("script[src]").forEach((script) => {
      const src = script.getAttribute("src");
      if (src && !src.startsWith("http") && !src.includes("?v=") && !src.includes("cdn")) {
        // Only update local files without existing version parameter
        const newSrc = `${src}?v=${version}`;
        // Create a new script element to replace the old one
        const newScript = document.createElement("script");
        newScript.src = newSrc;
        if (script.defer) newScript.defer = true;
        if (script.async) newScript.async = true;
        script.parentNode.replaceChild(newScript, script);
      }
    });
  }

  // Apply cache busting when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCacheBuster);
  } else {
    applyCacheBuster();
  }
})();

/**
 * Helper function to add cache buster to any URL
 * Usage: cacheBust('/path/to/file.css')
 * Returns: '/path/to/file.css?v=20250105'
 */
function cacheBust(url) {
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${window.CACHE_VERSION || Date.now()}`;
}
