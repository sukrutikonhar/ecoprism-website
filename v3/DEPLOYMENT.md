# Deployment Guide - EcoPRISM V2 Homepage

## 🚀 Quick Deployment Steps

### 1. Test Locally

```bash
# Navigate to v2 directory
cd v2

# Start local server (Python 3)
python -m http.server 8000

# Or use Node.js
npx live-server

# Open browser to http://localhost:8000
```

### 2. Backup Current Website

```bash
# Create backup of current index.html
cp ../index.html ../index.html.backup

# Or rename the current directory
mv .. ../ecoprism-current
```

### 3. Deploy to SiteGround

#### Option A: Direct Upload

1. Upload all files from `v2/` to your website root
2. Ensure `.htaccess` is uploaded for clean URLs
3. Test the homepage at your domain

#### Option B: Gradual Migration

1. Upload `v2/` folder to your website
2. Test at `yourdomain.com/v2/`
3. When ready, move files to root:
   ```bash
   # Move v2 files to root
   mv v2/* ./
   mv v2/.* ./
   ```

### 4. Verify Deployment

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Links to existing pages work
- [ ] Mobile responsiveness
- [ ] Video modal functions
- [ ] Scroll to top button works

## 🔧 Configuration

### SiteGround Settings

1. **PHP Version**: 7.4 or higher
2. **SSL Certificate**: Enabled
3. **Gzip Compression**: Enabled (handled by .htaccess)
4. **Browser Caching**: Enabled (handled by .htaccess)

### URL Structure

- Clean URLs: `ecoprism.com/about` (instead of `about.html`)
- Existing pages: `ecoprism.com/about-us/` (unchanged)
- New pages: `ecoprism.com/about` (clean URLs)

## 🎯 Performance Optimization

### Already Implemented

- ✅ Alpine.js (15KB vs 557KB jQuery/Bootstrap)
- ✅ Tailwind CSS CDN (50KB vs 830KB custom CSS)
- ✅ Optimized images (WebP format)
- ✅ Lazy loading
- ✅ Component-based architecture

### Additional Optimizations

- Image optimization with WebP
- CDN for static assets
- Minification (if needed)

## 🔗 Integration Points

### Links to Existing Pages

All links use relative paths:

- `../about-us/` → About Us page
- `../services/esg-advisory` → ESG Advisory
- `..contact-us` → Contact page
- `../esg-platform/` → ESG Platform

### Shared Assets

Uses existing assets where possible:

- `../assets/img/logo.webp` → Company logo
- `../assets/img/favicon.webp` → Favicon
- `../assets/media/home.mp4` → Hero video

## 🐛 Troubleshooting

### Common Issues

#### 1. Components Not Loading

```javascript
// Check browser console for errors
// Ensure components/header.html and components/footer.html exist
```

#### 2. Clean URLs Not Working

```apache
# Ensure .htaccess is uploaded and has correct permissions
# Check SiteGround mod_rewrite is enabled
```

#### 3. Images Not Loading

```html
<!-- Check image paths are correct -->
<!-- Ensure images exist in ../assets/img/ -->
```

#### 4. Alpine.js Not Working

```html
<!-- Check Alpine.js CDN is loading -->
<!-- Check for JavaScript errors in console -->
```

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📊 Performance Metrics

### Expected Improvements

- **Load Time**: 0.5-1s (vs 3-5s)
- **Bundle Size**: 65KB (vs 1.4MB)
- **First Paint**: < 1s
- **Lighthouse Score**: 90+ (vs 60-70)

### Monitoring

- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Check Google Analytics for bounce rate

## 🔄 Rollback Plan

If issues occur:

```bash
# Quick rollback
cp ../index.html.backup ../index.html

# Or restore from backup
# Upload previous version from SiteGround backup
```

## 📞 Support

For deployment issues:

1. Check browser console for errors
2. Verify file permissions
3. Test on different browsers
4. Check SiteGround error logs

---

**Note**: Always test thoroughly before deploying to production!
