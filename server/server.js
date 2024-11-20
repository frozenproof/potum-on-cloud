const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const app = express();
const platform = require('os').platform();
const bodyParser = require('body-parser');

// Use EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates'));

// Static folder for images
app.use('/images', express.static(path.join(__dirname, '../images')));

// Body parser middleware to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request for: ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// Determine metadata file based on OS
const metadataFile = platform === 'win32' ? 'metadata_windows.xlsx' : 'metadata_linux.xlsx';
const metadataPath = path.join(__dirname, '../database', metadataFile);

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

app.get('/', (req, res) => {
    console.log('GET request to "/"');
    const filePath = path.join(__dirname, '../database', defaultFile);

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
    const filePath = path.join(__dirname, '../database', file); // Construct the file path

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


app.get('/files', (req, res) => {
    const filesDir = path.join(__dirname, '../database');
    const downloadableFiles = [];

    // Recursive function to gather all .xlsx files from subdirectories
    function findFilesRecursively(directory) {
        console.log(`Searching in directory: ${directory}`);
        const items = fs.readdirSync(directory, { withFileTypes: true });
        items.forEach(item => {
            const fullPath = path.join(directory, item.name);
            if (item.isDirectory()) {
                findFilesRecursively(fullPath); // Recurse into subdirectory
            } else if (item.isFile() && item.name.endsWith('.xlsx')) {
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
    const filePath = path.join(__dirname, '../database', file);

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
app.get('/poc/health', (req, res) => {
    res.status(200).json({ message: 'API is healthy' });
});

function generateTableHtml(data) {
    if (data.length === 0) {
        console.debug("No data to generate table.");
        return '<table><tr><td>No data available</td></tr></table>';
    }

    let table = '';

    // Generate table data rows
    data.forEach((row, rowIndex) => {
        table += '<tr>';
        Object.values(row).forEach((value, colIndex) => {
            table += `<td>${value || ''}</td>`;
        });
        table += '</tr>';
    });

    return table;
}

app.get('/maintenance-info', (req, res) => {
    res.json({ message: 'Website will be under maintenance on November 30 from 10 PM to 1 AM. GMT+7.' });
});

// Apply <br> for newlines in string values
function formatTableData(df) {
    return df.map((row, rowIndex) => {
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


// Start server
const port = process.env.PORT2 || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
