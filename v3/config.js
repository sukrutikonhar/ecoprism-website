/**
 * Global Configuration File
 * Include this in ALL pages to automatically handle cache busting
 *
 * Usage in HTML:
 * <script src="/v3/config.js"></script>
 *
 * Then use absolute paths without version numbers:
 * <link rel="stylesheet" href="/v3/assets/css/main.css">
 * <script src="/v3/assets/js/components.js"></script>
 */

// Global configuration
window.ecoprismConfig = {
  // Version: Updates daily automatically (format: YYYYMMDD)
  // This ensures cache is busted once per day without manual updates
  version: (() => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  })(),

  // For development: uncomment to use timestamp (updates every second)
  // version: Date.now(),

  // Paths to assets (relative to site root)
  paths: {
    v3Assets: "/v3/assets",
    v3Components: "/v3/components",
    assets: "/assets",
  },
};

/**
 * Helper function to get versioned URL
 * Usage: getVersionedUrl('/v3/assets/css/main.css')
 * Returns: '/v3/assets/css/main.css?v=20250105'
 */
function getVersionedUrl(url) {
  if (!url) return url;
  // Don't add version to external URLs or URLs that already have version
  if (url.startsWith("http") || url.includes("?v=") || url.includes("cdn")) {
    return url;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${window.ecoprismConfig.version}`;
}

// Make it globally available
window.getVersionedUrl = getVersionedUrl;
