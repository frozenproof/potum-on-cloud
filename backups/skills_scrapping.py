import requests
from bs4 import BeautifulSoup
import json
import os
import time

# List of URLs to scrape
list_of_skills= {
    "skills": {
        "skill_weapons" : [
            "https://coryn.club/skill.php?tree=Blade",
            "https://coryn.club/skill.php?tree=Shot",
            "https://coryn.club/skill.php?tree=Magic",
            "https://coryn.club/skill.php?tree=Martial",
            "https://coryn.club/skill.php?tree=DualSword",
            "https://coryn.club/skill.php?tree=Halberd",
            "https://coryn.club/skill.php?tree=Mononofu",
            "https://coryn.club/skill.php?tree=Barehand",
            "https://coryn.club/skill.php?tree=Crusher",
            "https://coryn.club/skill.php?tree=Sprite"
            # Add more URLs as needed
        ], 
        "skill_buffs": [
            "https://coryn.club/skill.php?tree=Guard",
            "https://coryn.club/skill.php?tree=Shield",
            "https://coryn.club/skill.php?tree=Dagger",
            "https://coryn.club/skill.php?tree=Knight",
            "https://coryn.club/skill.php?tree=Priest",
            "https://coryn.club/skill.php?tree=Assassin",
            "https://coryn.club/skill.php?tree=Wizard",
            "https://coryn.club/skill.php?tree=Hunter",
            "https://coryn.club/skill.php?tree=DarkPower",
            "https://coryn.club/skill.php?tree=MagicBlade",
            "https://coryn.club/skill.php?tree=Ninja",
            "https://coryn.club/skill.php?tree=Partisan"
        ],
        "skill_assists": [
            "https://coryn.club/skill.php?tree=Survival",
            "https://coryn.club/skill.php?tree=Support",
            "https://coryn.club/skill.php?tree=Minstrel",
            "https://coryn.club/skill.php?tree=Dancer",
            "https://coryn.club/skill.php?tree=Battle"
        ],
        "skill_others": [
            "https://coryn.club/skill.php?tree=Smith",
            "https://coryn.club/skill.php?tree=Alchemy",
            "https://coryn.club/skill.php?tree=Tamer",
            "https://coryn.club/skill.php?tree=Scroll"
        ]
    }
}

keys_list = list(list_of_skills.keys())
values_list = list(list_of_skills.values())

# Load existing data if the JSON file exists
data = []
input_choose = -1

# Loop through each category and its URLs
for skill_category, urls in list_of_skills["skills"].items():
    file_path = "database/" + skill_category + ".json"
    data = []


    for url in urls:
        try:
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            else:
                data = []
            # Send a GET request to fetch the page content
            response = requests.get(url)
            response.raise_for_status()  # Check for request errors

            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')

            # # Find all relevant divs with the specified class
            # print("debug",soup,"\n\n")

            # Find all relevant divs with the specified class
            cards = soup.find_all("div", class_="card-container-1")

            # If the divs are found, extract and store the content
            for card in cards:
                nested_data = []
                for nested_div in card.find_all("div"):
                    text = nested_div.get_text(strip=True)
                    if text:
                        nested_data.append(text)
                        nested_data.append("\nPOC\n")

                card_data = {
                    "category": skill_category,  # Store the category for context
                    "url": url,
                    "content": nested_data,
                }
                data.append(card_data)
            
            time.sleep(3)

        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")

    # Write updated data back to the JSON file
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

            


print("New data has been appended to cards_data.json")

