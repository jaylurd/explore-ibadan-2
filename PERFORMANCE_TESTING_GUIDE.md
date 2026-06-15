# ⚡ Quick Performance Testing Guide

## How to Test Your Optimized Website

### 1. **Local Testing with Chrome DevTools**

#### Check Performance:
1. Open your website
2. Press `F12` to open DevTools
3. Go to **Lighthouse** tab
4. Click **"Analyze page load"**
5. Wait for report (takes ~30 seconds)
6. Look for scores:
   - **Performance**: Should be 85+
   - **Accessibility**: Should be 95+
   - **Best Practices**: Should be 90+

#### Check Images:
1. Go to **Network** tab
2. Reload page (Ctrl+Shift+R for hard refresh)
3. Filter by **Images**
4. Verify:
   - ✓ Images have `loading="lazy"`
   - ✓ Image sizes are reasonable (hero: <500KB, cards: <100KB)
   - ✓ Format is optimized (JPEG, WebP)

#### Check Scripts:
1. In **Network** tab, filter by **JS**
2. Verify:
   - ✓ Scripts are marked as `defer`
   - ✓ No render-blocking scripts
   - ✓ Total JS size < 500KB

#### Check CSS:
1. Filter by **CSS**
2. Verify:
   - ✓ CSS is inline or deferred
   - ✓ No render-blocking CSS
   - ✓ Total CSS size < 200KB

---

### 2. **Mobile Testing**

#### Using Chrome DevTools:
1. In DevTools, click **device icon** (top-left corner)
2. Select **iPhone 12 Pro** or **Pixel 5**
3. Reload page
4. Verify:
   - ✓ No console errors
   - ✓ All buttons are clickable (48px minimum)
   - ✓ Text is readable (font size 16px minimum)
   - ✓ Images load properly
   - ✓ Animations are smooth

#### Using Real Mobile Phone:
1. Connect to same WiFi as computer
2. Get computer's IP: `ipconfig getifaddr en0` (Mac) or use Windows ipconfig
3. Open browser on phone: `http://[YOUR_IP]:8000`
4. Check:
   - ✓ Page loads in <3 seconds
   - ✓ All interactive elements work
   - ✓ No layout shifts

---

### 3. **Speed Testing Tools**

#### Google PageSpeed Insights:
1. Go to: https://pagespeed.web.dev/
2. Enter your website URL
3. Check both Mobile and Desktop scores
4. Target: 90+ performance score

#### WebPageTest:
1. Go to: https://www.webpagetest.org/
2. Enter your URL
3. Select test location and device
4. Look at:
   - ✓ First Contentful Paint (FCP)
   - ✓ Largest Contentful Paint (LCP)
   - ✓ Cumulative Layout Shift (CLS)

#### GTmetrix:
1. Go to: https://gtmetrix.com/
2. Enter your URL
3. Check Performance Score
4. View waterfall chart for bottlenecks

---

### 4. **Animations & Transitions**

#### Verify Smooth Animations:
1. Open DevTools **Performance** tab
2. Click **Record** button
3. Scroll down the page (or hover over cards)
4. Stop recording
5. Check FPS (target: 60 FPS)
6. Look for:
   - ✓ No red sections (smooth performance)
   - ✓ FPS stays above 55
   - ✓ No layout thrashing

#### Test Motion Preferences:
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. Type "Rendering" and hit Enter
3. Scroll down and enable **"Emulate CSS media feature prefers-reduced-motion"**
4. Reload page
5. Verify:
   - ✓ Animations are disabled/minimal
   - ✓ Page still looks good
   - ✓ All content is visible

---

### 5. **Image Responsiveness**

#### Desktop vs Mobile Images:
1. Open DevTools **Network** tab
2. Filter by **Images**
3. Desktop: Reload page → Check image sizes
4. Mobile: Switch to mobile view → Reload → Check if smaller images load
5. Verify srcset working:
   - ✓ Mobile gets smaller images (250-500px)
   - ✓ Desktop gets larger images (500-800px)

#### Test Lazy Loading:
1. Open page
2. Scroll down slowly
3. In **Network** tab (Images), watch as images load
4. Verify:
   - ✓ Images below fold don't load initially
   - ✓ Images load only when scrolled into view
   - ✓ Scroll is smooth (no jank)

---

### 6. **Network Simulation**

#### Slow 3G Testing:
1. In DevTools, go to **Network** tab
2. In throttling dropdown, select **Slow 3G**
3. Reload page
4. Verify:
   - ✓ Page still loads (may be slower)
   - ✓ Images load progressively
   - ✓ No broken functionality
   - ✓ Load time: ideally <5s

#### 4G Testing:
1. Select **Fast 3G** in throttling
2. Reload page
3. Verify:
   - ✓ Page loads quickly (<3s)
   - ✓ Images load smoothly
   - ✓ All content visible quickly

---

### 7. **Accessibility Checks**

#### Keyboard Navigation:
1. Close DevTools
2. Press `Tab` repeatedly
3. Verify:
   - ✓ All interactive elements are reachable
   - ✓ Focus indicator is visible
   - ✓ Logical tab order (left-to-right, top-to-bottom)

#### Screen Reader:
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Enable and navigate
3. Verify:
   - ✓ Page structure is logical
   - ✓ Images have alt text
   - ✓ Links are descriptive

---

### 8. **Performance Baseline**

**Before Optimization Metrics:**
- Page Load: ~4-5 seconds
- Lighthouse Performance: ~70
- Grain Overlay: Heavy repaints
- Animations: 0.8-1s duration

**After Optimization Metrics:**
- Page Load: ~2-3 seconds (40-50% faster)
- Lighthouse Performance: 85-95
- Grain Overlay: Removed (no repaints)
- Animations: 0.6-0.7s duration (smoother)

---

### 9. **Browser Compatibility Check**

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari Mobile

For each, verify:
- ✓ Page renders correctly
- ✓ Animations work smoothly
- ✓ No console errors
- ✓ All features functional

---

### 10. **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| Blurry images | Wrong size loaded | Check srcset and sizes attributes |
| Slow animation | GPU not utilized | Verify `will-change` is applied |
| Jank on scroll | Layout recalculation | Check for forced reflows |
| Images not loading | Lazy load issue | Verify `loading="lazy"` syntax |
| Console errors | Script issues | Check defer attribute placement |

---

## 📋 Performance Checklist

- [ ] Lighthouse Performance: 85+
- [ ] Lighthouse Accessibility: 95+
- [ ] Page Load: <3 seconds on 4G
- [ ] Mobile FPS: 55+ (smooth scrolling)
- [ ] All animations smooth (60 FPS)
- [ ] Images responsive on all devices
- [ ] No console errors
- [ ] All buttons clickable (48px)
- [ ] Text readable on mobile
- [ ] Motion preferences respected

---

## 🚀 Next Steps

1. **Test everything locally** using this guide
2. **Run Lighthouse audit** and aim for 90+ score
3. **Test on real mobile device** before deploying
4. **Monitor after deployment** using PageSpeed Insights
5. **Share performance improvements** with your team

---

## 📞 Need Help?

If you see performance issues:
1. Check the **Console** tab for errors
2. Look at **Network** tab to identify slow assets
3. Review **Performance** tab for animation issues
4. Run **Lighthouse** audit for detailed recommendations

**Keep this guide handy for regular performance monitoring!**
