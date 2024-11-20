from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import json

# Set up Selenium WebDriver (Headless mode for faster scraping)
chrome_options = Options()
# chrome_options.add_argument("--headless")  # Run in headless mode (no browser UI)
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
service = Service("D:\8_POC\python\chromedriver.exe")  # Update with the path to your WebDriver

# Output folder for scraped data
OUTPUT_FOLDER = "database/s2/"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def scrape_dynamic_content(url):
    """Scrape dynamic content loaded via JavaScript."""
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 29)  # Wait up to 10 seconds for elements to load

    try:
        # Navigate to the URL
        driver.get(url)
        print(f"Accessing {url}")

        # Find the menu items
        menu_items = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".menu-root li a")))
        print(f"Found {len(menu_items)} menu items.")

        data = []

        # Loop through each menu item
        for item in menu_items:
            try:
                # Click the menu item to load the content dynamically
                item_text = item.text.strip()
                print(f"Clicking menu item: {item_text}")
                item.click()

                # Wait for the dynamic content to load in the #article element
                article_content = wait.until(EC.presence_of_element_located((By.ID, "article")))
                content_text = article_content.text.strip()
                print(f"Extracted content for {item_text} (truncated): {content_text[:100]}")

                # Append the data
                data.append({
                    "menu_item": item_text,
                    "content": content_text
                })

            except Exception as e:
                print(f"Error processing menu item {item_text}: {e}")

        # Save the data to a JSON file
        output_file = os.path.join(OUTPUT_FOLDER, "scraped_data.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Data saved to {output_file}")

    finally:
        driver.quit()

# URL of the page with dynamic content
target_url = "https://coryn.club/guide.php?key=smith"  # Replace with your target URL
scrape_dynamic_content(target_url)
