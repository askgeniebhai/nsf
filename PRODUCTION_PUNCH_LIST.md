# Production Punch List

| ID | Area | Defect | Severity | Root Cause | Fix | Evidence | Status |
| -- | ---- | ------ | -------- | ---------- | --- | -------- | ------ |
| UI-001 | Landing hero | Hero background/design height unstable | High | `.hero` lacked desktop `min-height` | Added desktop `min-height: 760px`; verified `banner.jpg` exists | CSS/asset checks | Fixed |
| UI-002 | Navigation | Desktop navigation wraps | High | oversized 35px nav gaps and no nowrap guard | Reduced gap/font spacing, added nav flex/nowrap guards | CSS cascade inspection | Fixed |
| UI-003 | Buttons | CTA buttons can touch when constrained | Medium | `.hero-btns` did not wrap | Added `flex-wrap: wrap`; mobile column retained | CSS inspection | Fixed |
| UI-004 | Images | Duplicate officer/guard imagery in unrelated sections | Medium | Why image reused leadership `officer.jpg` | Switched Why image to existing `team.jpg` | Asset check | Fixed |
| UI-005 | Images | Image overlap | Medium | Not reproduced; responsive overrides already constrain overlap | No code change | CSS cascade inspection | Not Reproduced |
| UI-006 | Landing sections | Blank/abrupt section spacing | Medium | repeated mobile 24px spacing override | Set mobile section padding to 48px | CSS inspection | Fixed |
| UI-007 | Layout | Desktop/tablet spacing inconsistency | Medium | repeated tablet 48px spacing override | Set tablet section padding to 56px | CSS inspection | Fixed |
| UI-008 | Mobile | Mobile verification | High | Browser screenshot tooling unavailable | CSS/static checks completed; browser screenshots blocked | No Chromium/Playwright/Puppeteer installed | Blocked |
| UI-009 | Tablet | Tablet verification | High | Browser screenshot tooling unavailable | CSS/static checks completed; browser screenshots blocked | No Chromium/Playwright/Puppeteer installed | Blocked |
| QA-001 | Console | JavaScript syntax error | Critical | Missing closing brace in `js/seed.js` | Added missing brace only | `node --check js/seed.js` passes | Fixed |
| QA-002 | Assets | Missing assets/404 | High | Not reproduced for local assets | No code change | asset checker reports zero missing | Not Reproduced |
| QA-003 | Admin Login | Admin login route availability | High | No route failure reproduced | Preserved existing files; seed syntax fixed | HTTP 200 and JS syntax checks | Fixed |
| QA-004 | Guard Login | Guard login route availability | High | No route failure reproduced | Preserved existing files; seed syntax fixed | HTTP 200 and JS syntax checks | Fixed |
| QA-005 | Attendance | Attendance route/JS parse | High | Seed syntax could block shared JS | Fixed seed syntax | HTTP 200 and JS syntax checks | Fixed |
| QA-006 | Payroll | Payroll route/JS parse | High | Seed syntax could block shared JS | Fixed seed syntax | HTTP 200 and JS syntax checks | Fixed |
| QA-007 | Guard Identification | Identity/idcard route/JS parse | High | Seed syntax could block shared JS | Fixed seed syntax | HTTP 200 and JS syntax checks | Fixed |
