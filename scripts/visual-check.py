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

    # Contact form. /api/contact is intercepted, so this check never sends a real email.
    context = browser.new_context(viewport={"width": 390, "height": 844})
    page = context.new_page()
    sent = []
    reply = {"status": 502, "body": '{"ok":false,"code":"send_failed"}'}
    def answer(route):
        sent.append(route.request.post_data_json)
        route.fulfill(status=reply["status"], content_type="application/json", body=reply["body"])
    page.route("**/api/contact", answer)
    page.goto(ROOT + "/contact", wait_until="networkidle")
    submit = page.get_by_role("button", name="Discuss this workflow")
    submit.click()
    assert page.get_by_text("Enter your name.").is_visible(), "an empty submit should explain each missing field"
    assert page.get_by_label("Name", exact=True).evaluate("el => el === document.activeElement"), "focus should move to the first invalid field"
    assert not sent, "an invalid form must not reach the API"
    page.get_by_label("Name", exact=True).fill("Test User")
    page.get_by_label("Work email").fill("test@example.com")
    page.get_by_label("Company").fill("Example Company")
    page.get_by_label("Role").fill("Operations Lead")
    page.get_by_label("Which workflow should we examine?").fill("Contract intake: reviewers re-key terms from PDFs into the CLM.")
    page.get_by_label("What business result matters?").fill("Cut review cycle time while keeping accountable human sign-off.")
    submit.click()
    page.get_by_text("We couldn’t send your message.").wait_for()
    assert page.get_by_label("Company").input_value() == "Example Company", "a failed send must keep the answers"
    reply.update(status=200, body='{"ok":true}')
    # Two clicks in the same tick: the in-flight guard must turn them into one request.
    page.evaluate("() => { const button = document.querySelector('.form-submit'); button.click(); button.click(); }")
    page.get_by_text("Received.").wait_for()
    assert page.get_by_text("An Elagon principal will review the workflow").is_visible()
    assert len(sent) == 2, f"expected one request per deliberate submit, got {len(sent)}"
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
