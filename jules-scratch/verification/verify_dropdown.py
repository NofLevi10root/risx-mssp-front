from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Go to the login page
        page.goto("http://localhost:3003/", timeout=60000)

        # Fill in the credentials
        page.get_by_placeholder("Email").fill("admin@admin")
        page.get_by_placeholder("Password").fill("the1Admin")

        # Click the login button
        page.get_by_role("button", name="Log in").click()

        # Wait for navigation to the modules page and for the main content to load
        page.wait_for_url("**/Modules", timeout=30000)
        page.wait_for_selector('.app-main', timeout=30000)

        # Find the "Tags" button
        tags_button = page.get_by_role("button", name="Tags")

        # Wait for the button to be visible and enabled
        expect(tags_button).to_be_visible(timeout=15000)
        expect(tags_button).to_be_enabled(timeout=15000)

        # Click the button to open the dropdown
        tags_button.click()

        # Wait for the dropdown menu to have the correct style
        dropdown_menu = page.locator('.top-of-page-right .dropdown-menu')
        expect(dropdown_menu).to_have_css("display", "flex", timeout=10000)

        # Take a screenshot of the page
        page.screenshot(path="jules-scratch/verification/dropdown.png")
        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
        print("Error screenshot taken.")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
