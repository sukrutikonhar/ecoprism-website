# 🔄 Header & Footer Component Update Guide

## ✅ What Was Updated

### 1. **Updated Component Files**

Both header and footer components have been updated with all the latest changes from `index.html`:

#### **Header (`components/header.html`)**

✅ Removed "ESG Maturity Assessment" from Resources dropdown  
✅ Added `x-cloak` support to prevent menu flash  
✅ Fixed mobile menu Alpine.js conflicts  
✅ Updated with new logo paths and styling  
✅ Includes sticky scroll behavior

#### **Footer (`components/footer.html`)**

✅ New background color: `#21262c`  
✅ New text color: `#cacaca`  
✅ Added "Follow us on" section above social icons  
✅ Lighter yellow subscribe button (`bg-yellow-300`)  
✅ Proper padding and alignment  
✅ Hover effects turn white  
✅ Removed Privacy Policy from copyright line

---

## 📄 Updated Pages

The following pages now use cache busting version parameters (`?v=1.0.2`):

1. **index.html** ✅
2. **about.html** ✅
3. **about-us.html** ✅

---

## 🎨 How Pages Load Components

There are two methods used in the v2 folder:

### **Method 1: Component Loading Script (Recommended)**

Used in: `about.html`

```html
<!-- In the <head> -->
<link rel="stylesheet" href="assets/css/main.css?v=1.0.2" />
<link rel="stylesheet" href="assets/css/components.css?v=1.0.2" />

<!-- In the <body> -->
<!-- Header Component -->
<div id="header-container"></div>

<!-- Your page content here -->

<!-- Footer Component -->
<div id="footer-container"></div>

<!-- Load component scripts -->
<script src="assets/js/components.js?v=1.0.2"></script>
<script src="assets/js/utils.js?v=1.0.2"></script>

<script>
  document.addEventListener("DOMContentLoaded", async function () {
    // Load header component
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
      await window.loadComponentIntoElement("header", headerContainer);
    }

    // Load footer component
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      await window.loadComponentIntoElement("footer", footerContainer);
    }
  });
</script>
```

### **Method 2: Alpine x-component**

Used in: `about-us.html`

```html
<!-- Header Component -->
<div x-component="header"></div>

<!-- Your page content here -->

<!-- Footer Component -->
<div x-component="footer"></div>
```

---

## 🚀 How to Apply Updates to Other Pages

### **Step 1: Update CSS/JS Version Parameters**

Add version parameters to all your CSS and JS file references:

```html
<!-- OLD -->
<link rel="stylesheet" href="assets/css/main.css" />
<link rel="stylesheet" href="assets/css/components.css" />

<!-- NEW -->
<link rel="stylesheet" href="assets/css/main.css?v=1.0.2" />
<link rel="stylesheet" href="assets/css/components.css?v=1.0.2" />
```

```html
<!-- OLD -->
<script src="assets/js/components.js"></script>
<script src="assets/js/utils.js"></script>

<!-- NEW -->
<script src="assets/js/components.js?v=1.0.2"></script>
<script src="assets/js/utils.js?v=1.0.2"></script>
```

### **Step 2: Add x-cloak Styling**

Add this in the `<head>` section after Alpine.js:

```html
<!-- Alpine.js -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Alpine.js x-cloak styling to prevent menu flash -->
<style>
  [x-cloak] {
    display: none !important;
  }
</style>
```

### **Step 3: Update Component Loading**

Ensure your page loads the latest header and footer components using either Method 1 or Method 2 above.

---

## 🎯 What's Included in the Updates

### **Header Features:**

- ✅ Sticky navigation with scroll effect
- ✅ Desktop dropdown menus
- ✅ Mobile slide-out menu
- ✅ Logo with proper branding
- ✅ "Get Started" CTA button
- ✅ All navigation links updated

### **Footer Features:**

- ✅ Dark background (`#21262c`)
- ✅ Light gray text (`#cacaca`)
- ✅ Newsletter subscription form
- ✅ Light yellow subscribe button
- ✅ Social media icons with "Follow us on" title
- ✅ Company information
- ✅ Properly aligned links
- ✅ Responsive design

---

## 🔧 Troubleshooting

### **Components Not Loading?**

1. **Check Console for Errors:**

   - Open browser DevTools (F12)
   - Look at Console tab for any JavaScript errors

2. **Verify File Paths:**

   - Ensure `components/header.html` exists
   - Ensure `components/footer.html` exists
   - Check that paths are correct relative to your HTML file

3. **Check Alpine.js:**
   - Ensure Alpine.js is loaded before components
   - Check if `x-data`, `x-show`, etc. are working

### **Styling Issues?**

1. **Clear Cache:**

   - Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
   - Or use Incognito/Private window

2. **Check CSS Version:**

   - Verify `?v=1.0.2` is appended to CSS files
   - Increment version if needed: `?v=1.0.3`

3. **Check Tailwind Config:**
   - Ensure Tailwind CDN is loaded
   - Verify custom color configuration

### **Mobile Menu Not Working?**

1. **Check x-cloak:**

   - Ensure x-cloak style is in `<head>`
   - Verify `x-cloak` attribute on menu elements

2. **Check Alpine.js:**
   - Ensure Alpine.js loaded successfully
   - Check browser console for errors

---

## 📝 Version Control

**Current Version:** 1.0.2

**When to Update Version:**

- When you make CSS changes
- When you modify JavaScript files
- When header/footer components change

**How to Update Version:**

1. Change `?v=1.0.2` to `?v=1.0.3` in all file references
2. Clear server cache (SiteGround)
3. Clear browser cache
4. Test in incognito mode

---

## ✨ Benefits

✅ **Consistent Design** - All pages now use the same header/footer  
✅ **Easy Updates** - Change header/footer once, updates everywhere  
✅ **No Cache Issues** - Version parameters force fresh downloads  
✅ **Better Performance** - Proper cache control headers  
✅ **Mobile Friendly** - Responsive design works on all devices  
✅ **SEO Optimized** - Proper meta tags and structure

---

## 📞 Quick Reference

**Component Locations:**

- Header: `v2/components/header.html`
- Footer: `v2/components/footer.html`

**Pages Updated:**

- `v2/index.html` ✅
- `v2/about.html` ✅
- `v2/about-us.html` ✅

**Version:** 1.0.2

**Next Steps:**

1. Upload updated files to server
2. Clear SiteGround cache
3. Test all pages
4. Update other pages using the same pattern

---

**Last Updated:** January 2025  
**Component Version:** 1.0.2
