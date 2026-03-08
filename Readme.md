# Amaresh Sharma — Portfolio

Personal portfolio website for Amaresh Sharma — Content Creator, Video Editor & Motion Graphics Artist.

## Project Structure

```
amaresh-portfolio/
├── fonts/              # Local font files (optional, currently using Google Fonts CDN)
├── images/             # All image assets (thumbnails, profile photo, etc.)
├── video/              # Video files or embed references
├── index.html          # Main homepage
├── works.html          # Full works / showcase page
├── contact.html        # Contact form page
├── reveal.html         # Scroll reveal animation utility & docs
├── footerScripts.html  # Script include reference & analytics placeholder
├── style.css           # Global styles, design system, responsive breakpoints
├── works.css           # Works page specific styles
├── works.js            # Works page interactions (filters, etc.)
├── contact.css         # Contact page styles
├── contact.js          # Contact form validation & submission
└── script.js           # Global JS (nav drawer, sliders, skill bars)
```

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Hero, About, Showcase preview, Services, Skills, CTA |
| `works.html` | Full Reels + YouTube showcase with sliders |
| `contact.html` | Contact form with project type selector |

## Design System

- **Colors:** `#080808` black · `#d4f50e` yellow · `#f5f2eb` white
- **Fonts:** Unbounded (headings) · Syne (body)
- **Breakpoints:** 1200px · 1024px · 768px · 480px · 360px

## Customization

### Add real videos
Replace the gradient placeholder divs in `works.html` and `index.html` with:
```html
<video src="video/your-reel.mp4" poster="images/thumb.jpg" muted loop></video>
```

### Update contact form
In `contact.js`, replace the `handleSubmit()` body with your preferred service:
- [Formspree](https://formspree.io) — free, no backend needed
- [EmailJS](https://emailjs.com) — send email directly from JS

### Add your social links
Search for `href="#"` in all HTML files and replace with your real URLs.

### Profile photo
Currently embedded as base64 in `index.html`.
To use a file instead, replace the `src="data:image/..."` with `src="images/profile.jpg"` and save your photo to the `images/` folder.

## Deployment

Works with any static host:
- **Netlify** — drag & drop the folder
- **Vercel** — `vercel deploy`
- **GitHub Pages** — push to repo, enable Pages

---
Built with HTML · CSS · Vanilla JS · No frameworks
