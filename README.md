# Potum on cloud
The unofficial mirror of Coryn Club, since Coryn Club can't handle too much bandwidth. Only for searching items, information on each item are as close to Coryn as it can get, but no visual display so we can add that once we have more time.

The project is back and more alive than ever(until I have a proper job that is)

I have added a ton of functionalities to my website, come and visit.

<a href="https://potum-on-cloud.onrender.com" _target=blank>Here</a> is the link.

# Functionalities
1. Search monsters
2. Search weapon
3. Search monsters according to preferred levels.
4. View skills trees ( currently working on)
# Codes 
Made manually, I would have scrapped if it wasn't illegal.

alt+shift+f to auto indent btw
# Code warning
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.
Compile flag for dockerfile for render will probably break your build if you are not careful, so remove it, it is only used in deployment on render.com.

Enough about breaking codes, about the difficulty. How hard is it to type codes when having 3 tests per week?

Very **hard**
# Start server.js as a child process or a standalone, see below
const childProcess = spawn('node', ['server/server.js'], { stdio: 'inherit' });
// The proxy server need this because the proxy server is now the one serving static files
app.use('/images', express.static(path.join(__dirname, '../images')));
// The reason why we can run the excels as normal are because the resource itself is found by the child server, which then got rendered into raw html then sent to the proxy server
# The proxy server allow you to control rate limit better and still allow the original server as a standalone, this helps with debugging and understanding the mechanisms of a standard network service.
# The docker image support is NOT being moved to proxy server, it doesn't consume much more resources and allows additional sub servers, BUT CORS IS A BITC for deployment.


# Database
Scrapped from Coryn, delays of 9 seconds per website load to avoid DDOS.

Scripts used are in python folder.
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

# How to run

Important: Node version need linux, you can choose

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

# Explanation
The metadata files inside of the database folder tells the server what to find inside of the database, generated from 4_auto_metadata.py.

We can also add google search index to allow others to visit our websites.

# Debug lines

    <!-- <% console.log(table) %> -->

by the way, data power also require to change the currently connected network on ethernet to ethernet. 

If it works it works, now go and commit tax evasions.

# Upcoming

Illegal waifus are invading the websites but hell, i fucking hate source control
Updated version of the farming search
We gonna deploy a secret
See if this get detected, lmao fuck the SSH editing configuration

# Fixing the wsl bug with git
First of all, install the git inside the fucking wsl.
Secondly, enter the fucking git path manually, inside remote settings. 

# Dockering processs 

docker image remove poc \
&& docker image remove truclinhgm/poc:deploy-ready

docker compose build

docker tag poc truclinhgm/poc:deploy-ready

docker push truclinhgm/poc:deploy-ready
