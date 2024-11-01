import requests
from bs4 import BeautifulSoup
import json
import time
import os
import pandas as pd
import re

# List of URLs to scrape
list_of_skills= {
    "Weapon": {
        "Blade" : [
            "https://coryn.club/skill.php?tree=Blade",
            # Add more URLs as needed
        ],
    #     "Shot" : [
    #         "https://coryn.club/skill.php?tree=Shot",
    #     ],
    #     "Magic": [
    #         "https://coryn.club/skill.php?tree=Magic",
    #     ],
    #     "Martial": [
    #         "https://coryn.club/skill.php?tree=Martial",
    #     ],
    #     "DualSword" : [
    #         "https://coryn.club/skill.php?tree=DualSword",
    #     ],
    #     "Halberd" : [
    #         "https://coryn.club/skill.php?tree=Halberd",
    #     ],
    #     "Mononofu" : [
    #         "https://coryn.club/skill.php?tree=Mononofu",
    #     ],
    #     "Barehand" : [
    #         "https://coryn.club/skill.php?tree=Barehand",
    #     ],
    #     "Crusher": [
    #         "https://coryn.club/skill.php?tree=Crusher",
    #     ],
    #     "Sprite": [
    #         "https://coryn.club/skill.php?tree=Sprite"
    #     ],
    # },
    # "Buff":{
    #     "Guard": [
    #         "https://coryn.club/skill.php?tree=Guard",
    #     ],
    #     "Shield":[
    #         "https://coryn.club/skill.php?tree=Shield",
    #     ],
    #     "Dagger":[
    #         "https://coryn.club/skill.php?tree=Dagger",
    #     ],
    #     "Knight":[
    #         "https://coryn.club/skill.php?tree=Knight",
    #     ],
    #     "Priest":[
    #         "https://coryn.club/skill.php?tree=Priest",
    #     ],
    #     "Assassin":[
    #         "https://coryn.club/skill.php?tree=Assassin",
    #     ],
    #     "Wizard":[
    #         "https://coryn.club/skill.php?tree=Wizard",
    #     ],
    #     "Hunter": [
    #         "https://coryn.club/skill.php?tree=Hunter",
    #     ],
    #     "DarkPower": [
    #         "https://coryn.club/skill.php?tree=DarkPower",
    #     ],
    #     "MagicBlade": [
    #         "https://coryn.club/skill.php?tree=MagicBlade",
    #     ],
    #     "Ninja": [
    #         "https://coryn.club/skill.php?tree=Ninja",
    #     ],
    #     "Partisan":[
    #         "https://coryn.club/skill.php?tree=Partisan"
    #     ]
    },
    # "Assist":{
    #     "Survival": [
    #         "https://coryn.club/skill.php?tree=Survival",
    #         ],
    #     "Support":  [
    #         "https://coryn.club/skill.php?tree=Support",
    #     ],
    #     "Minstrel":[
    #         "https://coryn.club/skill.php?tree=Minstrel",
    #     ],
    #     "Dancer": [
    #         "https://coryn.club/skill.php?tree=Dancer",
    #     ],
    #     "Battle": [
    #         "https://coryn.club/skill.php?tree=Battle"
    #     ]
    # },
    # "Other": {
    #         "Smith": [
    #             "https://coryn.club/skill.php?tree=Smith",
    #         ],
    #         "Alchemy": [
    #             "https://coryn.club/skill.php?tree=Alchemy",
    #         ],
    #         "Tamer": [
    #             "https://coryn.club/skill.php?tree=Tamer",
    #         ],
    #         "Scroll": [
    #             "https://coryn.club/skill.php?tree=Scroll"
    #         ]
    #     }
}

keys_list = list(list_of_skills.keys())
values_list = list(list_of_skills.values())
# print (keys_list,"\n\n\n\n\n",values_list)
final_list = list_of_skills.items()
# Load existing data if the JSON file exists
data = []
input_choose = -1
file_path_main = "database/s2/"

# Loop through the nested dictionary to access each URL
for main_category, subcategories in final_list:
    data = []
    for subcategory, urls in subcategories.items():
        os.makedirs(file_path_main, exist_ok=True)
        file_path_json = file_path_main + main_category + f"{subcategory}" + ".json"
        for url in urls:
            print(f"Category: {main_category}, Subcategory: {subcategory}, URL: {url}")
            print(file_path_json)
            try:
                # Send a GET request to fetch the page content
                response = requests.get(url)
                response.raise_for_status()  # Check for request errors

                # Parse the HTML content
                soup = BeautifulSoup(response.text, 'html.parser')

                # # Find all relevant divs with the specified class
                # print("debug",soup,"\n\n")

                # Find all relevant divs with the specified class
                cards_do_not_delete = soup.find_all("div", class_ ="card-container-1")

                # print(cards_do_not_delete)

                # If the divs are found, extract and store the content
                for card in cards_do_not_delete[0:]:
                    card_data = {
                        "Name": "empty",
                        "Tier": "empty",
                        "Weapon": "empty",
                        "Stats": "empty",
                        "Description": "empty",
                        "More": "empty",
                    }
                    
                    print(card)
                    print("debug -line end")
                    title_div = card.find("div", class_="card-title")
                    if title_div:
                        print(title_div)
                        card_data["Name"] = title_div.get_text(strip=True)

                    tier = card.find("p", class_="medium")
                    if tier:
                        card_data["Tier"] = tier.get_text(strip=True)
                    
                    weapon = card.find("div", style = "justify-self:end;")
                    if weapon:
                        card_data["Weapon"] = weapon.get_text(strip=True)
                
                    stats = card.find("div", class_="monster-prop")
                    if stats:
                        card_data["Stats"] = stats.get_text(strip=True)
                
                    description = card.find("div", class_="span-2")
                    if description:
                        card_data["Description"] = description.get_text(strip=True)
                
                    more = card.find("details")
                    if more:
                        card_data["More"] = more.get_text(strip=True)
                
                exit(0)

                time.sleep(3)

            except requests.RequestException as e:
                print(f"Error fetching {url}: {e}")

        # # Write updated data back to the JSON file
        # with open(file_path_json, "w", encoding="utf-8") as f:
        #     json.dump(data, f, ensure_ascii=False, indent=4)


print("New data has been appended to cards_data.json")

