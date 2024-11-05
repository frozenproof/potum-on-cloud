import os
import ast

def find_imports_in_file(file_path):
    """Extract import statements from a Python file."""
    imports = []
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            file_content = file.read()
            node = ast.parse(file_content, filename=file_path)
            for n in ast.walk(node):
                if isinstance(n, (ast.Import, ast.ImportFrom)):
                    imports.append(ast.get_source_segment(file_content, n))
    except SyntaxError as e:
        print(f"Syntax error in file {file_path}: {e}")
    except IndexError as e:
        print(f"Index error in file {file_path}: {e}")
    return imports

def crawl_directory_for_imports(root_dir):
    """Crawl through the current directory and all its subdirectories to find imports in Python files."""
    all_imports = {}
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.py'):
                file_path = os.path.join(dirpath, filename)
                imports = find_imports_in_file(file_path)
                all_imports[file_path] = imports
    return all_imports

if __name__ == '__main__':
    # Get the current directory
    current_directory = os.getcwd()
    imports_found = crawl_directory_for_imports(current_directory)

    # Print the found imports
    for file_path, imports in imports_found.items():
        print(f"\nImports in {file_path}:")
        for imp in imports:
            print(f"  {imp}")
