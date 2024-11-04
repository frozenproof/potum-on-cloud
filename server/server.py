from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__, template_folder=os.path.abspath('../html/'))  # Set the template folder
CORS(app)  # Enable CORS

@app.route('/data', methods=['GET'])
def get_data():
    # Load data from a JSON file located in the 'data' folder
    df = pd.read_json('database/m4/NormalMonsters.json')  # Change this if using Excel
    data = df.to_dict(orient='records')
    return jsonify(data)

@app.route('/', methods=['GET'])
def index():
    # Load data from the JSON file to display on the HTML page
    df = pd.read_json('database/m4/NormalMonsters.json')  # Change this if using Excel
    data = df.to_dict(orient='records')
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
