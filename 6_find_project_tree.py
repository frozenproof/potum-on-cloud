import os

def write_folder_structure(folder_path, file, ignored_folders, indent=0):
    """Recursively writes the folder structure with indentation to a file, ignoring specified folders."""
    items = sorted(os.listdir(folder_path))
    for item in items:
        item_path = os.path.join(folder_path, item)
        # Skip ignored folders
        if os.path.isdir(item_path) and item in ignored_folders:
            continue
        if os.path.isdir(item_path):
            file.write(" " * indent + f"/{item}/ -> Contains subfolders or files\n")
            write_folder_structure(item_path, file, ignored_folders, indent + 2)
        else:
            file.write(" " * indent + f"- {item} -> File\n")

if __name__ == "__main__":
    current_dir = os.getcwd()
    output_file = "folder_structure.txt"
    ignored_folders = ["node_modules", ".git", "__pycache__",".vscode","python","z_docker_commands_archive"]  # Add folder names to ignore
    
    with open(output_file, "w") as file:  # Open in append mode
        file.write(f"Folder Structure for: {current_dir}\n")
        write_folder_structure(current_dir, file, ignored_folders)
        file.write("\n")  # Add a newline for separation between runs

    print(f"Folder structure saved to {output_file}, ignoring folders: {ignored_folders}")
