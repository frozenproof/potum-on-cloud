import os
import re

# List of folder names to ignore (add folders to this list)
IGNORE_FOLDERS = ['node_modules', 'dist', 'build']  # Example folder names to ignore

def find_imports_and_requires(directory):
    imports = set()  # Use a set to avoid duplicate entries
    # Regular expressions to capture import and require statements
    import_pattern = r"import\s+(\S+)"
    require_pattern = r"require\(\s*['\"](\S+)['\"]\s*\)"

    # Walk through all files in the directory and subdirectories
    for root, dirs, files in os.walk(directory):
        # Skip directories that are in the ignore list
        dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]

        for file in files:
            if file.endswith(".js"):  # Only process .js files
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Find all imports
                    imports.update(re.findall(import_pattern, content))
                    # Find all requires
                    imports.update(re.findall(require_pattern, content))

    return imports

def save_to_file(imports, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for imp in sorted(imports):
            f.write(imp + '\n')

def main():
    # Get the current directory
    directory = os.getcwd()
    imports = find_imports_and_requires(directory)

    # Output file path
    output_file = 'found_js_imports.txt'

    # Save results to the text file
    if imports:
        save_to_file(imports, output_file)
        print(f"Found imports and requires. Results saved to {output_file}")
    else:
        print("No imports or requires found.")

if __name__ == "__main__":
    main()
