import requests
from bs4 import BeautifulSoup
import json
import os

# List of URLs to scrape
skill_weapons = [
    "https://coryn.club/skill.php?tree=Blade",
    "https://coryn.club/skill.php?tree=Shot",
    "https://coryn.club/skill.php?tree=Magic",
    "https://coryn.club/skill.php?tree=Martial",
    # "https://coryn.club/skill.php?tree=DualSword",
    # "https://coryn.club/skill.php?tree=Halberd",
    # "https://coryn.club/skill.php?tree=Mononofu",
    # "https://coryn.club/skill.php?tree=Barehand",
    # "https://coryn.club/skill.php?tree=Crusher",
    # "https://coryn.club/skill.php?tree=Sprite"
    # Add more URLs as needed
]

skill_buffs = [
    "https://coryn.club/skill.php?tree=Guard",
    "https://coryn.club/skill.php?tree=Shield",
    "https://coryn.club/skill.php?tree=Dagger",
    # "https://coryn.club/skill.php?tree=Knight",
    # "https://coryn.club/skill.php?tree=Priest",
    # "https://coryn.club/skill.php?tree=Assassin"
]

# Load existing data if the JSON file exists
file_path = "database/s_weapons.json"
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
else:
    data = []

input_choose = -1
# Loop through each URL
for url in skill_weapons:
    try:
        # Send a GET request to fetch the page content
        response = requests.get(url)
        response.raise_for_status()  # check for request errors

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all divs with class "card-container-1"
        cards = soup.find_all("div", class_="card-container-1")

        # Loop through each card div
        for card in cards:
            # Extract all text data from nested divs within each card
            nested_data = []
            for nested_div in card.find_all("div"):
                text = nested_div.get_text(strip=True)
                if text:
                    nested_data.append(text)
            
            # Append the data for each card
            card_data = {
                "url": url,
                "content": nested_data
            }
            data.append(card_data)

    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")

# Write updated data back to the JSON file
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("New data has been appended to cards_data.json")
