from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = "http://localhost:3100"
OUT = Path("test-results/visual")
OUT.mkdir(parents=True, exist_ok=True)

viewports = [
    ("wide", 1920, 1080),
    ("desktop", 1440, 1000),
    ("compact", 1024, 768),
    ("tablet", 768, 1024),
    ("mobile", 390, 844),
    ("small", 360, 800),
]
routes = ["/", "/services", "/work", "/work/contract-intelligence", "/approach", "/company", "/contact"]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    errors = []
    for name, width, height in viewports:
        context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce")
        page = context.new_page()
        page.on("console", lambda msg: errors.append(f"console:{msg.type}:{msg.text}") if msg.type == "error" else None)
        page.on("response", lambda response: errors.append(f"http:{response.status}:{response.url}") if response.status >= 400 else None)
        page.on("pageerror", lambda exc: errors.append(f"pageerror:{exc}"))
        for route in routes:
            page.goto(ROOT + route, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(350)
            safe = route.strip("/").replace("/", "-") or "home"
            page.screenshot(path=str(OUT / f"{name}-{safe}.png"), full_page=(route in ["/", "/work", "/company"] and name in ["desktop", "mobile"]))
            overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            if overflow:
                dimensions = page.evaluate("({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, body: document.body.scrollWidth})")
                offenders = page.evaluate("""Array.from(document.querySelectorAll('*')).filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 || el.getBoundingClientRect().left < -1).slice(0, 12).map(el => ({tag: el.tagName, cls: el.className, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, width: el.getBoundingClientRect().width}))""")
                raise AssertionError(f"Horizontal overflow at {name} {route}: {dimensions} {offenders}")
            assert page.locator("h1").count() == 1, f"Expected one h1 at {route}"
        if width < 768:
            page.goto(ROOT, wait_until="networkidle")
            page.get_by_role("button", name="Open menu").click()
            assert page.get_by_role("link", name="Services").is_visible()
            page.keyboard.press("Escape")
            page.wait_for_timeout(100)
            assert page.get_by_role("button", name="Open menu").get_attribute("aria-expanded") == "false"
        context.close()

    context = browser.new_context(viewport={"width": 390, "height": 844})
    page = context.new_page()
    page.goto(ROOT + "/contact", wait_until="networkidle")
    page.get_by_label("Name *").fill("Test User")
    page.get_by_label("Work email *").fill("test@example.com")
    page.get_by_label("Company *").fill("Example Company")
    page.get_by_label("Role *").fill("Operations Lead")
    page.get_by_label("Workflow or problem *").fill("A critical workflow currently needs a reliable production operating system.")
    page.get_by_label("Desired business outcome *").fill("Reduce cycle time while preserving accountable human review.")
    page.get_by_label("Timeline *").select_option(label="3–6 months")
    page.get_by_label("Budget range *").select_option(label="$75k–$200k")
    page.locator('input[name="consent"]').check()
    page.get_by_role("button", name="Send inquiry").click()
    page.wait_for_function("document.querySelector('[role=status]')?.textContent?.trim().length > 0")
    status_text = page.get_by_role("status").inner_text().lower()
    assert "configure" in status_text or "not configured" in status_text or "thank you" in status_text
    context.close()

    context = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference")
    page = context.new_page()
    page.on("pageerror", lambda exc: errors.append(f"motion-pageerror:{exc}"))
    page.goto(ROOT, wait_until="networkidle")
    page.wait_for_timeout(2200)
    assert float(page.locator(".hero-media").evaluate("el => getComputedStyle(el).opacity")) > 0.95
    page.mouse.wheel(0, 700)
    page.wait_for_timeout(500)
    context.close()
    browser.close()

print(f"visual checks passed; browser errors={len(errors)}")
if errors:
    print("\n".join(errors))
    raise SystemExit(1)
