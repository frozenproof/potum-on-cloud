import requests
from bs4 import BeautifulSoup
import json
import time
import os
import pandas as pd
import re

# List of URLs to scrape
list_of_skills= {
    "Extra": {
        "smith" : [
            "https://coryn.club/guide.php?key=smith",
            # Add more URLs as needed
        ],
    }
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
        print(file_path_json)

        for url in urls:
            print(f"Category: {main_category}, Subcategory: {subcategory}, URL: {url}")
            try:
                # Send a GET request to fetch the page content
                response = requests.get(url)
                response.raise_for_status()  # Check for request errors

                # Parse the HTML content
                soup = BeautifulSoup(response.text, 'html.parser')

                # # Find all relevant divs with the specified class
                # print("debug",soup,"\n\n")

                # Find all relevant divs with the specified class
                cards_do_not_delete = soup.find_all("div",{"id": "articlebody"})

                data.append(cards_do_not_delete)
                # print(cards_do_not_delete)

                

            except requests.RequestException as e:
                print(f"Error fetching {url}: {e}")

        # # Write updated data back to the JSON file
        with open(file_path_json, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)


print("New data has been appended to cards_data.json")

