import requests
from bs4 import BeautifulSoup
import json
import time
import os
import pandas as pd
import re

# Function to format the `item_basestat` text
def format_basestat(text):
    # Step 1: Insert a newline between a number and the following word if directly adjacent
    formatted_text = re.sub(r'(\d+)([A-Za-z])', r'\1\n\2', text)
    
    # Step 2: Insert a newline between a word and a number if directly adjacent
    formatted_text = re.sub(r'([A-Za-z])(\d)', r'\1\n\2', formatted_text)
    
    # Step 3: Replace spaces in front of numbers with a newline
    formatted_text = re.sub(r'\s+(\d)', r'\n\1', formatted_text)

    # Step 4: Insert a newline after a closing parenthesis if followed by text
    formatted_text = re.sub(r'\)([A-Za-z])', r')\n\1', formatted_text)

    # Step 5: Insert a newline after a colon if followed by text
    formatted_text = re.sub(r':\s*([A-Za-z])', r':\n\1', formatted_text)

    # Step 6: Split compound words with two capital letters inside (e.g., "ThroatGuard" to "Throat\nGuard")
    formatted_text = re.sub(r'([a-z])([A-Z])', r'\1\n\2', formatted_text)

    # Step 7: Replace multiple newlines with a single newline
    formatted_text = re.sub(r'\n{2,}', '\n', formatted_text)

    # Return the final formatted text
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
    # data = []  # Initialize the data list o87nce per skill_category
    data = set()  # Initialize the data list once per skill_category
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
                    for word in words_to_remove:
                        raw_basestat = raw_basestat.replace(word,"")
                    
                    final_basestat = format_basestat(raw_basestat)
                    final_basestat = raw_basestat.replace("%","%\n")
                    final_basestat = final_basestat.replace("Critical Rate","\nCritical Rate\n")
                    final_basestat = final_basestat.replace("Dodge","Dodge\n")
                    final_basestat = final_basestat.replace(")",")\n")
                    final_basestat = final_basestat.replace("Barrier","\nBarrier")
                    final_basestat = final_basestat.replace("TK","TK\n")
                    final_basestat = final_basestat.replace("ASPD","\nASPD")
                    final_basestat = final_basestat.replace("MSPD","\nMSPD")
                    final_basestat = final_basestat.replace("DEF","\nDEF")
                    final_basestat = final_basestat.replace("MDEF","\nMDEF")
                    final_basestat = final_basestat.replace("MaxHP","\nMaxHP")
                    final_basestat = final_basestat.replace("MaxMP","\nMaxMP")
                    final_basestat = final_basestat.replace("Potential","\nPotential\n")
                    final_basestat = final_basestat.replace("Critical Damage","\nCritical Damage\n")
                    final_basestat = final_basestat.replace("Attack MP Recovery","\nAttack MP Recovery\n")
                    final_basestat = final_basestat.replace("Base Stability","\nBase Stability")
                    final_basestat = final_basestat.replace("Aggro","\nAggro")
                    final_basestat = final_basestat.replace("\n\n","\n")
                    card_data["StatEffect_Amount"] = final_basestat  # Apply formatting function
                # Extract `item-obtainfrom`
                obtainfrom_div = card.find("div", class_="table-grid no-head item-obtainfrom pagination-js-items")
                if obtainfrom_div:
                    raw_md_map = obtainfrom_div.get_text(strip=True)
                    final_md_map = format_basestat(raw_md_map)
                    card_data["MonsterDyeMap"] = final_md_map
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
                    raw_recipe = prop_div.get_text(strip=True).strip()
                    print(raw_recipe)
                    for word in words_to_remove:
                        raw_recipe = raw_recipe.replace(word,"")
                
                    # print("this is debug line for scrapping \n\n\n\n",raw_basestat,"  \n\n\n")
                    raw_recipe = raw_recipe.replace(raw_basestat,"")
                    raw_recipe = raw_recipe.replace(raw_md_map,"")
                    raw_recipe = format_basestat(raw_recipe)
                    print(raw_recipe)
                    raw_recipe = raw_recipe.replace(" SpinaSet","\nSpina\nSet")
                    raw_recipe = raw_recipe.replace(" pcsLevel","Level")
                    raw_recipe = raw_recipe.replace("Fall \n","Fall ")
                    raw_recipe = raw_recipe.replace("Summer \n","Summer ")
                    raw_recipe = raw_recipe.replace("Winter \n","Winter ")
                    raw_recipe = raw_recipe.replace("Fall \n","Fall ")
                    raw_recipe = raw_recipe.replace("Spring \n","Spring ")
                    raw_recipe = raw_recipe.replace("Lv\n","Lv ")
                    raw_recipe = raw_recipe.replace("\n)",") ")
                    raw_recipe = raw_recipe.replace(")\n(",")(")
                    raw_recipe = raw_recipe.replace("\n\n","\n")

                    card_data["Recipes"] = raw_recipe
                    print(raw_recipe)
                    print("-----\n")
                if (title_div and basestat_div):
                    # Serialize card_data to a JSON string to ensure order and add to the set
                    card_data_json = json.dumps(card_data, ensure_ascii=False)
                    data.add(card_data_json)
                
            time.sleep(9)
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
    # Convert set of JSON strings back to a list of dicts
    data_list = [json.loads(item) for item in data]
    try: 
        # Save data to JSON
        with open(file_path_json, "w", encoding="utf-8") as f:
            json.dump(data_list, f, ensure_ascii=False, indent=4)
        # Convert data to a DataFrame for Excel output
        df = pd.DataFrame(data_list)
        df.to_excel(file_path_excel, index=False)
    
    except requests.RequestException as e:
        print(f"Error insertion {url}: {e}")
        exit(0)
print("Data has been saved to JSON and Excel.")