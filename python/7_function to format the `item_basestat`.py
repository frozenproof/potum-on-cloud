import re

# Function to format the `item_basestat` text
def format_basestat(text):
    # Insert newline after a percentage symbol
    # formatted_text = text.replace("%", "%\n")

    # Insert a newline only between a number and the following word if they are directly adjacent and likewise
    formatted_text = re.sub(r'(\d)([A-Za-z])', r'\1\n\2', text)
    formatted_text = re.sub(r'([A-Za-z])(\d)', r'\1\n\2', formatted_text)
    
    # Step 4: Insert a newline after a closing parenthesis if followed by text
    formatted_text = re.sub(r'\)([A-Za-z])', r')\n\1', formatted_text)
    formatted_text = re.sub(r'\)(\d)', r')\n\1', formatted_text)

    # Step 6: Split compound words with two capital letters inside (e.g., "ThroatGuard" to "Throat\nGuard")
    formatted_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', formatted_text)
    # formatted_text = re.sub(r'([A-Z])([a-z])', r'\1 \2', formatted_text)

    # Replace unnecessary spaces in certain contexts (retain this if "stronger" is special)
    formatted_text = formatted_text.replace("stronger ", "\stronger ")

    # Remove excessive newlines
    formatted_text = re.sub(r'\n{2,}', '\n', formatted_text)

    return formatted_text.strip()

    # # Step 1: Insert a newline between a number and the following word if directly adjacent
    # formatted_text = re.sub(r'(\d+)([A-Za-z])', r'\1\n\2', text)
    
    # # Step 2: Insert a newline between a word and a number if directly adjacent
    # formatted_text = re.sub(r'([A-Za-z])(\d)', r'\1\n\2', formatted_text)
    
    # # Step 3: Replace spaces in front of numbers with a newline
    # formatted_text = re.sub(r'\s+(\d)', r'\n\1', formatted_text)

    # # Step 4: Insert a newline after a closing parenthesis if followed by text
    # formatted_text = re.sub(r'\)([A-Za-z])', r')\n\1', formatted_text)

    # # Step 5: Insert a newline after a colon if followed by text
    # formatted_text = re.sub(r':\s*([A-Za-z])', r':\n\1', formatted_text)

    # # Step 6: Split compound words with two capital letters inside (e.g., "ThroatGuard" to "Throat\nGuard")
    # formatted_text = re.sub(r'([a-z])([A-Z])', r'\1\n\2', formatted_text)

    # # Step 7: Replace multiple newlines with a single newline
    # formatted_text = re.sub(r'\n{2,}', '\n', formatted_text)

    # # Return the final formatted text
    # return formatted_text.strip()

# # Example usage
input_text = "Stat/EffectAmountATK %11Stability %10Physical Pierce %20ASPD900% stronger against Light10Dark Element0Guard Break %30"
result = format_basestat(input_text)
print(result)