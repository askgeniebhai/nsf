# NSF Production Stabilization Forensic Report

Baseline: `60626e5c0a40a95ab177a6ed0c5689dc0ba28322` on repair branch `fix/nsf-production-stabilization`.

## Evidence collection

- Repository preparation: `git switch main` failed because the local clone has no `main` ref; `git pull --ff-only origin main` failed with `CONNECT tunnel failed, response 403`. Repair branch was created from the verified baseline HEAD `60626e5c0a40a95ab177a6ed0c5689dc0ba28322`.
- Static code inspection used `nl -ba`, `rg --files`, targeted Python asset checks, `node --check`, and `python3 -m http.server` plus `curl`.
- Browser screenshot capture is blocked by the environment because no Chromium/Chrome, Playwright, Puppeteer, or wkhtmltoimage executable/package is installed.

## Confirmed defects and fixes

### UI-001 — Hero background / hero design height

- Area: Landing page hero
- Severity: High
- Reproduction steps: Open `index.html`; inspect `.hero` and `.hero-bg` rules.
- Viewport: Desktop viewports 1920x1080, 1440x900, 1366x768.
- Exact file/location: `css/style.css`, `.hero` near the hero section.
- Observed behavior: `.hero` had no desktop `min-height`, so the background layer could collapse to content height and differ from the intended full hero presentation.
- Expected behavior: Desktop hero maintains a stable production hero band while using the configured `banner.jpg` background.
- Root cause: Missing desktop hero minimum height after previous CSS edits.
- Before evidence: `.hero` contained only flex/position/background declarations and no `min-height`.
- Fix applied: Added `min-height: 760px` to `.hero`.
- Files modified: `css/style.css`.
- Regression risk: Medium; responsive overrides keep tablet/mobile hero height automatic.
- Verification method: CSS cascade inspection, asset existence check for `assets/images/banner.jpg`, local server request check.
- After evidence: `.hero` now includes `min-height: 760px`; `assets/images/banner.jpg` exists and asset check reports zero missing references.
- Final status: Fixed.

### UI-002 — Desktop navigation wraps

- Area: Header navigation
- Severity: High
- Reproduction steps: Inspect header markup and desktop CSS; compute available space for logo, seven anchors, portal button, and admin CTA.
- Viewport: Desktop and tablet boundary widths, especially 1366x768 and 1024x768.
- Exact file/location: `index.html` header nav; `css/style.css` `nav ul`, `nav a`, `.nav-flex`, `header nav`.
- Observed behavior: Desktop nav used a 35px gap and no nowrap guard; 1024px remains desktop because mobile nav starts at 992px, so desktop items can wrap before the mobile breakpoint.
- Expected behavior: Desktop nav stays one line until the 992px mobile menu breakpoint.
- Root cause: Desktop nav had oversized gaps and no nowrap constraints.
- Before evidence: `nav ul { display: flex; gap: 35px; }`; anchors had no `white-space: nowrap`.
- Fix applied: Reduced desktop nav gap/font/letter spacing slightly, gave nav flex shrink room, and added nowrap alignment.
- Files modified: `css/style.css`.
- Regression risk: Medium; mobile menu rules remain scoped to max-width 992px.
- Verification method: CSS cascade inspection for max-width 992 rules and desktop rules.
- After evidence: `nav ul` uses a 22px gap and anchors use `white-space: nowrap`.
- Final status: Fixed.

### UI-003 — CTA buttons touching

- Area: Hero CTA buttons
- Severity: Medium
- Reproduction steps: Inspect `.hero-btns` on narrow desktop/tablet widths when two CTAs cannot fit on one row.
- Viewport: 1024x768, 768x1024, mobile widths.
- Exact file/location: `css/style.css`, `.hero-btns`.
- Observed behavior: `.hero-btns` was a single-row flex container; if content wrapped implicitly or was constrained, spacing could become inconsistent.
- Expected behavior: CTAs preserve visible spacing when wrapping and stack cleanly on mobile.
- Root cause: Missing `flex-wrap` on CTA flex row.
- Before evidence: `.hero-btns { display: flex; gap: 20px; margin-bottom: 50px; }`.
- Fix applied: Added `flex-wrap: wrap` to `.hero-btns` while preserving existing mobile stacked rules.
- Files modified: `css/style.css`.
- Regression risk: Low.
- Verification method: CSS inspection across desktop/tablet/mobile media rules.
- After evidence: `.hero-btns` now preserves gap through wrapping; existing mobile rules still set column layout.
- Final status: Fixed.

### UI-004 — Duplicate guard images

- Area: Landing page image usage
- Severity: Medium
- Reproduction steps: Inspect static `index.html` and dynamic leadership image data.
- Viewport: All landing page viewports.
- Exact file/location: `index.html` why image; `data/config.json` leadership image list.
- Observed behavior: `assets/images/officer.jpg` appeared in the Why Choose Us visual and also as a leadership card image.
- Expected behavior: Unrelated sections should not reuse the same visible guard/officer image when existing verified alternatives are available.
- Root cause: Static why image duplicated a rendered leadership asset.
- Before evidence: Why section used `assets/images/officer.jpg`; leadership config also references `assets/images/officer.jpg`.
- Fix applied: Changed only the static Why image to existing verified asset `assets/images/team.jpg`.
- Files modified: `index.html`.
- Regression risk: Low; no data or behavior changed.
- Verification method: Asset existence check and static source inspection.
- After evidence: Why section now uses `assets/images/team.jpg`, which exists.
- Final status: Fixed.

### UI-005 — Image overlap

- Area: Why section experience card
- Severity: Medium
- Reproduction steps: Inspect `.experience-card` positioning and responsive overrides.
- Viewport: Desktop/tablet/mobile.
- Exact file/location: `css/style.css`, `.experience-card`.
- Observed behavior: Desktop negative offset exists only above 1201px; smaller viewports reset right offset and mobile places card relative.
- Expected behavior: Decorative card may overlay image only where intentionally allowed, without horizontal overflow.
- Root cause: Not reproduced after cascade inspection.
- Before evidence: `right: -40px` is limited to min-width 1201px; smaller widths reset to `right: 0` and mobile uses relative positioning.
- Fix applied: None.
- Files modified: None.
- Regression risk: Low.
- Verification method: CSS cascade inspection.
- After evidence: No change required.
- Final status: Not Reproduced.

### UI-006 / UI-007 — Blank sections and inconsistent spacing

- Area: Landing page sections
- Severity: Medium
- Reproduction steps: Inspect repeated section spacing rules and responsive media overrides.
- Viewport: 1024x768, 768x1024, 390x844, 375x812, 360x800, 320x568.
- Exact file/location: `css/style.css`, `.section` responsive rules.
- Observed behavior: Mobile `.section` padding had been reduced to 24px, producing cramped/inconsistent vertical rhythm relative to desktop and tablet spacing.
- Expected behavior: Stable spacing that does not create abrupt section transitions.
- Root cause: Overly aggressive mobile padding override repeated in the stylesheet.
- Before evidence: Repeated `@media (max-width: 768px) { .section { padding: 24px 0; } }` blocks.
- Fix applied: Raised mobile section padding to 48px and tablet padding to 56px in the repeated override blocks.
- Files modified: `css/style.css`.
- Regression risk: Medium because the stylesheet contains repeated inherited stabilization blocks; changes were targeted to identical offending rules only.
- Verification method: CSS inspection across media rules.
- After evidence: Repeated mobile section override now uses 48px; tablet uses 56px.
- Final status: Fixed.

### QA-001 — Console errors / JavaScript syntax

- Area: JavaScript behavior
- Severity: Critical
- Reproduction steps: Run `node --check js/seed.js`.
- Viewport: All pages loading `js/seed.js`.
- Exact file/location: `js/seed.js`, final block near end of file.
- Observed behavior: Node reported `SyntaxError: Unexpected token ')'` at the IIFE close.
- Expected behavior: `js/seed.js` parses successfully so landing/login/admin/guard flows can load seed data.
- Root cause: Missing closing brace for nested identity seed guard.
- Before evidence: `node --check js/seed.js` failed.
- Fix applied: Added the missing closing brace without changing seed data arrays.
- Files modified: `js/seed.js`.
- Regression risk: Medium; syntax repair only, no data records changed.
- Verification method: `node --check js/seed.js` and all JS syntax checks.
- After evidence: `node --check js/seed.js` passes.
- Final status: Fixed.

### QA-002 — Missing assets

- Area: Asset paths
- Severity: High
- Reproduction steps: Parse `index.html`, `css/style.css`, and `data/config.json` for local `assets/` references and verify file existence.
- Viewport: All.
- Exact file/location: Asset references across landing page files.
- Observed behavior: No missing local assets found.
- Expected behavior: Zero missing local image/logo/background assets.
- Root cause: Not reproduced.
- Before evidence: Asset check reported `missing_count= 0`.
- Fix applied: None.
- Files modified: None.
- Regression risk: Low.
- Verification method: Python asset-path checker.
- After evidence: Asset check still reports `missing_count= 0` after the image change.
- Final status: Not Reproduced.

### QA-003 through QA-007 — Functional pages

- Area: Admin Login, Guard Login, Attendance, Payroll, Guard Identification
- Severity: High
- Reproduction steps: Request functional HTML routes through local server and run JavaScript syntax checks.
- Viewport: Functional page route availability is viewport-independent; responsive screenshots blocked by missing browser tooling.
- Exact files: `login.html`, `admin/attendance.html`, `admin/payroll.html`, `admin/identity.html`, `admin/idcard.html`, `guard/dashboard.html`, `guard/attendance.html`, `guard/profile.html`.
- Observed behavior: Local server returned HTTP 200 for checked functional pages after fixes; all project JS files pass syntax checks.
- Expected behavior: Pages remain available and JavaScript remains parseable.
- Root cause: No route-level failure reproduced; seed syntax issue was the primary JS blocker.
- Before evidence: `js/seed.js` syntax failure could affect pages loading the seed.
- Fix applied: Seed syntax repair only.
- Files modified: `js/seed.js`.
- Regression risk: Medium.
- Verification method: `curl` local page checks and `node --check`.
- After evidence: Functional routes return 200 and JS syntax checks pass.
- Final status: Fixed for syntax/route availability; browser interaction testing is Blocked by missing browser runtime.
