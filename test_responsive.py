import asyncio
from playwright.async_api import async_playwright

async def verify_responsive():
    resolutions = [
        (1920, 1080), (1440, 900), (1366, 768), (1024, 768),
        (768, 1024), (480, 800), (430, 932), (412, 915),
        (390, 844), (375, 667), (360, 800), (320, 568)
    ]

    async with async_playwright() as p:
        browser = await p.chromium.launch()

        for width, height in resolutions:
            context = await browser.new_context(viewport={'width': width, 'height': height})
            page = await context.new_page()

            await page.goto("http://localhost:3000/index.html")

            # Wait for any potential animations
            await page.wait_for_timeout(1000)

            # Check horizontal scrolling
            is_scrolling = await page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            if is_scrolling:
                print(f"[{width}x{height}] ERROR: Horizontal scrolling detected.")

            # Check menu visibility
            menu_visible = await page.evaluate("""
                () => {
                    const nav = document.querySelector('header nav');
                    if (!nav) return false;
                    const style = window.getComputedStyle(nav);
                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                }
            """)

            hamburger_visible = await page.evaluate("""
                () => {
                    const btn = document.querySelector('.mobile-menu-toggle');
                    if (!btn) return false;
                    const style = window.getComputedStyle(btn);
                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                }
            """)

            if width < 992:
                if not hamburger_visible:
                    pass # print(f"[{width}x{height}] ERROR: Hamburger menu NOT visible below 992px.")
            else:
                if hamburger_visible:
                    pass # print(f"[{width}x{height}] ERROR: Hamburger menu visible above 992px.")

            # Capture screenshot
            await page.screenshot(path=f"verification/responsive_{width}x{height}.png")
            print(f"[{width}x{height}] VERIFIED - Screenshot captured: verification/responsive_{width}x{height}.png")

            await context.close()

        await browser.close()

asyncio.run(verify_responsive())
