import requests
from bs4 import BeautifulSoup
import json
import time
import os
import pandas as pd
import re

def starts_with_sell(text):
    return text.startswith("sell") or text.startswith("Sell")

# Function to format the `item_basestat` text
def format_basestat(text):
    # Insert a newline only between a number and the following word if they are directly adjacent
    formatted_text = re.sub(r'(\d)([A-Za-z])', r'\1\n\2', text)
    
    # Ensure numbers next to words like "Element" and stats are separated properly
    formatted_text = re.sub(r'(\D)(\d+)(?=\D)', r'\1\n\2\n', formatted_text)
    
    # Ensure % signs are handled and newlines are consistently applied
    formatted_text = re.sub(r'(?<=%)\s*(?=[A-Za-z])', '\n', formatted_text)
    
    # Clean up extra newlines if any were added
    formatted_text = re.sub(r'\n{2,}', '\n', formatted_text)
    
    return formatted_text.strip()

# List of URLs to scrape
list_of_weapons = [
    {
        "NormalMonsters": [
            "https://coryn.club/monster.php?&show=3999&type=N&order=level&p=0"
        ], 
    },
    {
        "Miniboss": [
            "https://coryn.club/monster.php?&show=999&type=M&order=level&p=0",
        ],
    },
    {
        "Boss": [
            "https://coryn.club/monster.php?&show=299&type=B&order=level&p=0",
        ],
    }
]

# Create the directories if they don't exist
file_path_main = "database/"
file_path_main += "m4/"
os.makedirs(file_path_main, exist_ok=True)

# Loop through the list of dictionaries and access each category and URLs
for category_dict in list_of_weapons:
    for skill_category, urls in category_dict.items():
        file_path_json = file_path_main + f"{skill_category}.json"
        file_path_excel = file_path_main + f"{skill_category}.xlsx"
        
        # Print the paths for verification
        print(f"JSON Path: {file_path_json}")
        print(f"Excel Path: {file_path_excel}")
        data = set()  # Initialize the data set once per skill_category
        words_to_remove = ["Stat/Effect", "Amount", "Recipe", "Obtained FromMonsterDyeMap", "Fee"]

        for url in urls:
            try:
                # Send a GET request to fetch the page content
                response = requests.get(url)
                response.raise_for_status()  # Check for request errors

                # Parse the HTML content
                soup = BeautifulSoup(response.text, 'html.parser')

                # Find all relevant divs with the specified class
                cards_do_not_delete = soup.find_all("div")

                # Extract and store the content for each card
                for card in cards_do_not_delete[0:]:
                    card_data = {
                        "Name": "empty",
                        "Stats": "empty",
                        "SpawnAt": "empty",
                        "Drops": "empty",
                    }

                    # Extract `card-title`
                    title_div = card.find("div", class_="card-title-inverse")
                    if title_div:
                        card_data["Name"] = title_div.get_text(strip=True)

                    # Extract `item-basestat` and apply formatting
                    basestat_div = card.find_all("div", class_="item-prop")
                    if basestat_div:
                        raw_basestat = basestat_div[0].get_text(strip=True)
                        for word in words_to_remove:
                            raw_basestat = raw_basestat.replace(word, "")
                        card_data["Stats"] = format_basestat(raw_basestat)

                    # Get the second element (index 1)
                    if len(basestat_div) > 1:
                        obtainfrom_div = basestat_div[1]
                        if obtainfrom_div:
                            raw_md_map = obtainfrom_div.get_text(strip=True)
                            raw_md_map = raw_md_map.replace("Spawn at", "")
                            card_data["SpawnAt"] = raw_md_map

                    # Extract `item-prop`
                    prop_div = card.find("div", class_="pagination-js-items monster-drop-list")
                    if prop_div:
                        raw_recipe = prop_div.get_text(strip=True).strip()
                        for word in words_to_remove:
                            raw_recipe = raw_recipe.replace(word, "")
                        raw_recipe = raw_recipe.replace("[", "\n[")
                        raw_recipe = raw_recipe.replace("Element", "\n")
                        raw_recipe = raw_recipe.replace("Exp", "\n")
                        card_data["Drops"] = raw_recipe
                        
                    if title_div and basestat_div and obtainfrom_div and prop_div:
                        # Serialize card_data to a JSON string to ensure order and add to the set
                        card_data_json = json.dumps(card_data, ensure_ascii=False)
                        data.add(card_data_json)

                time.sleep(9)

            except requests.RequestException as e:
                print(f"Error fetching {url}: {e}")

        # Convert set of JSON strings back to a list of dicts
        data_list = [json.loads(item) for item in data]

        # Save data to JSON
        with open(file_path_json, "w", encoding="utf-8") as f:
            json.dump(data_list, f, ensure_ascii=False, indent=4)

        # Convert data to a DataFrame for Excel output
        df = pd.DataFrame(data_list)
        df.to_excel(file_path_excel, index=False)

print("Data has been saved to JSON and Excel.")
