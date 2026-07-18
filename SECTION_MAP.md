# NSF Landing Page Section Map

| Order | Section | ID/Class | Source | Dynamic Data/Renderer | Assets |
| -- | -- | -- | -- | -- | -- |
| 1 | Top bar | `.top-bar` | `index.html` | `initializeWebsite()` contact setters | none |
| 2 | Header/navigation | `header`, `#mobile-nav`, `.nav-cta` | `index.html` | mobile menu listeners in `js/ui-components.js` | `assets/images/logo.png` |
| 3 | Hero | `#home.hero`, `.hero-bg` | `index.html`, `css/style.css` | `heroTitle`, `heroSubtitle`, `heroImage`, `renderHeroStats()` | `assets/images/banner.jpg` |
| 4 | Logo ticker | `.ticker-section`, `#clientsTrack` | `index.html` | `renderClients()` | `assets/images/logo.png` |
| 5 | About | `#about`, `#aboutImagesContainer` | `index.html` | `renderAboutImages()` | `assets/images/about.jpg`, `assets/images/ops.jpg`, `assets/images/night.jpg` |
| 6 | Mission/Vision | `.mission-vision-grid` | `index.html` | mission/vision setters | none |
| 7 | Services | `#services`, `#servicesContainer` | `index.html` | `renderServices()` | service data contains images, cards render icons/text only |
| 8 | Why Choose Us | `#why`, `.why-image` | `index.html` | `renderFeatures()` | `assets/images/team.jpg` |
| 9 | Industries | `#industries`, `#industriesContainer` | `index.html` | `renderIndustries()` | industry data contains images, cards render icons/text only |
| 10 | Attendance showcase | `#attendance`, `#attendanceContainer` | `index.html` | `renderAttendance()` | `assets/images/monitor.jpg`, `assets/images/guard.png` |
| 11 | Leadership | `#leadership`, `#leadershipContainer` | `index.html` | `renderLeadership()` | `assets/images/chief.jpg`, `assets/images/officer.jpg`, `assets/images/guard.jpg` |
| 12 | CTA banner | `.cta-banner` | `index.html` | static | none |
| 13 | Contact/footer | `#contact`, `.footer-contact` | `index.html` | contact setters | `assets/images/logo.png` |
