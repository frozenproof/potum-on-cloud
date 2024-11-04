from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
import os

app = Flask(__name__, template_folder='../templates')

# Set the absolute path for the metadata file
metadata_path = os.path.abspath("./database/metadata.xlsx")

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

    # Construct the full path to the selected Excel file
    file_path = os.path.join(os.path.abspath("./database"), relative_file_path)
    df = pd.read_excel(file_path)

    # Search functionality
    if search_query:
        df = df[df.apply(lambda row: row.astype(str).str.contains(search_query, case=False).any(), axis=1)]

    # Replace newline characters with <br> for HTML rendering
    df = df.applymap(lambda x: str(x).replace('\n', '<br>') if isinstance(x, str) else x)

    # Convert DataFrame to HTML
    table_html = df.to_html(classes="table table-bordered center,", index=False, escape=False)
    return render_template('table_view.html', file_mapping=file_mapping, table=table_html)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use the port set by Render, or default to 5000
    app.run(host="0.0.0.0", port=port)  #
    # app.run(debug=True)
