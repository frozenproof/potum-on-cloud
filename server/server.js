const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const app = express();
const platform = require('os').platform();
const bodyParser = require('body-parser');

// Use EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'templates'));

// Static folder for images
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/templates', express.static(path.join(__dirname, '..', 'templates')));

// Body parser middleware to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests for debugging
app.use((req, _res, next) => {
    console.log(`Incoming ${req.method} request for: ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// Determine metadata file based on OS
const metadataFile = platform === 'win32' ? 'metadata_windows.xlsx' : 'metadata_linux.xlsx';
const metadataPath = path.join(__dirname, '..', 'database', metadataFile);

console.log(`Metadata file: ${metadataFile}`);
console.log(`Metadata path: ${metadataPath}`);

// Load metadata
let fileMapping = {};
try {
    const workbook = xlsx.readFile(metadataPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    fileMapping = data.reduce((acc, row) => {
        acc[row.filepath] = row.display_name;
        return acc;
    }, {});
    console.log('Metadata loaded successfully');
} catch (error) {
    console.error('Error loading metadata:', error);
}

// Set a default file to load
const defaultFile = Object.keys(fileMapping)[0];  // Get the first file in fileMapping

app.get('/', (_req, res) => {
    console.log('GET request to "/"');
    const filePath = path.join(__dirname, '..', 'database', defaultFile);

    if (fs.existsSync(filePath)) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let df = xlsx.utils.sheet_to_json(sheet);

        if (df.length > 0) {
            // Format the table data to replace \n with <br> in strings
            df = formatTableData(df);
            const headers = Object.keys(df[0]);
            const tableHtml = generateTableHtml(df);
            res.render('table_view', { fileMapping, table: tableHtml, headers });
        } else {
            res.render('table_view', { fileMapping, table: "<p>No data available in the default file</p>", headers: [] });
        }
    } else {
        res.render('table_view', { fileMapping, table: "<p>Error: Default file not found</p>", headers: [] });
    }
});

app.post('/view', (req, res) => {
    const { file, search = '' } = req.body; // Extract file name and search query from request body
    const filePath = path.join(__dirname, '..', 'database', file); // Construct the file path

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return res.render('table_view', { fileMapping, table: "<p>Error: File not found</p>", headers: [] });
    }

    try {
        const workbook = xlsx.readFile(filePath); // Read the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const sheet = workbook.Sheets[sheetName]; // Get the sheet data
        let df = xlsx.utils.sheet_to_json(sheet); // Convert the sheet to JSON

        console.debug(`Loaded ${df.length} rows from sheet: ${sheetName}`);

        // Filter rows based on the search query
        if (search) {
            const lowerSearch = search.toLowerCase(); // Lowercase search for case-insensitive match
            df = df.filter(row =>
                Object.values(row).some(value =>
                    value.toString().toLowerCase().includes(lowerSearch)
                )
            );
            console.debug(`Rows after search filter: ${df.length}`);
        }

        if (df.length > 0) {
            df = formatTableData(df); // Format data (implement your function as needed)
            const headers = Object.keys(df[0]); // Get column headers
            const tableHtml = generateTableHtml(df); // Generate HTML table (implement as needed)
            res.render('table_view', { fileMapping, table: tableHtml, headers });
        } else {
            console.warn("No matching data found");
            res.render('table_view', { fileMapping, table: "<p>No matching data found</p>", headers: [] });
        }
    } catch (error) {
        console.error(`Error processing file: ${error.message}`);
        res.render('table_view', { fileMapping, table: "<p>Error processing the file</p>", headers: [] });
    }
});


app.get('/files', (_req, res) => {
    const filesDir = path.join(__dirname, '..', 'database');
    const downloadableFiles = [];

    // Recursive function to gather all .xlsx files from subdirectories
    function findFilesRecursively(directory) {
        console.log(`Searching in directory: ${directory}`);
        const items = fs.readdirSync(directory, { withFileTypes: true });
        items.forEach(item => {
            const fullPath = path.join(directory, item.name);
            if (item.isDirectory()) {
                findFilesRecursively(fullPath); // Recurse into subdirectory
            } else if (item.isFile() &&(item.name.endsWith('.xlsx') || item.name.endsWith('json'))) {
                console.log(`Found file: ${fullPath}`);
                downloadableFiles.push({
                    name: path.relative(filesDir, fullPath), // Relative path for URL
                    displayName: fileMapping[item.name] || item.name // Display name or filename fallback
                });
            }
        });
    }

    // Start the recursive search
    findFilesRecursively(filesDir);

    // Debug output to check what files were added
    console.log("Files found for download:", downloadableFiles);

    res.render('file_list', { downloadableFiles });
});

app.get('/download/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, '..', 'database', file);

    if (fs.existsSync(filePath)) {
        res.download(filePath, file, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
            }
        });
    } else {
        res.status(404).send("<p>Error: File not found</p>");
    }
});

// Health check API route
app.get('/poc/health', (_req, res) => {
    res.status(200).json({ message: 'API is healthy' });
});

app.get('/rangesearch', (_req, res) => {
    const databaseList = ["Boss", "Miniboss", "NormalMonsters"]; // List of database names
    res.render('rangesearch', { results: [], databaseList }); // Pass the database list to the template
});

// Route to handle the range search
app.post('/rangesearch', (req, res) => {
    const { file, numberInput, rangeInput } = req.body; // Extract file name, base level, and range from request body
    const filePath = path.join(__dirname, '..', 'database', 'm4', file + '.xlsx'); // Construct the file path based on the database file

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        // If it's an API request, return JSON with error, not render
        return res.status(400).json({ error: "File not found" });
    }

    try {
        const workbook = xlsx.readFile(filePath); // Read the Excel file
        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const sheet = workbook.Sheets[sheetName]; // Get the sheet data
        let data = xlsx.utils.sheet_to_json(sheet); // Convert the sheet to JSON

        console.debug(`Loaded ${data.length} rows from sheet: ${sheetName}`);

        // Validate the input values for numberInput and rangeInput
        const baseLevel = parseInt(numberInput);
        const range = parseInt(rangeInput);

        if (isNaN(baseLevel) || isNaN(range)) {
            console.error("Invalid number input or range input");
            // If it's an API request, return JSON with error
            return res.status(400).json({ error: "Invalid base level or range" });
        }

        // Filter rows based on the Stats column (extract number after "Lv")
        const minLevel = baseLevel - range;
        const maxLevel = baseLevel + range;

        const filteredData = data.filter(row => {
            const stats = row.Stats; // Assuming Stats column contains data like "Lv 108"
            const levelMatch = stats.match(/Lv\s*(\d+)/); // Extract number after "Lv"

            if (levelMatch) {
                const level = parseInt(levelMatch[1]);
                return level >= minLevel && level <= maxLevel;
            }

            return false;
        });

        console.debug(`Rows after level filter: ${filteredData.length}`);

        // Configurable number of rows to return (e.g., top 10)
        const maxRows = 10;
        const rowsToReturn = filteredData; // Limit the rows to the specified maximum
        // const rowsToReturn = filteredData.slice(0, maxRows); // Limit the rows to the specified maximum

        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            // This is an AJAX request, send JSON response
            return res.json({ results: rowsToReturn });
        } else {
            return res.json({ results: rowsToReturn });

            // // This is a regular page load, render the results to the template
            // res.render('rangesearch', { 
            //     results: rowsToReturn || [], // Always pass an array
            //     databaseList: ["Boss", "Miniboss", "NormalMonsters"], 
            //     error: null 
            // });
        }
    } catch (error) {
        console.error(`Error processing file: ${error.message}`);
        // If it's an API request, return JSON with error
        return res.status(500).json({ error: "Error processing the file" });
    }
});


// Secret API route
app.get('/secret', (_req, res) => {
    console.log('GET request to ""');

    // Construct the path to the sitemap file
    const filePath = path.join(__dirname, '..', 'templates', 'secret', 'index.html');
    console.log('Looking for secret at:', filePath);

    if (fs.existsSync(filePath)) {
        // Render the secret HTML file
        res.sendFile(filePath);
    } else {
        console.warn('Secret not found');
        res.status(404).json({ message: 'Secret not found' });
    }
});

app.get('/maintenance-info', (_req, res) => {
    res.json({ message: 'Website will be under maintenance on November 30 from 10 PM to 1 AM. GMT+7.' });
});

function generateTableHtml(data) {
    if (data.length === 0) {
        console.debug("No data to generate table.");
        return '<table><tr><td>No data available</td></tr></table>';
    }

    let table = '';

    // Generate table data rows
    data.forEach((row, _rowIndex) => {
        table += '<tr>';
        Object.values(row).forEach((value, _colIndex) => {
            table += `<td>${value || ''}</td>`;
        });
        table += '</tr>';
    });

    return table;
}

// Apply <br> for newlines in string values
function formatTableData(df) {
    return df.map((row, _rowIndex) => {
        const formattedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => {
                if (typeof value === 'string') {
                    const newValue = value.replace(/\n/g, '<br>');
                    return [key, newValue];
                }
                return [key, value];
            })
        );
        return formattedRow;
    });
}

// Serve the sitemap
app.get('/sitemaps', (_req, res) => {
    console.log('GET request to "/sitemaps"');

    // Construct the path to the sitemap file
    const filePath = path.join(__dirname, '..', 'database', 'sitemap.xml');
    console.log('Looking for sitemap at:', filePath);

    if (fs.existsSync(filePath)) {
        console.log('Sitemap found, serving the file');
        res.type('application/xml');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving sitemap:', err);
                res.status(500).json({ message: 'Error loading sitemap' });
            }
        });
    } else {
        console.warn('Sitemap not found');
        res.status(404).json({ message: 'Sitemap not found' });
    }
});

// Start server
const port = process.env.PORT2 || 5000;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
