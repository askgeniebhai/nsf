import asyncio
from playwright.async_api import async_playwright
import os

async def check_console_errors():
    has_errors = False

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)

        print("Checking index.html...")
        await page.goto("http://localhost:3000/index.html")
        await page.wait_for_timeout(1000)

        print("Checking login.html...")
        await page.goto("http://localhost:3000/login.html")
        await page.wait_for_timeout(1000)

        await browser.close()

    return has_errors

asyncio.run(check_console_errors())
