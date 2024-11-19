import os

def print_folder_structure(folder_path, indent=0):
    """Recursively prints the folder structure with indentation."""
    items = sorted(os.listdir(folder_path))
    for item in items:
        item_path = os.path.join(folder_path, item)
        if os.path.isdir(item_path):
            print(" " * indent + f"/{item}/ -> Contains subfolders or files")
            print_folder_structure(item_path, indent + 2)
        else:
            print(" " * indent + f"- {item} -> File")

if __name__ == "__main__":
    current_dir = os.getcwd()
    print(f"Folder Structure for: {current_dir}")
    print_folder_structure(current_dir)
