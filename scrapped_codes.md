
# while(input_choose not in range(0,9)):
#     input_choose=input("Please input number to scrap data from")

# # Loop through each URL
# for url in list_of_skills["skill_buffs"]:
#     try:
#         # Send a GET request to fetch the page content
#         response = requests.get(url)
#         response.raise_for_status()  # check for request errors

#         # Parse the HTML content
#         soup = BeautifulSoup(response.text, 'html.parser')

#         # Find all divs with class "card-container-1"
#         cards = soup.find_all("div", class_="card-container-1")

#         # Loop through each card div
#         for card in cards:
#             # Extract all text data from nested divs within each card
#             nested_data = []
#             for nested_div in card.find_all("div"):
#                 text = nested_div.get_text(strip=True)
#                 if text:
#                     nested_data.append(text)
            
#             # Append the data for each card
#             card_data = {
#                 "url": url,
#                 "content": nested_data
#             }
#             data.append(card_data)

#     except requests.RequestException as e:
#         print(f"Error fetching {url}: {e}")
