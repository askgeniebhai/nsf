# NSF Website Forensic Report — Hero Background, Duplicate Landing Image, QA Access

Branch: `fix/nsf-landing-responsive-qa`

## A. Hero background investigation

- Observed symptom: `assets/images/banner.jpg` was present in the repository and preloaded from `index.html`, but preload alone did not implement the hero background, and the hero could still appear as a flat navy block.
- Root cause: the visible hero background depended on `.hero-bg` CSS plus a JavaScript override. The prior JavaScript update used a CSS custom property / path approach that did not provide strong deployed-page evidence. The overlay was also very dark (`rgba(..., 0.75)` to `rgba(..., 0.9)`), making the image effectively invisible even when loaded.
- Exact files/selectors involved:
  - `index.html`: hero contains one background layer, `<div class="hero-bg"></div>`, inside `section#home.hero`.
  - `css/style.css`: `.hero-bg` owns the background rendering, sizing, positioning, and overlay.
  - `js/engine.js`: `initializeWebsite()` reads `customer.heroImage` from `data/config.json` and applies it to `.hero-bg`.
  - `data/config.json`: `heroImage` remains `assets/images/banner.jpg`.
- Evidence:
  - Static asset validation confirms `assets/images/banner.jpg` exists and all referenced `assets/` paths resolve locally.
  - Local HTTP route checks confirm `/assets/images/banner.jpg` returns HTTP `200` from the deployed-page root path.
  - DOM/source inspection confirms one `.hero-bg` element exists in the landing hero.
- Fix applied:
  - Applied the configured hero asset directly to `.hero-bg.style.backgroundImage` using the deployed page-relative path from `data/config.json`.
  - Kept a readable but lighter navy overlay: `linear-gradient(rgba(11, 31, 58, 0.62), rgba(11, 31, 58, 0.82)), url(...)`.
  - Strengthened CSS fallback on `.hero-bg` with `background-image`, `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`, and `z-index: 0`.
- Desktop verification: static cascade inspection confirms `.hero-bg` uses cover sizing, centered positioning, no repeat, and a background layer; local HTTP route checks confirm `index.html`, `data/config.json`, and `assets/images/banner.jpg` are served successfully.
- Mobile verification: static responsive inspection confirms the same `.hero-bg` layer remains inside `section#home.hero` across mobile media queries; no mobile rule removes the layer or changes the background path.

## B. Duplicate-image investigation

- Duplicated asset/element: the landing client ticker was visibly repeating the same image because every client entry used `assets/images/logo.png` as its image source.
- Both rendering sources:
  1. Data source: `data/config.json` repeated `assets/images/logo.png` for all client records.
  2. Rendering source: `js/engine.js` rendered client images into `#clientsTrack`; previous ticker logic also cloned rendered items for continuous animation.
- Why the previous fix failed: the previous de-duplication focused on renderer-level duplicate paths. It did not preserve intentional ticker cloning correctly, and it did not fully document the data-level cause: repeated client image sources in `data/config.json`.
- Exact fix applied:
  - Replaced repeated client image references with distinct existing repository assets: `office.jpg`, `campus.jpg`, `plaza.jpg`, `mall.jpg`, `tower.jpg`, and `control.jpg`.
  - Kept renderer-level de-duplication of accidental repeated source paths.
  - Restored intentional ticker repetition by adding accessible cloned ticker items marked with `aria-hidden="true"` and `data-ticker-clone="true"`.
  - Kept thumbnail sizing consistent through final CSS override rules.
- Evidence that only the unintended duplicate was removed:
  - Static JSON inspection confirms six unique client image paths.
  - DOM-generation inspection confirms `renderClients()` filters unique image sources before creating the intentional ticker clones.
  - Clone markup is explicitly marked as ticker animation support, so intentional continuous-animation repetition is distinguishable from unintended data duplication.

## C. Authentication validation

- Login route tested: `/login.html`.
- Admin temporary QA credentials:
  - Username: `admin`
  - Password: `admin`
  - Destination dashboard: `admin/dashboard.html`
  - Result: Pass in AuthService simulation with mocked browser storage/location; local route check returns HTTP `200` for `/admin/dashboard.html`.
- Guard temporary QA credentials:
  - Username: `NFS-9921`
  - Password: `password`
  - Destination dashboard: `guard/dashboard.html`
  - Result: Pass in AuthService simulation with seeded `nsf_employees` localStorage; local route check returns HTTP `200` for `/guard/dashboard.html`.
- No new hard-coded production secrets were added. These credentials use the existing demo/seed authentication path in `js/auth.js`.

## D. Regression assessment

- Files changed:
  - `FORENSIC_REPORT.md`
  - `css/style.css`
  - `js/engine.js`
- Unrelated areas checked:
  - JavaScript syntax checks passed for project JS files.
  - HTML parsing passed for all HTML files.
  - Static asset validation found zero missing `assets/` references.
  - Core local routes returned HTTP `200`.
  - Admin and guard demo login routing passed in a mocked AuthService validation.
- Known limitations:
  - Browser automation is unavailable in this container: Chromium/Chrome, Puppeteer, and Python Playwright are not installed.
  - Therefore desktop/mobile visual verification was limited to static DOM/CSS inspection and local-server path validation; no screenshot-based claim is made.
- Remaining risks:
  - Final visual approval should still be completed in a real browser or GitHub Codespace with browser tooling available.
  - Push to GitHub is blocked from this environment by HTTPS proxy failure (`CONNECT tunnel failed, response 403`).
