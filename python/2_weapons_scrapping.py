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

# # Example usage
# input_text = "Stat/EffectAmountATK %11Stability %10Physical Pierce %20ASPD900% stronger against Light10Dark Element0Guard Break %30"
# result = format_basestat(input_text)
# print(result)

# List of URLs to scrape
list_of_weapons = {
    "weapons": {
        "1hs": [
            "https://coryn.club/item.php?&show=455&type=4&order=atk%20ASC,name&p=0"
        ], 
        "2hs": [
            "https://coryn.club/item.php?&show=455&type=5&order=atk%20ASC,name&p=0",
        ],
        "Bow": [
            "https://coryn.club/item.php?&show=455&type=9&order=atk%20ASC,name&p=0",
        ],
        "Bowgun": [
            "https://coryn.club/item.php?&show=455&type=10&order=atk%20ASC,name&p=0",
        ],
        "Knuckles": [
            "https://coryn.club/item.php?&show=455&type=13&order=atk%20ASC,name&p=0",
        ],
        "Magic_Device": [
            "https://coryn.club/item.php?&show=455&type=15&order=atk%20ASC,name&p=0",
        ],
        "Staff": [
            "https://coryn.club/item.php?&show=455&type=19&order=atk%20ASC,name&p=0",
        ],
        "Halberd": [
            "https://coryn.club/item.php?&show=455&type=26&order=atk%20ASC,name&p=0",
        ],
        "Katana": [
            "https://coryn.club/item.php?&show=455&type=27&order=atk%20ASC,name&p=0",
        ],
        "Dagger": [
            "https://coryn.club/item.php?&show=149&type=11&order=atk%20ASC,name&p=0",
        ],
        "Arrow": [
            "https://coryn.club/item.php?&show=149&type=7&order=atk%20ASC,name&p=0",
        ],
        "Shield": [
            "https://coryn.club/item.php?&show=455&type=17&order=def%20ASC,name&p=0",
        ],
        "Ninjutsu_Scroll": [
            "https://coryn.club/item.php?type=28&order=id,name",
        ],
        "Armor": [
            "https://coryn.club/item.php?&show=455&type=8&order=def%20ASC,name&p=0",
        ],
        "Additional": [
            "https://coryn.club/item.php?&show=455&type=6&order=def%20ASC,name&p=0",
        ],
        "Special": [
            "https://coryn.club/item.php?&show=455&type=18&order=def%20ASC,name&p=0",
        ],
    }
}

# Create the directories if they don't exist
file_path_main = "database/"
file_path_main += "w3/"
os.makedirs(file_path_main, exist_ok=True)

for skill_category, urls in list_of_weapons["weapons"].items():
    file_path_json = file_path_main+f"{skill_category}.json"
    file_path_excel = file_path_main+f"{skill_category}.xlsx"
    data = []  # Initialize the data list once per skill_category
    words_to_remove = ["Stat/Effect", "Amount","Recipe","Obtained FromMonsterDyeMap","Fee"]
    for url in urls:
        try:
            # Send a GET request to fetch the page content
            response = requests.get(url)
            response.raise_for_status()  # Check for request errors

            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find all relevant divs with the specified class
            cards_big_do_not_delete = soup.find_all("div", class_="card-container")
            cards_do_not_delete = soup.find_all("div")
            # cards_ul_e = soup.find_all("ul")
            # cards_do_not_delete = cards_big_do_not_delete

            # print(cards)
            with open("Output.txt", "w", encoding='cp932', errors='ignore') as text_file:
                text_file.write("\n\n\n" + str(cards_do_not_delete))
            # exit(0)
            # print("\n\n\n\n\ncard data\n\n\n\n",len(cards))

            # Extract and store the content for each card
            for card in cards_do_not_delete[0:]:
                card_data = {
                    "Name": "empty",
                    "StatEffect_Amount": "empty",
                    "MonsterDyeMap": "empty",
                    "Processing": "empty",
                    "Recipes": "empty",
                }

                len_stat_effect = 0
                len_md_map = 0

                # Extract `card-title`
                title_div = card.find("div", class_="card-title")
                if title_div:
                    card_data["Name"] = title_div.get_text(strip=True)

                # Extract `item-basestat` and apply formatting
                basestat_div = card.find("div", class_="table-grid item-basestat")
                if basestat_div:
                    raw_basestat = basestat_div.get_text(strip=True)
                    len_stat_effect = len(raw_basestat)
                    for word in words_to_remove:
                        raw_basestat = raw_basestat.replace(word,"")
                    card_data["StatEffect_Amount"] = format_basestat(raw_basestat)  # Apply formatting function


                # Extract `item-obtainfrom`
                obtainfrom_div = card.find("div", class_="table-grid no-head item-obtainfrom pagination-js-items")
                if obtainfrom_div:
                    raw_md_map = obtainfrom_div.get_text(strip=True)
                    len_md_map = len(raw_md_map)
                    card_data["MonsterDyeMap"] = raw_md_map

                # Extract `item-prop`
                prop_div = card.find("ul", class_="accordion card-attach-bottom")
                prop_mini = card.find("div", class_="item-prop mini")
                # if len(prop_div) > 2:
                #     card_data["Recipe"] = prop_div[2].get_text(strip=True)
                # elif prop_div:  # Check if prop_div has at least one element
                #     card_data["Recipe"] = prop_div[0].get_text(strip=True)
                # else:
                #     card_data["Recipe"] = "empty"

                if prop_mini:  # Check if prop_div has at least one element
                    card_data["Processing"] = prop_mini.get_text(strip=True)
                
                if prop_div:
                    len_final_cut = 0
                    # len_final_cut += len_stat_effect + len_md_map
                    raw_recipe = prop_div.get_text(strip=True).strip()
                    print(raw_recipe)
                    for word in words_to_remove:
                        raw_recipe = raw_recipe.replace(word,"")
                
                    raw_recipe = raw_recipe.replace(raw_basestat,"")
                    raw_recipe = raw_recipe.replace(raw_md_map,"")
                    raw_recipe = format_basestat(raw_recipe)
                    card_data["Recipes"] = raw_recipe
                    print(raw_recipe)
                    print("-----\n")
                if(title_div is None or basestat_div is None and obtainfrom_div is None and prop_div is None):
                    continue
                # print(title_div)
                
                # Append the card's data to the main list
                data.append(card_data)
                
            time.sleep(9)


        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")

    # Save data to JSON
    with open(file_path_json, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    # Convert data to a DataFrame for Excel output
    df = pd.DataFrame(data)
    df.to_excel(file_path_excel, index=False)


print("Data has been saved to JSON and Excel.")
