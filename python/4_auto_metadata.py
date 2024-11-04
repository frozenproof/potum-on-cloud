import os
import pandas as pd

# Directory where the Excel files are stored in subfolders
database_dir = "database"

# List to store file information
file_data = []

# Walk through each subfolder in the database directory
for root, dirs, files in os.walk(database_dir):
    for file in files:
        if file.endswith(".xlsx") and file != "metadata.xlsx":  # Exclude metadata file itself
            # Get relative path and create a default display name
            relative_path = os.path.relpath(os.path.join(root, file), database_dir)
            display_name = os.path.splitext(file)[0]  # Default display name is the filename without extension
            file_data.append({"filepath": relative_path, "display_name": display_name})

# Convert list to DataFrame
metadata_df = pd.DataFrame(file_data)

# Save DataFrame to an Excel file in the database folder
metadata_file_path = os.path.join(database_dir, "metadata.xlsx")
metadata_df.to_excel(metadata_file_path, index=False)

print(f"Metadata file created at: {metadata_file_path}")
