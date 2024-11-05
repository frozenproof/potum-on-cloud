from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
import os
import platform

# Define a custom Flask class
class CustomFlask(Flask):
    def __init__(self, import_name, template_folder=None, static_url_path=None):
        super().__init__(import_name, template_folder=template_folder, static_url_path=static_url_path)
        # Additional initialization or custom behavior can be added here
        print("CustomFlask initialized with template folder:", template_folder)

# Initialize the app with the custom Flask class
app = CustomFlask(__name__, template_folder='../templates', static_url_path="../images")

# Determine metadata file based on OS
metadata_file = "metadata_windows.xlsx" if platform.system() == "Windows" else "metadata_linux.xlsx"
metadata_path = os.path.abspath(os.path.join("database", metadata_file))

# Load metadata for filenames, display names, and paths
try:
    metadata_df = pd.read_excel(metadata_path)
    file_mapping = dict(zip(metadata_df["filepath"], metadata_df["display_name"]))
except FileNotFoundError:
    print(f"Error: Metadata file not found at {metadata_path}")
    file_mapping = {}

@app.route('/')
def index():
    return render_template('table_view.html', file_mapping=file_mapping, table="")

@app.route('/view', methods=['POST'])
def view_file():
    relative_file_path = request.form['file']
    search_query = request.form.get('search', '')

    # Construct full path to the selected Excel file
    file_path = os.path.join(os.path.abspath("./database"), relative_file_path)
    if not os.path.exists(file_path):
        return render_template('table_view.html', file_mapping=file_mapping, table="<p>Error: File not found</p>")

    df = pd.read_excel(file_path)

    # Apply search query filter
    if search_query:
        df = df[df.apply(lambda row: row.astype(str).str.contains(search_query, case=False).any(), axis=1)]

    # Replace newline characters with <br> for HTML rendering
    df = df.applymap(lambda x: str(x).replace('\n', '<br>') if isinstance(x, str) else x)

    # Convert DataFrame to HTML
    table_html = df.to_html(classes="table table-bordered center", index=False, escape=False)
    return render_template('table_view.html', file_mapping=file_mapping, table=table_html)

@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
