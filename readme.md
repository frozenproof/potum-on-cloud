# Potum on cloud
The unofficial mirror of Coryn Club, since Coryn Club can't handle too much bandwidth. Only for searching items, information on each item are as close to Coryn as it can get, but no visual display so we can add that once we have more time.

# Codes 
Made manually, I would have scrapped if it wasn't illegal.

# Datbase
Scrapped from Coryn, delays of 9 seconds per website load to avoid DDOS.

# How to run
Run command
```
python3 ./server/server.py
```
Node version
```
node ./server/server.js
```

# How to use
class="card-container" or "class="card-container-1" was how we scrape the data from the website, we used to use these names for the python scripts.
now we crawl properly through each document

# How to build your own
Run all scrapping python scripts, and run 0_find_import, then use pip list and chatgpt to make requirements.txt if you want to deploy your own version on python.

On js, do the same thing by asking chatgpt what imports are used and reinstall the libraries.

On deployment, use
```
pip install -r requirements.txt
```
Node version
```
npm install
```
# Explanation
The metadata files inside of the database folder tells the server what to find inside of the database, generated from 4_auto_metadata.py.

# Debug lines

    <!-- <% console.log(table) %> -->
